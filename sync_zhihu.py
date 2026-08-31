#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 zhihu-cli 导出的 JSON 文件生成并校验站点所需的知乎快照。"""

import argparse
import json
import math
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


DEFAULT_INPUT_PATH = Path("zhihu_raw.json")
DEFAULT_OUTPUT_PATH = Path("src/data/zhihu.ts")
DEFAULT_MIN_RETAIN_RATIO = 0.5
ALLOWED_CONTENT_TYPES = {"answer", "article", "pin", "video", "question"}


class SyncValidationError(ValueError):
    """上游数据或已有快照不满足安全更新条件。"""


def load_json(filename: Path) -> Dict[str, Any]:
    """加载上游 JSON；缺失、损坏或非对象输入均立即失败。"""
    if not filename.is_file():
        raise FileNotFoundError(f"上游数据文件不存在: {filename}")

    try:
        with filename.open("r", encoding="utf-8") as file:
            payload: Any = json.load(file)
    except json.JSONDecodeError as error:
        raise SyncValidationError(f"上游数据不是有效 JSON: {filename}") from error

    if not isinstance(payload, dict):
        raise SyncValidationError("知乎接口顶层响应必须是对象")
    return payload


def normalize_total(value: Any) -> int:
    """解析接口总数，拒绝布尔值、小数、负数与其他模糊输入。"""
    if isinstance(value, bool):
        raise SyncValidationError("知乎接口返回了无效的 Paging.Totals")
    if isinstance(value, int):
        total = value
    elif isinstance(value, float) and value.is_integer():
        total = int(value)
    elif isinstance(value, str) and re.fullmatch(r"\d+", value.strip()):
        total = int(value.strip())
    else:
        raise SyncValidationError("知乎接口返回了无效的 Paging.Totals")

    if total < 0:
        raise SyncValidationError("知乎接口返回了负的 Paging.Totals")
    return total


def extract_api_items(payload: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], int]:
    """校验官方接口状态与必要的数据结构。"""
    code = payload.get("Code")
    if isinstance(code, bool) or not isinstance(code, int):
        raise SyncValidationError("知乎接口响应缺少有效的 Code")
    if code != 0:
        raise SyncValidationError(f"知乎接口拒绝请求，Code={code}")

    data = payload.get("Data")
    if not isinstance(data, dict):
        raise SyncValidationError("知乎接口响应缺少 Data 对象")

    items = data.get("Items")
    if not isinstance(items, list):
        raise SyncValidationError("知乎接口 Data.Items 必须是数组")
    if any(not isinstance(item, dict) for item in items):
        raise SyncValidationError("知乎接口 Data.Items 包含非对象记录")

    paging = data.get("Paging")
    if not isinstance(paging, dict):
        raise SyncValidationError("知乎接口响应缺少 Data.Paging 对象")
    total_available = normalize_total(paging.get("Totals"))
    if total_available < len(items):
        raise SyncValidationError("知乎接口 Paging.Totals 小于返回的记录数")

    return items, total_available


def normalize_count(value: Any) -> int:
    """把接口里的可空计数转成非负整数，拒绝有歧义的值。"""
    if value is None:
        return 0
    if isinstance(value, bool):
        raise SyncValidationError("知乎内容包含无效的布尔计数")
    if isinstance(value, int):
        count = value
    elif isinstance(value, float) and value.is_integer():
        count = int(value)
    elif isinstance(value, str) and re.fullmatch(r"\d+", value.strip()):
        count = int(value.strip())
    else:
        raise SyncValidationError("知乎内容包含无效计数")

    if count < 0:
        raise SyncValidationError("知乎内容包含负计数")
    return count


def normalize_created_at(value: Any) -> Optional[int]:
    """把秒或毫秒时间戳统一成秒；非法值不进入公开快照。"""
    if isinstance(value, bool):
        return None
    if isinstance(value, float) and not value.is_integer():
        return None
    try:
        timestamp = int(value)
    except (TypeError, ValueError):
        return None

    if timestamp > 10_000_000_000:
        timestamp //= 1000
    return timestamp if timestamp >= 0 else None


def is_zhihu_url(value: str) -> bool:
    """只接受无凭据、无自定义端口的 HTTPS 知乎链接。"""
    try:
        parsed_url = urlparse(value)
        hostname = (parsed_url.hostname or "").lower()
        return (
            parsed_url.scheme == "https"
            and parsed_url.username is None
            and parsed_url.password is None
            and parsed_url.port is None
            and (hostname == "zhihu.com" or hostname.endswith(".zhihu.com"))
        )
    except ValueError:
        return False


def format_content_item(item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """把 CLI 字段转换为前端字段，并丢弃不安全或无法识别的记录。"""
    content_type = str(item.get("ContentType") or "").lower()
    if content_type == "zvideo":
        content_type = "video"

    url = str(item.get("Url") or "")
    created_at = normalize_created_at(item.get("CreatedAt"))
    if content_type not in ALLOWED_CONTENT_TYPES:
        return None
    if not is_zhihu_url(url) or created_at is None:
        return None

    return {
        "type": content_type,
        "title": str(item.get("Title") or "")[:500],
        "url": url,
        "summary": str(item.get("Summary") or "")[:10_000],
        "likeCount": normalize_count(item.get("LikeCount")),
        "commentCount": normalize_count(item.get("CommentCount")),
        "favoriteCount": normalize_count(item.get("FavoriteCount")),
        "createdAt": created_at,
    }


def validate_normalized_contents(contents: Any) -> List[Dict[str, Any]]:
    """校验现有或待写入快照中的内容记录。"""
    if not isinstance(contents, list):
        raise SyncValidationError("知乎快照 contents 必须是数组")
    if not contents:
        raise SyncValidationError("拒绝用空内容覆盖知乎静态快照")
    if len(contents) > 50:
        raise SyncValidationError("知乎快照内容超过 50 条上限")

    validated: List[Dict[str, Any]] = []
    urls = set()
    for index, item in enumerate(contents):
        if not isinstance(item, dict):
            raise SyncValidationError(f"知乎快照第 {index + 1} 条记录不是对象")

        content_type = item.get("type")
        title = item.get("title")
        url = item.get("url")
        summary = item.get("summary")
        created_at = item.get("createdAt")
        if content_type not in ALLOWED_CONTENT_TYPES:
            raise SyncValidationError(f"知乎快照第 {index + 1} 条记录类型无效")
        if not isinstance(title, str) or len(title) > 500:
            raise SyncValidationError(f"知乎快照第 {index + 1} 条记录标题无效")
        if not isinstance(summary, str) or len(summary) > 10_000:
            raise SyncValidationError(f"知乎快照第 {index + 1} 条记录摘要无效")
        if not isinstance(url, str) or not is_zhihu_url(url):
            raise SyncValidationError(f"知乎快照第 {index + 1} 条记录链接无效")
        if url in urls:
            raise SyncValidationError(f"知乎快照包含重复链接: {url}")
        urls.add(url)

        timestamp = normalize_created_at(created_at)
        if timestamp is None:
            raise SyncValidationError(f"知乎快照第 {index + 1} 条记录时间无效")

        validated.append(
            {
                "type": content_type,
                "title": title,
                "url": url,
                "summary": summary,
                "likeCount": normalize_count(item.get("likeCount")),
                "commentCount": normalize_count(item.get("commentCount")),
                "favoriteCount": normalize_count(item.get("favoriteCount")),
                "createdAt": timestamp,
            }
        )
    return validated


def calculate_stats(contents: List[Dict[str, Any]]) -> Dict[str, int]:
    """计算内容数量及互动数据。"""
    stats = {
        "answerCount": 0,
        "articleCount": 0,
        "pinCount": 0,
        "videoCount": 0,
        "questionCount": 0,
        "totalLikes": 0,
        "totalComments": 0,
        "totalFavorites": 0,
    }

    for item in contents:
        stats[f"{item['type']}Count"] += 1
        stats["totalLikes"] += item["likeCount"]
        stats["totalComments"] += item["commentCount"]
        stats["totalFavorites"] += item["favoriteCount"]

    stats["totals"] = len(contents)
    return stats


def validate_updated_at(value: Any) -> str:
    """校验快照更新时间为带时区的 ISO 8601 字符串。"""
    if not isinstance(value, str):
        raise SyncValidationError("知乎快照更新时间必须是字符串")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as error:
        raise SyncValidationError("知乎快照更新时间不是有效的 ISO 8601 时间") from error
    if parsed.tzinfo is None:
        raise SyncValidationError("知乎快照更新时间必须包含时区")
    return value


def extract_json_assignment(source: str, start_marker: str, end_marker: Optional[str]) -> Any:
    """从自动生成的 TypeScript 文件中提取 JSON 赋值。"""
    start = source.find(start_marker)
    if start < 0:
        raise SyncValidationError(f"知乎快照缺少标记: {start_marker.strip()}")
    start += len(start_marker)

    if end_marker is None:
        raw = source[start:].strip()
        if not raw.endswith(";"):
            raise SyncValidationError("知乎快照末尾格式无效")
        raw = raw[:-1]
    else:
        end = source.find(end_marker, start)
        if end < 0:
            raise SyncValidationError(f"知乎快照缺少结束标记: {end_marker.strip()}")
        raw = source[start:end].strip()
        if not raw.endswith(";"):
            raise SyncValidationError("知乎快照赋值缺少分号")
        raw = raw[:-1]

    try:
        return json.loads(raw)
    except json.JSONDecodeError as error:
        raise SyncValidationError("知乎快照包含无效 JSON") from error


def validate_snapshot_source(source: str) -> Tuple[str, List[Dict[str, Any]], Dict[str, int]]:
    """验证自动生成的 TypeScript 快照内容和统计一致性。"""
    updated_at = extract_json_assignment(
        source,
        "export const zhihuSnapshotUpdatedAt = ",
        "\n\nexport interface ZhihuContent",
    )
    contents = extract_json_assignment(
        source,
        "export const zhihuContents: ZhihuContent[] = ",
        "\n\nexport const zhihuStats",
    )
    stats = extract_json_assignment(
        source,
        "export const zhihuStats: ZhihuStats = ",
        None,
    )

    validated_updated_at = validate_updated_at(updated_at)
    validated_contents = validate_normalized_contents(contents)
    expected_stats = calculate_stats(validated_contents)
    if not isinstance(stats, dict) or stats != expected_stats:
        raise SyncValidationError("知乎快照统计与内容不一致")
    return validated_updated_at, validated_contents, expected_stats


def validate_snapshot_file(filename: Path) -> Tuple[str, List[Dict[str, Any]], Dict[str, int]]:
    """读取并验证已有快照。"""
    if not filename.is_file():
        raise FileNotFoundError(f"知乎快照不存在: {filename}")
    return validate_snapshot_source(filename.read_text(encoding="utf-8"))


def read_min_retain_ratio() -> float:
    """读取允许保留比例，默认拒绝超过 50% 的记录骤降。"""
    raw = os.environ.get("ZHIHU_MIN_RETAIN_RATIO", str(DEFAULT_MIN_RETAIN_RATIO))
    try:
        ratio = float(raw)
    except ValueError as error:
        raise SyncValidationError("ZHIHU_MIN_RETAIN_RATIO 必须是数字") from error
    if not 0 < ratio <= 1:
        raise SyncValidationError("ZHIHU_MIN_RETAIN_RATIO 必须大于 0 且不超过 1")
    return ratio


def assert_safe_snapshot_update(new_count: int, previous_count: Optional[int]) -> None:
    """拒绝空数据及相对已有快照的异常大幅下降。"""
    if new_count <= 0:
        raise SyncValidationError("拒绝用空内容覆盖知乎静态快照")
    if not previous_count:
        return

    minimum_count = math.ceil(previous_count * read_min_retain_ratio())
    if new_count < minimum_count:
        raise SyncValidationError(
            f"知乎内容从 {previous_count} 条骤降到 {new_count} 条，低于安全阈值 {minimum_count} 条"
        )


def generate_ts_file(
    contents: List[Dict[str, Any]],
    stats: Dict[str, int],
) -> str:
    """生成类型安全的 TypeScript 数据文件。"""
    updated_at = os.environ.get("ZHIHU_SNAPSHOT_UPDATED_AT") or datetime.now(
        timezone.utc
    ).isoformat(timespec="seconds")
    validate_updated_at(updated_at)

    return f'''// 知乎数据（自动生成，请勿手动编辑）
// 最后更新: {updated_at}

export const zhihuSnapshotUpdatedAt = {json.dumps(updated_at)};

export interface ZhihuContent {{
  type: 'answer' | 'article' | 'pin' | 'video' | 'question';
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  createdAt: number | string;
  [key: string]: unknown;
}}

export interface ZhihuStats {{
  answerCount: number;
  articleCount: number;
  pinCount: number;
  videoCount: number;
  questionCount: number;
  totalLikes: number;
  totalComments: number;
  totalFavorites: number;
  totals: number;
}}

export const zhihuContents: ZhihuContent[] = {json.dumps(contents, ensure_ascii=False, indent=2)};

export const zhihuStats: ZhihuStats = {json.dumps(stats, ensure_ascii=False, indent=2)};
'''


def atomic_write_text(filename: Path, source: str) -> None:
    """在目标目录写临时文件并原子替换，失败时保留旧快照。"""
    filename.parent.mkdir(parents=True, exist_ok=True)
    temporary_path: Optional[Path] = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="\n",
            dir=filename.parent,
            prefix=f".{filename.name}.",
            suffix=".tmp",
            delete=False,
        ) as temporary:
            temporary.write(source)
            temporary.flush()
            os.fsync(temporary.fileno())
            temporary_path = Path(temporary.name)
        os.replace(temporary_path, filename)
        temporary_path = None
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


def generate_snapshot(input_path: Path, output_path: Path) -> None:
    """生成通过完整校验的新快照，并安全替换旧文件。"""
    payload = load_json(input_path)
    raw_contents, total_available = extract_api_items(payload)
    contents = [
        formatted
        for item in raw_contents
        if (formatted := format_content_item(item)) is not None
    ]
    contents = validate_normalized_contents(contents)

    previous_count: Optional[int] = None
    if output_path.exists():
        _, previous_contents, _ = validate_snapshot_file(output_path)
        previous_count = len(previous_contents)
    assert_safe_snapshot_update(len(contents), previous_count)

    stats = calculate_stats(contents)
    source = generate_ts_file(contents, stats)
    validate_snapshot_source(source)
    atomic_write_text(output_path, source)

    print(f"   上游共 {total_available} 条，本次返回 {len(raw_contents)} 条")
    print(f"   保留 {len(contents)} 条有效内容并完成原子替换")
    print(f"   回答: {stats['answerCount']}，文章: {stats['articleCount']}，想法: {stats['pinCount']}")
    print(f"   视频: {stats['videoCount']}，提问: {stats['questionCount']}")
    print(
        f"   赞同: {stats['totalLikes']}，评论: {stats['totalComments']}，收藏: {stats['totalFavorites']}"
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="只校验现有静态快照")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT_PATH)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.check:
        _, contents, stats = validate_snapshot_file(args.output)
        print(
            f"知乎静态快照校验通过：{len(contents)} 条，"
            f"{stats['totalLikes']} 赞同，{stats['totalComments']} 评论，{stats['totalFavorites']} 收藏"
        )
        return

    print("=== 同步知乎数据 ===")
    generate_snapshot(args.input, args.output)
    print("=== 同步完成 ===")


if __name__ == "__main__":
    main()

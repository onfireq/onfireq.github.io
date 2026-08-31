#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 zhihu-cli 导出的 JSON 文件生成站点所需的知乎数据。"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse


sys.stdout.reconfigure(encoding="utf-8")


def load_json(filename: str) -> Dict[str, Any]:
    """加载 zhihu-cli 生成的 JSON 文件。"""
    if not os.path.exists(filename):
        print(f"⚠️  文件不存在: {filename}")
        return {"Data": {"Items": []}}

    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize_count(value: Any) -> int:
    """把接口里的可空计数转成非负整数。"""
    try:
        return max(0, int(value or 0))
    except (TypeError, ValueError):
        return 0


def normalize_created_at(value: Any) -> Optional[int]:
    """把秒或毫秒时间戳统一成秒；非法值不进入公开快照。"""
    try:
        timestamp = int(value)
    except (TypeError, ValueError):
        return None

    if timestamp > 10_000_000_000:
        timestamp //= 1000
    return timestamp if timestamp >= 0 else None


def format_content_item(item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """把 CLI 字段转换为前端字段，并丢弃不安全或无法识别的记录。"""
    content_type = str(item.get("ContentType") or "").lower()
    if content_type == "zvideo":
        content_type = "video"

    url = str(item.get("Url") or "")
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname or ""
        port = parsed_url.port
        is_zhihu_url = (
            parsed_url.scheme == "https"
            and parsed_url.username is None
            and parsed_url.password is None
            and port in (None, 443)
            and (hostname == "zhihu.com" or hostname.endswith(".zhihu.com"))
        )
    except ValueError:
        is_zhihu_url = False
    created_at = normalize_created_at(item.get("CreatedAt"))
    if content_type not in {"answer", "article", "pin", "video", "question"}:
        return None
    if not is_zhihu_url or created_at is None:
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
        content_type = item["type"]
        if content_type == "answer":
            stats["answerCount"] += 1
        elif content_type == "article":
            stats["articleCount"] += 1
        elif content_type == "pin":
            stats["pinCount"] += 1
        elif content_type == "video":
            stats["videoCount"] += 1
        elif content_type == "question":
            stats["questionCount"] += 1

        stats["totalLikes"] += item["likeCount"]
        stats["totalComments"] += item["commentCount"]
        stats["totalFavorites"] += item["favoriteCount"]

    stats["totals"] = len(contents)
    return stats


def generate_ts_file(
    contents: List[Dict[str, Any]],
    stats: Dict[str, int],
) -> str:
    """生成类型安全的 TypeScript 数据文件。"""
    updated_at = os.environ.get("ZHIHU_SNAPSHOT_UPDATED_AT") or datetime.now(
        timezone.utc
    ).isoformat(timespec="seconds")

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


def main() -> None:
    print("=== 同步知乎数据 ===\n")

    print("1. 加载知乎内容...")
    contents_data = load_json("zhihu_raw.json")
    raw_contents = contents_data.get("Data", {}).get("Items", [])
    if not isinstance(raw_contents, list):
        raise ValueError("zhihu-cli 返回的 Data.Items 不是数组")
    contents = [
        formatted
        for item in raw_contents
        if isinstance(item, dict)
        if (formatted := format_content_item(item)) is not None
    ]
    print(f"   加载了 {len(raw_contents)} 条，保留 {len(contents)} 条有效内容")

    print("2. 计算统计...")
    stats = calculate_stats(contents)
    print(f"   回答: {stats['answerCount']}")
    print(f"   文章: {stats['articleCount']}")
    print(f"   想法: {stats['pinCount']}")
    print(f"   视频: {stats['videoCount']}")
    print(f"   提问: {stats['questionCount']}")
    print(f"   总赞同: {stats['totalLikes']}")
    print(f"   总评论: {stats['totalComments']}")
    print(f"   总收藏: {stats['totalFavorites']}")

    print("3. 生成 zhihu.ts...")
    ts_code = generate_ts_file(contents, stats)
    with open("src/data/zhihu.ts", "w", encoding="utf-8") as file:
        file.write(ts_code)
    print("   ✅ 生成成功")

    print("\n=== 同步完成 ===")


if __name__ == "__main__":
    main()

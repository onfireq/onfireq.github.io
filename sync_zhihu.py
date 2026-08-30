#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 zhihu-cli 导出的 JSON 文件生成站点所需的知乎数据。"""

import json
import os
import sys
from datetime import datetime
from typing import Any, Dict, List


sys.stdout.reconfigure(encoding="utf-8")


def load_json(filename: str) -> Dict[str, Any]:
    """加载 zhihu-cli 生成的 JSON 文件。"""
    if not os.path.exists(filename):
        print(f"⚠️  文件不存在: {filename}")
        return {"Data": {"Items": []}}

    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)


def format_content_item(item: Dict[str, Any]) -> Dict[str, Any]:
    """把 CLI 字段转换为前端使用的字段，并统一视频类型名。"""
    content_type = str(item.get("ContentType", "answer")).lower()
    if content_type == "zvideo":
        content_type = "video"

    return {
        "type": content_type,
        "title": item.get("Title", ""),
        "url": item.get("Url", ""),
        "summary": item.get("Summary", ""),
        "likeCount": item.get("LikeCount", 0),
        "commentCount": item.get("CommentCount", 0),
        "favoriteCount": item.get("FavoriteCount", 0),
        "createdAt": item.get("CreatedAt", ""),
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
        "totalLoves": 0,
        "totalComments": 0,
        "totalFavorites": 0,
    }

    for item in contents:
        content_type = str(item.get("ContentType", "")).lower()
        if content_type == "answer":
            stats["answerCount"] += 1
        elif content_type == "article":
            stats["articleCount"] += 1
        elif content_type == "pin":
            stats["pinCount"] += 1
        elif content_type in {"video", "zvideo"}:
            stats["videoCount"] += 1
        elif content_type == "question":
            stats["questionCount"] += 1

        like_count = item.get("LikeCount", 0) or 0
        stats["totalLikes"] += like_count
        stats["totalLoves"] += item.get("LoveCount") or like_count
        stats["totalComments"] += item.get("CommentCount", 0) or 0
        stats["totalFavorites"] += item.get("FavoriteCount", 0) or 0

    stats["totals"] = len(contents)
    return stats


def generate_ts_file(
    contents: List[Dict[str, Any]],
    stats: Dict[str, int],
    followees: List[Dict[str, Any]],
    favorites: List[Dict[str, Any]],
) -> str:
    """生成类型安全的 TypeScript 数据文件。"""
    formatted_contents = [format_content_item(item) for item in contents]

    return f'''// 知乎数据（自动生成，请勿手动编辑）
// 最后更新: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

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
  totalLoves: number;
  totalComments: number;
  totalFavorites: number;
  totals: number;
}}

export interface ZhihuFollowee {{
  name?: string;
  url?: string;
  avatar?: string;
  bio?: string;
  [key: string]: unknown;
}}

export interface ZhihuFavorite {{
  title?: string;
  url?: string;
  summary?: string;
  createdAt?: number | string;
  [key: string]: unknown;
}}

export const zhihuContents: ZhihuContent[] = {json.dumps(formatted_contents, ensure_ascii=False, indent=2)};

export const zhihuStats: ZhihuStats = {json.dumps(stats, ensure_ascii=False, indent=2)};

export const zhihuFollowees: ZhihuFollowee[] = {json.dumps(followees, ensure_ascii=False, indent=2)};

export const zhihuFavorites: ZhihuFavorite[] = {json.dumps(favorites, ensure_ascii=False, indent=2)};
'''


def main() -> None:
    print("=== 同步知乎数据 ===\n")

    print("1. 加载知乎内容...")
    contents_data = load_json("zhihu_raw.json")
    contents = contents_data.get("Data", {}).get("Items", [])
    print(f"   加载了 {len(contents)} 条内容")

    print("2. 加载收藏...")
    favorites_data = load_json("zhihu_favorites.json")
    favorites = favorites_data.get("Data", {}).get("Items", [])
    print(f"   加载了 {len(favorites)} 条收藏")

    print("3. 加载关注...")
    followees_data = load_json("zhihu_followees.json")
    followees = followees_data.get("Data", {}).get("Items", [])
    print(f"   加载了 {len(followees)} 个关注")

    print("4. 计算统计...")
    stats = calculate_stats(contents)
    print(f"   回答: {stats['answerCount']}")
    print(f"   文章: {stats['articleCount']}")
    print(f"   想法: {stats['pinCount']}")
    print(f"   视频: {stats['videoCount']}")
    print(f"   提问: {stats['questionCount']}")
    print(f"   总赞同: {stats['totalLikes']}")
    print(f"   总评论: {stats['totalComments']}")
    print(f"   总收藏: {stats['totalFavorites']}")

    print("5. 生成 zhihu.ts...")
    ts_code = generate_ts_file(contents, stats, followees, favorites)
    with open("src/data/zhihu.ts", "w", encoding="utf-8") as file:
        file.write(ts_code)
    print("   ✅ 生成成功")

    print("6. 生成 public/zhihu.json...")
    zhihu_json = {
        "followers": 18,
        "updated": datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    with open("public/zhihu.json", "w", encoding="utf-8") as file:
        json.dump(zhihu_json, file, ensure_ascii=False, indent=2)
    print("   ✅ 生成成功")

    print("\n=== 同步完成 ===")


if __name__ == "__main__":
    main()

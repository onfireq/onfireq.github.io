#!/usr/bin/env python3
"""
知乎创作同步脚本 v2 - 全面同步创作/收藏/关注

用法:
  # 1. PowerShell - 导出多个 JSON
  cd D:\Download\wpscomate\daybydyworkplace\portfolio-next

  & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me contents --type all --limit 50 > zhihu_raw.json
  & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me favorites recent --limit 50 > zhihu_favorites.json
  & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me followees --limit 50 > zhihu_followees.json

  # 2. Git Bash
  python sync_zhihu.py
"""
import re
import json
import os
import sys
from datetime import datetime
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = ROOT
TS_FILE = os.path.join(ROOT, "src", "data", "zhihu.ts")

TYPE_MAP = {
    "answer": "answer",
    "article": "article",
    "pin": "pin",
    "zvideo": "video",
    "question": "question",
}

# 中文标签
TYPE_LABELS = {
    "answer": "回答",
    "article": "文章",
    "pin": "想法",
    "video": "视频",
    "question": "提问",
}


def try_load(path):
    """尝试加载 JSON 文件"""
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    try:
        return json.loads(text)
    except:
        # 尝试提取 "Data" 部分
        m = re.search(r'\{[^{}]*"Data"\s*:', text)
        if m:
            start = m.start()
            depth = 0
            in_string = False
            escape = False
            for i in range(start, len(text)):
                c = text[i]
                if escape:
                    escape = False
                    continue
                if c == '\\':
                    escape = True
                    continue
                if c == '"' and not escape:
                    in_string = not in_string
                    continue
                if in_string:
                    continue
                if c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(text[start:i+1])
                        except:
                            pass
                        break
    return None


def extract_items(response):
    """从响应中提取 Items 列表"""
    if not response:
        return []
    data = response.get("Data", response)
    items = data.get("Items", [])
    return items


def extract_totals(response):
    """从响应中提取总数"""
    if not response:
        return 0
    data = response.get("Data", response)
    paging = data.get("Paging", {})
    return paging.get("Totals", len(data.get("Items", [])))


def parse_contents(contents_resp):
    """解析创作内容（带类型分组）"""
    items = extract_items(contents_resp)
    grouped = {t: [] for t in TYPE_MAP.values()}

    for it in items:
        ct = it.get("ContentType", "")
        type_key = TYPE_MAP.get(ct, "other")
        if type_key == "other":
            continue
        grouped[type_key].append({
            "type": type_key,
            "title": re.sub(r"\[图片\]|\[视频\]", "", it.get("Title", "")).replace("\r", "").replace("\n", " ").strip(),
            "url": it.get("Url", ""),
            "summary": re.sub(r"\[图片\]|\[视频\]", "", it.get("Summary", "")).replace("\r", "").replace("\n", " ").strip()[:200],
            "likeCount": it.get("LikeCount", 0),
            "commentCount": it.get("CommentCount", 0),
            "favoriteCount": it.get("FavoriteCount", 0),
            "createdAt": it.get("CreatedAt", 0),
        })

    # 按时间倒序
    for t in grouped:
        grouped[t].sort(key=lambda x: x["createdAt"], reverse=True)
    return grouped, items


def parse_followees(followees_resp):
    """解析关注列表"""
    items = extract_items(followees_resp)
    followees = []
    for it in items:
        followees.append({
            "name": it.get("Name", it.get("UserName", "")),
            "url": it.get("Url", it.get("UserUrl", "")),
            "headline": it.get("Headline", it.get("Bio", "")),
            "followerCount": it.get("FollowerCount", 0),
            "answerCount": it.get("AnswerCount", 0),
            "avatarUrl": it.get("AvatarUrl", ""),
        })
    return followees


def parse_favorites(favorites_resp):
    """解析最近收藏"""
    items = extract_items(favorites_resp)
    favorites = []
    for it in items:
        favorites.append({
            "title": it.get("Title", ""),
            "url": it.get("Url", ""),
            "contentType": TYPE_MAP.get(it.get("ContentType", ""), "other"),
            "createdAt": it.get("CreatedAt", 0),
        })
    return favorites


def to_ts(contents_by_type, totals_by_type, totals, followees, favorites, source_updated):
    """生成 TypeScript 文件"""
    # 合并所有内容到一个列表
    all_contents = []
    for items in contents_by_type.values():
        all_contents.extend(items)
    all_contents.sort(key=lambda x: x["createdAt"], reverse=True)

    items_ts = ",\n  ".join([
        f"""  {{
    type: "{item['type']}",
    title: {json.dumps(item['title'], ensure_ascii=False)},
    url: "{item['url']}",
    summary: {json.dumps(item['summary'], ensure_ascii=False)},
    likeCount: {item['likeCount']},
    commentCount: {item['commentCount']},
    favoriteCount: {item['favoriteCount']},
    createdAt: {item['createdAt']},
  }}"""
        for item in all_contents
        if item["url"]
    ])

    # 按类型的列表（每个类型单独导出）
    by_type_ts = ""
    for t, label in TYPE_LABELS.items():
        items = contents_by_type.get(t, [])
        if not items:
            continue
        items_str = ", ".join([f'"{i["url"]}"' for i in items])
        by_type_ts += f"export const zhihu{label}Urls: string[] = [{items_str}];\n"

    # 关注列表
    followees_ts = ""
    if followees:
        followees_items = ",\n  ".join([
            f"""  {{
    name: {json.dumps(f['name'], ensure_ascii=False)},
    url: "{f['url']}",
    headline: {json.dumps(f['headline'], ensure_ascii=False)},
    followerCount: {f['followerCount']},
    answerCount: {f['answerCount']},
    avatarUrl: "{f['avatarUrl']}",
  }}"""
            for f in followees
            if f.get("url")
        ])
        followees_ts = f"\nexport const zhihuFollowees = [\n{followees_items}\n];\n"

    # 收藏
    favorites_ts = ""
    if favorites:
        fav_items = ",\n  ".join([
            f"""  {{
    title: {json.dumps(f['title'], ensure_ascii=False)},
    url: "{f['url']}",
    contentType: "{f['contentType']}",
    createdAt: {f['createdAt']},
  }}"""
            for f in favorites
            if f.get("url")
        ])
        favorites_ts = f"\nexport const zhihuFavorites = [\n{fav_items}\n];\n"

    # 汇总统计
    total_likes = sum(i["likeCount"] for i in all_contents)
    total_comments = sum(i["commentCount"] for i in all_contents)
    total_favorites = sum(i["favoriteCount"] for i in all_contents)

    return f"""// 知乎个人数据 - 自动生成
// 最后同步: {source_updated}
// 数据来源: zhihu-cli

export interface ZhihuContent {{
  type: "answer" | "article" | "pin" | "video" | "question";
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  createdAt: number;
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
  totals: number;          // 知乎 API 返回的总数
}}

export const zhihuContents: ZhihuContent[] = [
{items_ts}
];

export const zhihuStats: ZhihuStats = {{
  answerCount: {totals_by_type.get('answer', 0)},
  articleCount: {totals_by_type.get('article', 0)},
  pinCount: {totals_by_type.get('pin', 0)},
  videoCount: {totals_by_type.get('video', 0)},
  questionCount: {totals_by_type.get('question', 0)},
  totalLikes: {total_likes},
  totalComments: {total_comments},
  totalFavorites: {total_favorites},
  totals: {totals},
}};

{by_type_ts}{followees_ts}{favorites_ts}
"""


def main():
    print("=" * 60)
    print("知乎数据同步 v2")
    print("=" * 60)

    # 1. 加载创作内容
    contents_resp = try_load(os.path.join(DATA_DIR, "zhihu_raw.json"))
    if not contents_resp:
        print("\n❌ 未找到 zhihu_raw.json")
        print("\n请先在 PowerShell 中运行:")
        print('  cd D:\\Download\\wpscomate\\daybydyworkplace\\portfolio-next')
        print('  & "$env:LOCALAPPDATA\\ZhihuCLI\\current\\zhihu-cli.exe" me contents --type all --limit 50 > zhihu_raw.json')
        print('  & "$env:LOCALAPPDATA\\ZhihuCLI\\current\\zhihu-cli.exe" me favorites recent --limit 50 > zhihu_favorites.json')
        print('  & "$env:LOCALAPPDATA\\ZhihuCLI\\current\\zhihu-cli.exe" me followees --limit 50 > zhihu_followees.json')
        sys.exit(1)

    contents_by_type, raw_items = parse_contents(contents_resp)
    totals = extract_totals(contents_resp)
    totals_by_type = {t: sum(1 for i in raw_items if TYPE_MAP.get(i.get("ContentType")) == t) for t in TYPE_MAP.values()}

    # 2. 加载关注列表
    followees_resp = try_load(os.path.join(DATA_DIR, "zhihu_followees.json"))
    followees = parse_followees(followees_resp) if followees_resp else []

    # 3. 加载收藏
    favorites_resp = try_load(os.path.join(DATA_DIR, "zhihu_favorites.json"))
    favorites = parse_favorites(favorites_resp) if favorites_resp else []

    # 4. 输出统计
    print(f"\n📊 创作内容统计:")
    type_names = {"answer": "回答", "article": "文章", "pin": "想法", "video": "视频", "question": "提问"}
    for t, c in totals_by_type.items():
        if c > 0:
            print(f"  {type_names.get(t, t)}: {c} 条")
    print(f"  API 总数: {totals}")

    print(f"\n👥 关注: {len(followees)} 人")
    print(f"🔖 收藏: {len(favorites)} 条")

    # 5. 写文件
    updated = datetime.now().strftime("%Y-%m-%d %H:%M")
    os.makedirs(os.path.dirname(TS_FILE), exist_ok=True)
    with open(TS_FILE, "w", encoding="utf-8") as f:
        f.write(to_ts(contents_by_type, totals_by_type, totals, followees, favorites, updated))

    print(f"\n✅ 已写入 {TS_FILE}")
    print()
    print("下一步: git add . && git commit -m '更新知乎内容' && git push")


if __name__ == "__main__":
    main()

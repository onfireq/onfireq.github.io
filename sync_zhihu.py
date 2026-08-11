#!/usr/bin/env python3
"""
知乎创作同步脚本
用法:
1. 在 PowerShell 中运行: & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me contents --type all --limit 50
2. 把输出保存到 zhihu_raw.json
3. 运行本脚本: python3 sync_zhihu.py
"""
import urllib.request
import json
import os
import re

RAW_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "zhihu_raw.json")
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "data", "zhihu.ts")

TYPE_MAP = {
    "answer": "answer",
    "article": "article",
    "pin": "pin",
}

def parse_zhihu_data(raw: str) -> list:
    """从 zhihu-cli 输出解析数据"""
    # 找到 JSON 数组
    match = re.search(r'\[\s*\{.*\}\s*\]', raw, re.DOTALL)
    if not match:
        print("未找到 JSON 数组")
        return []

    json_str = match.group(0)
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON 解析失败: {e}")
        return []

    items = []
    for item in data:
        items.append({
            "type": TYPE_MAP.get(item.get("ContentType", ""), "pin"),
            "title": item.get("Title", "").replace("[图片]", "").strip(),
            "url": item.get("Url", ""),
            "summary": item.get("Summary", "").replace("[图片]", "").strip()[:200],
            "likeCount": item.get("LikeCount", 0),
            "commentCount": item.get("CommentCount", 0),
            "createdAt": int(item.get("CreatedAt", 0)),
        })

    return items


def format_ts_file(items: list) -> str:
    """生成 TypeScript 文件内容"""
    items_ts = ",\n  ".join([
        f'''  {{
    type: "{item['type']}",
    title: {json.dumps(item['title'], ensure_ascii=False)},
    url: "{item['url']}",
    summary: {json.dumps(item['summary'], ensure_ascii=False)},
    likeCount: {item['likeCount']},
    commentCount: {item['commentCount']},
    createdAt: {item['createdAt']},
  }}'''
        for item in items
    ])

    return f"""// 知乎个人数据 - 从知乎开放平台手动导出
// 导出方法:
// 1. 访问 https://developer.zhihu.com/hotlist
// 2. 切换到"用户的创作"，点击"查看接口返回格式"
// 3. 或用 zhihu-cli: & "$env:LOCALAPPDATA\\ZhihuCLI\\current\\zhihu-cli.exe" me contents --type all --limit 50
// 4. 复制 JSON 到 zhihu_raw.json，运行 python3 sync_zhihu.py

export interface ZhihuContent {{
  type: "answer" | "article" | "pin";
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  createdAt: number;
}}

export const zhihuContents: ZhihuContent[] = [
{items_ts}
];
"""


def main():
    if not os.path.exists(RAW_FILE):
        print(f"未找到 {RAW_FILE}")
        print()
        print("请先在 PowerShell 中运行:")
        print('  & "$env:LOCALAPPDATA\\ZhihuCLI\\current\\zhihu-cli.exe" me contents --type all --limit 50')
        print()
        print("把输出保存到 zhihu_raw.json，然后再运行本脚本")
        return

    with open(RAW_FILE, "r", encoding="utf-8") as f:
        raw = f.read()

    print(f"读取 {RAW_FILE} ({len(raw)} 字符)")
    items = parse_zhihu_data(raw)
    print(f"解析到 {len(items)} 条数据")

    if not items:
        return

    # 写入 TS 文件
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(format_ts_file(items))

    print(f"已生成 {OUTPUT_FILE}")
    print()
    print("类型分布:")
    from collections import Counter
    counter = Counter(item["type"] for item in items)
    for t, c in counter.items():
        print(f"  {t}: {c}")


if __name__ == "__main__":
    main()

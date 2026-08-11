#!/usr/bin/env python3
"""
知乎创作同步脚本 - 从 zhihu-cli 输出自动解析

用法:
1. 在 PowerShell 中运行并保存到文件:
   & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me contents --type all --limit 50 > zhihu_raw.json

2. 运行本脚本:
   python3 sync_zhihu.py

脚本会解析 JSON 并写入 src/data/zhihu.ts
"""
import re
import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
RAW_FILE = os.path.join(ROOT, "zhihu_raw.json")
OUT_FILE = os.path.join(ROOT, "src", "data", "zhihu.ts")

TYPE_MAP = {
    "answer": "answer",
    "article": "article",
    "pin": "pin",
}

def find_json_array(text: str):
    """在文本中找到 JSON 数组"""
    # 找第一个 '[' 和匹配的 ']'
    start = text.find('[')
    if start == -1:
        return None

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
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return text[start:i+1]
    return None


def parse_items(text: str):
    """从文本中解析 Item 数组"""
    # 优先尝试提取 "Items": [...] 部分
    m = re.search(r'"Items"\s*:\s*(\[)', text)
    if m:
        # 从 m.end()-1 开始找匹配的 ']'
        start = m.end() - 1
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
            if c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    json_str = text[start:i+1]
                    try:
                        return json.loads(json_str)
                    except:
                        break

    # 回退到整个 JSON
    arr = find_json_array(text)
    if arr:
        try:
            data = json.loads(arr)
            if isinstance(data, list):
                return data
        except:
            pass

    return []


def to_ts(items: list) -> str:
    """生成 TypeScript 文件"""
    items_ts = ",\n  ".join([
        f"""  {{
    type: "{TYPE_MAP.get(item.get('ContentType', ''), 'pin')}",
    title: {json.dumps(item.get('Title', '').replace('[图片]', '').replace('\\r', '').replace('\\n', ' ').strip(), ensure_ascii=False)},
    url: "{item.get('Url', '')}",
    summary: {json.dumps(item.get('Summary', '').replace('[图片]', '').replace('\\r', '').replace('\\n', ' ').strip()[:200], ensure_ascii=False)},
    likeCount: {item.get('LikeCount', 0)},
    commentCount: {item.get('CommentCount', 0)},
    createdAt: {item.get('CreatedAt', 0)},
  }}"""
        for item in items
        if item.get("Url")
    ])

    return f"""// 知乎个人数据 - 自动生成
// 最后同步: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}

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
        print(f"❌ 未找到 {RAW_FILE}")
        print()
        print("请在 PowerShell 中运行:")
        print('  & "$env:LOCALAPPDATA\\ZhihuCLI\\current\\zhihu-cli.exe" me contents --type all --limit 50 > zhihu_raw.json')
        print()
        print("然后重新运行本脚本")
        sys.exit(1)

    with open(RAW_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    print(f"读取 {RAW_FILE} ({len(text)} 字符)")

    items = parse_items(text)
    print(f"解析到 {len(items)} 条内容")

    if not items:
        print("❌ 未找到任何内容")
        sys.exit(1)

    # 统计
    from collections import Counter
    type_counter = Counter(TYPE_MAP.get(item.get("ContentType", ""), "other") for item in items)
    print("\n类型分布:")
    type_names = {"answer": "回答", "article": "文章", "pin": "想法"}
    for t, c in type_counter.most_common():
        print(f"  {type_names.get(t, t)}: {c}")

    # 写文件
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write(to_ts(items))

    print(f"\n✅ 已写入 {OUT_FILE}")
    print()
    print("下一步: git add . && git commit -m '更新知乎内容' && git push")


if __name__ == "__main__":
    main()

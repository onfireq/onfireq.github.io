#!/usr/bin/env python3
import urllib.request, xml.etree.ElementTree as ET, os, re, html
from datetime import datetime

UID = "bai-ri-meng-you-54-77"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "content", "blog")
URL = f"https://rsshub.app/zhihu/people/articles/{UID}"

os.makedirs(OUT, exist_ok=True)
print("=== Zhihu Sync ===\n")

try:
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    xml = urllib.request.urlopen(req, timeout=30).read().decode()
    root = ET.fromstring(xml)
    items = root.findall(".//item")
    print(f"Found {len(items)} articles\n")
except Exception as e:
    print(f"Error: {e}")
    exit(1)

n = 0
for item in items:
    t = item.findtext("title", "")
    l = item.findtext("link", "")
    d = html.unescape(item.findtext("description", ""))
    d = re.sub(r"<[^>]+>", "", d).strip()[:200]
    p = item.findtext("pubDate", "")
    try:
        dt = datetime.strptime(p.split("+")[0].strip(), "%a, %d %b %Y %H:%M:%S")
        dt = dt.strftime("%Y-%m-%d")
    except: dt = "2026-01-01"
    if not t: continue
    s = re.sub(r'[^\w\u4e00-\u9fff-]', '-', t).strip('-')
    fp = os.path.join(OUT, f"{s}.md")
    if os.path.exists(fp): continue
    with open(fp, "w", encoding="utf-8") as f:
        f.write(f'---\ntitle: "{t}"\ndate: "{dt}"\ntags: ["知乎"]\ndescription: "{d}"\npublished: true\nsource: "{l}"\n---\n\n{d}\n\n> [原文]({l})\n')
    n += 1
    print(f"  + {t}")

print(f"\nDone! {n} new articles")

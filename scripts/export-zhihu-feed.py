"""Export the validated content snapshot for same-origin browser refreshes."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from sync_zhihu import atomic_write_text, normalize_created_at, validate_snapshot_file  # noqa: E402

updated_at, contents, stats = validate_snapshot_file(ROOT / "src/data/zhihu.ts")
profile = json.loads((ROOT / "public/zhihu-profile.json").read_text(encoding="utf-8"))
feed = {
    "schemaVersion": 1,
    "updatedAt": updated_at,
    "profile": {"followers": profile["followers"], "followersSource": "automatic"},
    "stats": {
        **{key: value for key, value in stats.items() if key != "totals"},
        "windowSize": len(contents),
        "totalAvailable": stats["totals"],
    },
    "contents": [
        {**item, "createdAt": normalize_created_at(item["createdAt"])}
        for item in contents
    ],
}
atomic_write_text(ROOT / "public/zhihu-feed.json", json.dumps(feed, ensure_ascii=False, indent=2) + "\n")
print(f"Exported {len(contents)} validated Zhihu items.")

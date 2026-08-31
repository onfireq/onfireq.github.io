#!/usr/bin/env python3
"""静态知乎快照的失败保护与原子替换测试。"""

import importlib.util
import json
import math
import shutil
import tempfile
import unittest
from pathlib import Path
from types import ModuleType
from typing import Any, Dict, List


REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
SYNC_SCRIPT = REPOSITORY_ROOT / "sync_zhihu.py"
CURRENT_SNAPSHOT = REPOSITORY_ROOT / "src/data/zhihu.ts"


def load_sync_module() -> ModuleType:
    spec = importlib.util.spec_from_file_location("sync_zhihu", SYNC_SCRIPT)
    if spec is None or spec.loader is None:
        raise RuntimeError("无法加载 sync_zhihu.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


sync = load_sync_module()


def to_upstream_item(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "ContentType": item["type"],
        "Title": item["title"],
        "Url": item["url"],
        "Summary": item["summary"],
        "LikeCount": item["likeCount"],
        "CommentCount": item["commentCount"],
        "FavoriteCount": item["favoriteCount"],
        "CreatedAt": item["createdAt"],
    }


def make_payload(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    return {
        "Code": 0,
        "Message": "success",
        "Data": {
            "Items": [to_upstream_item(item) for item in items],
            "Paging": {"Totals": len(items)},
        },
    }


class SnapshotSafetyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        _, cls.current_contents, _ = sync.validate_snapshot_file(CURRENT_SNAPSHOT)

    def create_paths(self) -> tuple[tempfile.TemporaryDirectory[str], Path, Path]:
        temporary_directory = tempfile.TemporaryDirectory()
        directory = Path(temporary_directory.name)
        input_path = directory / "zhihu_raw.json"
        output_path = directory / "zhihu.ts"
        shutil.copyfile(CURRENT_SNAPSHOT, output_path)
        return temporary_directory, input_path, output_path

    def test_rejects_unsuccessful_api_status(self) -> None:
        with self.assertRaisesRegex(sync.SyncValidationError, "Code=20001"):
            sync.extract_api_items({"Code": 20001, "Data": None})

    def test_empty_response_preserves_existing_snapshot(self) -> None:
        temporary_directory, input_path, output_path = self.create_paths()
        with temporary_directory:
            input_path.write_text(json.dumps(make_payload([])), encoding="utf-8")
            original = output_path.read_bytes()

            with self.assertRaisesRegex(sync.SyncValidationError, "空内容"):
                sync.generate_snapshot(input_path, output_path)

            self.assertEqual(output_path.read_bytes(), original)

    def test_large_record_drop_preserves_existing_snapshot(self) -> None:
        temporary_directory, input_path, output_path = self.create_paths()
        with temporary_directory:
            minimum_count = math.ceil(
                len(self.current_contents) * sync.DEFAULT_MIN_RETAIN_RATIO
            )
            if minimum_count <= 1:
                self.skipTest("当前快照太小，无法构造非空骤降样本")
            unsafe_count = minimum_count - 1
            input_path.write_text(
                json.dumps(
                    make_payload(self.current_contents[:unsafe_count]),
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            original = output_path.read_bytes()

            with self.assertRaisesRegex(sync.SyncValidationError, "骤降"):
                sync.generate_snapshot(input_path, output_path)

            self.assertEqual(output_path.read_bytes(), original)

    def test_valid_update_replaces_snapshot_without_temp_files(self) -> None:
        temporary_directory, input_path, output_path = self.create_paths()
        with temporary_directory:
            valid_count = max(
                1,
                math.ceil(len(self.current_contents) * sync.DEFAULT_MIN_RETAIN_RATIO),
            )
            retained_items = self.current_contents[:valid_count]
            input_path.write_text(
                json.dumps(make_payload(retained_items), ensure_ascii=False),
                encoding="utf-8",
            )

            sync.generate_snapshot(input_path, output_path)

            _, contents, stats = sync.validate_snapshot_file(output_path)
            self.assertEqual(len(contents), valid_count)
            self.assertEqual(stats["totals"], valid_count)
            self.assertEqual(list(output_path.parent.glob(".zhihu.ts.*.tmp")), [])


if __name__ == "__main__":
    unittest.main()

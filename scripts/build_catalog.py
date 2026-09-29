#!/usr/bin/env python3
"""Build catalog.json from policy folders.

A folder is a privacy policy when it sits at the repository root and
contains policy.json. The site reads catalog.json and does not need a
layout change when a folder is added.

policy.json:
  title    Display name on the card and tab (required)
  summary  One line under the card title (required)
  updated  Human-readable revision date (required)
  symbol   Tab icon name: wallet, ticket, lock, or doc (optional)
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {"assets", "scripts", ".github"}
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def document_title(path: Path) -> str:
    match = TITLE_RE.search(path.read_text(encoding="utf-8"))
    if not match:
        return path.stem
    return re.sub(r"\s+", " ", match.group(1)).strip()


def documents_for(folder: Path, folder_name: str) -> list[dict[str, str]]:
    pages = sorted(folder.glob("*.html"), key=lambda path: (path.name != "index.html", path.name.lower()))
    items: list[dict[str, str]] = []
    for page in pages:
        href = f"{folder_name}/" if page.name == "index.html" else f"{folder_name}/{page.name}"
        items.append(
            {
                "file": page.name,
                "title": document_title(page),
                "href": href,
            }
        )
    return items


def policies() -> list[dict[str, object]]:
    found: list[dict[str, object]] = []
    for entry in sorted(ROOT.iterdir(), key=lambda path: path.name.lower()):
        if not entry.is_dir() or entry.name.startswith(".") or entry.name in SKIP:
            continue
        meta_path = entry / "policy.json"
        if not meta_path.is_file():
            continue
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        for key in ("title", "summary", "updated"):
            if not str(meta.get(key, "")).strip():
                raise SystemExit(f"{meta_path} is missing {key}")
        found.append(
            {
                "folder": entry.name,
                "title": meta["title"].strip(),
                "summary": meta["summary"].strip(),
                "updated": meta["updated"].strip(),
                "symbol": str(meta.get("symbol") or "doc").strip() or "doc",
                "href": f"{entry.name}/",
                "documents": documents_for(entry, entry.name),
            }
        )
    found.sort(key=lambda item: str(item["title"]).casefold())
    return found


def main() -> None:
    catalog = {"policies": policies()}
    destination = ROOT / "catalog.json"
    destination.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {destination.relative_to(ROOT)} ({len(catalog['policies'])} policies)")


if __name__ == "__main__":
    main()

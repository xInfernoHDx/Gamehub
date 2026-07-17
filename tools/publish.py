#!/usr/bin/env python3
"""Publish a game build to the GameHub site.

Creates (or reuses) a GitHub Release on this repo, uploads the build zip as a
release asset, and prints the games.json entry skeleton with the final download
URL. Commit + push games.json afterward and the site updates.

Usage:
  py tools/publish.py --id my-game --title "My Game" --tag mygame-v1.0 --zip path/to/MyGame-win64.zip

Requires: gh (authenticated: `gh auth login`), Python 3. Stdlib only.
"""
import argparse
import json
import os
import subprocess
import sys

REPO = "xInfernoHDx/Gamehub"


def run(args, **kw):
    print("+ " + " ".join(args))
    return subprocess.run(args, check=True, **kw)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--id", required=True, help="game id (kebab-case, used in games.json)")
    ap.add_argument("--title", required=True)
    ap.add_argument("--tag", required=True, help="release tag, e.g. mygame-v1.0")
    ap.add_argument("--zip", required=True, help="path to the build zip to upload")
    ap.add_argument("--notes", default="", help="release notes (optional)")
    a = ap.parse_args()

    if not os.path.isfile(a.zip):
        print(f"error: zip not found: {a.zip}", file=sys.stderr)
        return 1
    asset_name = os.path.basename(a.zip)
    size_mb = os.path.getsize(a.zip) / (1024 * 1024)

    # create release if it doesn't exist, then upload (clobber = re-publish ok)
    exists = subprocess.run(["gh", "release", "view", a.tag, "--repo", REPO],
                            capture_output=True).returncode == 0
    if not exists:
        run(["gh", "release", "create", a.tag, "--repo", REPO,
             "--title", a.title, "--notes", a.notes or f"{a.title} — {a.tag}"])
    run(["gh", "release", "upload", a.tag, a.zip, "--repo", REPO, "--clobber"])

    url = f"https://github.com/{REPO}/releases/download/{a.tag}/{asset_name}"
    entry = {
        "id": a.id,
        "title": a.title,
        "tagline": "FILL ME IN",
        "genre": "FILL ME IN",
        "cover": f"assets/shots/{a.id}.jpg",
        "screenshots": [f"assets/shots/{a.id}.jpg"],
        "downloads": [{"label": "Download for Windows", "url": url,
                       "size": f"{size_mb:.0f} MB"}],
        "download_note": "Unzip and run the .exe. Windows may show a SmartScreen "
                         "warning for new indie games — choose More info, Run anyway.",
        "web": None,
        "description_html": "<p>FILL ME IN</p>",
        "meta": [["Platform", "Windows 10/11 (64-bit)"], ["Price", "Free"]],
    }
    print("\nUploaded:", url)
    print("\nAdd (or merge) this entry into games.json under \"games\", then commit + push:\n")
    print(json.dumps(entry, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

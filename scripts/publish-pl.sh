#!/usr/bin/env bash
# Publishes the Polish build (_pl/) to the GitHub Pages repo behind marcinmoskala.pl.
# Run `node build.mjs` first. Usage: scripts/publish-pl.sh [owner/repo]
set -euo pipefail
REPO="${1:-MarcinMoskala/marcinmoskala-pl}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -f "$ROOT/_pl/index.html" ] || { echo "No _pl/ build. Run: node build.mjs"; exit 1; }
git clone --quiet --depth 1 "https://github.com/$REPO.git" "$TMP/site"
find "$TMP/site" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$ROOT/_pl/." "$TMP/site/"
cd "$TMP/site"
git add -A
if git diff --cached --quiet; then echo "Nothing to publish."; exit 0; fi
git commit --quiet -m "Publish Polish site from $(git -C "$ROOT" rev-parse --short HEAD)"
git push --quiet origin HEAD
echo "Published to https://github.com/$REPO"

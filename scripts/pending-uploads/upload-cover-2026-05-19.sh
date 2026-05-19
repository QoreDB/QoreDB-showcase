#!/usr/bin/env bash
# Upload pending blog cover image for 2026-05-19
# Run this from your terminal: bash scripts/pending-uploads/upload-cover-2026-05-19.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
GENERATE_SCRIPT="$PROJECT_DIR/scripts/generate-blog-image-sharp.js"

# Load SANITY_TOKEN
if [ -f "$HOME/.config/qoredb-blog/sanity-token" ]; then
  SANITY_TOKEN=$(cat "$HOME/.config/qoredb-blog/sanity-token")
elif [ -f "$HOME/.config/qoredb-blog/.sanity-token" ]; then
  SANITY_TOKEN=$(cat "$HOME/.config/qoredb-blog/.sanity-token")
else
  echo "SANITY_TOKEN not found. Please set it manually:"
  echo "   export SANITY_TOKEN=your_token_here"
  if [ -z "$SANITY_TOKEN" ]; then
    exit 1
  fi
fi

export SANITY_TOKEN

echo "Uploading cover image for: L'auto-update dans une app Tauri : mecanisme et contraintes"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "L'auto-update dans une app Tauri : mécanisme et contraintes" \
  --subtitle "Comment QoreDB utilise tauri-plugin-updater avec un manifeste hébergé sur GitHub Releases, des binaires signés minisign et une UI custom. Un mécanisme simple, vérifiable, et sans plateforme de distribution dédiée." \
  --category "Architecture" \
  --output "/tmp/blog-cover.png" \
  --upload \
  --post-id "6c0f118b-f4d8-48d6-9da2-1f1a9edb950d"

echo "Done. You can delete this file once the upload is confirmed."

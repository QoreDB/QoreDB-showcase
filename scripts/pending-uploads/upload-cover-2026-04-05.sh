#!/usr/bin/env bash
# Upload pending blog cover image for 2026-04-05
# Run this from your terminal: bash scripts/pending-uploads/upload-cover-2026-04-05.sh

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
  echo "❌ SANITY_TOKEN not found. Please set it manually:"
  echo "   export SANITY_TOKEN=your_token_here"
  if [ -z "$SANITY_TOKEN" ]; then
    exit 1
  fi
fi

export SANITY_TOKEN

echo "🚀 Uploading cover image for: Exporter ses données en CSV, JSON, SQL, HTML, XLSX et Parquet"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "Exporter ses données en CSV, JSON, SQL, HTML, XLSX et Parquet" \
  --subtitle "QoreDB propose six formats d'export construits sur un pipeline de streaming asynchrone. Chaque format a sa logique propre, son writer dédié, et répond à un cas d'usage précis." \
  --category "Produit" \
  --output "/tmp/blog-cover.png" \
  --upload \
  --post-id "af61ee84-e4d7-49ed-b418-dad33226e8f6"

echo "✅ Done! You can delete this file once the upload is confirmed."

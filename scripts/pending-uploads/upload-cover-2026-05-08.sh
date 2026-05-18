#!/usr/bin/env bash
# Upload pending blog cover image for 2026-05-08
# Run this from your terminal: bash scripts/pending-uploads/upload-cover-2026-05-08.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
GENERATE_SCRIPT="$PROJECT_DIR/scripts/generate-blog-image-sharp.js"

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

echo "Uploading cover image for: Pourquoi QoreDB est desktop-only et le restera"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "Pourquoi QoreDB est desktop-only et le restera" \
  --subtitle "QoreDB est un client de base de données desktop, et il le restera. Cet article explique pourquoi ce choix structure l'architecture du produit et pourquoi un SaaS aurait été un mauvais format pour cet usage." \
  --category "Vision" \
  --output "/tmp/blog-cover.png" \
  --upload \
  --post-id "f8ee1087-8c96-41da-9f2d-74d4fd6b9e58"

echo "Done. You can delete this file once the upload is confirmed."

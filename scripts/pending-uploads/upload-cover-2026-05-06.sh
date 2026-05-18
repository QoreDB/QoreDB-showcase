#!/usr/bin/env bash
# Upload pending blog cover image for 2026-05-06
# Run this from your terminal: bash scripts/pending-uploads/upload-cover-2026-05-06.sh

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

echo "Uploading cover image for: La rédaction automatique des secrets dans QoreDB"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "La rédaction automatique des secrets dans QoreDB" \
  --subtitle "Comment QoreDB empêche les mots de passe, tokens et URIs avec credentials de fuir dans l'historique, les logs ou les exports." \
  --category "Security" \
  --output "/tmp/blog-cover.png" \
  --upload \
  --post-id "7a43b2c7-156c-4118-8588-e23eb8d165df"

echo "Done. You can delete this file once the upload is confirmed."

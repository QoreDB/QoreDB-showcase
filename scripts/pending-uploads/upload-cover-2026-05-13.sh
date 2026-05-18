#!/usr/bin/env bash
# Upload pending blog cover image for 2026-05-13
# Run this from your terminal: bash scripts/pending-uploads/upload-cover-2026-05-13.sh

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

echo "Uploading cover image for: Le driver CockroachDB dans QoreDB : compatibilité PostgreSQL maîtrisée"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "Le driver CockroachDB dans QoreDB : compatibilité PostgreSQL maîtrisée" \
  --subtitle "CockroachDB parle le protocole wire de PostgreSQL, mais ce n'est pas Postgres. Voici comment QoreDB tire parti de cette compatibilité tout en respectant les spécificités du moteur." \
  --category "Architecture" \
  --output "/tmp/blog-cover.png" \
  --upload \
  --post-id "23b5bc65-49d6-4a2e-83d2-a90f7945380a"

echo "Done. You can delete this file once the upload is confirmed."

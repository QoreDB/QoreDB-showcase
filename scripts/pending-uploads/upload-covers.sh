#!/usr/bin/env bash
# Upload pending blog cover images to Sanity
# Run this from your terminal: bash scripts/pending-uploads/upload-covers.sh

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

echo "🚀 Uploading 4 pending cover images to Sanity..."
echo ""

# Article 1: Vision
echo "1/4 — Pourquoi QoreDB ne traduit pas les requêtes entre moteurs [Vision]"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "Pourquoi QoreDB ne traduit pas les requêtes entre moteurs" \
  --subtitle "QoreDB fait le choix de ne pas traduire les requêtes SQL entre moteurs de bases de données. Voici pourquoi." \
  --category "Vision" \
  --output "/tmp/blog-cover-1.png" \
  --upload \
  --post-id "7a3429ec-0b73-4d00-8de9-54152f20e213"
echo ""

# Article 2: Architecture (SQLite)
echo "2/4 — Le driver SQLite dans QoreDB [Architecture]"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "Le driver SQLite dans QoreDB : WAL, extensions et fichiers locaux" \
  --subtitle "Comment QoreDB exploite SQLite en mode WAL avec support des extensions et une gestion native des fichiers locaux." \
  --category "Architecture" \
  --output "/tmp/blog-cover-2.png" \
  --upload \
  --post-id "49e1ff05-9f67-48cf-8570-d06457cbf8e9"
echo ""

# Article 3: Architecture (DuckDB)
echo "3/4 — DuckDB comme moteur de fédération [Architecture]"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "DuckDB comme moteur de fédération : pourquoi et comment" \
  --subtitle "DuckDB permet de fédérer des sources de données hétérogènes dans QoreDB. Architecture et choix techniques." \
  --category "Architecture" \
  --output "/tmp/blog-cover-3.png" \
  --upload \
  --post-id "f7cb7935-4209-4c24-ba6b-fe0ec3c5473a"
echo ""

# Article 4: Security
echo "4/4 — Le système d'environnements [Security]"
SANITY_TOKEN="$SANITY_TOKEN" node "$GENERATE_SCRIPT" \
  --title "Le système d'environnements : Dev, Staging, Prod et leurs garde-fous" \
  --subtitle "Comment QoreDB gère les environnements de développement avec des garde-fous intégrés pour protéger la production." \
  --category "Security" \
  --output "/tmp/blog-cover-4.png" \
  --upload \
  --post-id "15343070-ada9-48b0-ad62-33491fe08716"
echo ""

echo "✅ All done! You can delete this folder once uploads are confirmed."
echo "   rm -rf scripts/pending-uploads"

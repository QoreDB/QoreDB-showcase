# Articles en attente de publication

Ces articles ont été générés automatiquement mais n'ont pas pu être publiés
faute d'accès au SANITY_TOKEN depuis le sandbox.

## Pour publier

```bash
cd ~/dev/perso/QoreDB-showcase

# Charger le token
SANITY_TOKEN=$(cat ~/.config/qoredb-blog/sanity-token)

# Publier l'article du 2026-04-15 (ER Diagram)
SANITY_TOKEN=$SANITY_TOKEN node scripts/pending-articles/2026-04-15-publish.js
```

Le script publie l'article ET upload l'image de couverture en une seule passe.

## Articles en attente

| Date       | Titre                                                        | Catégorie | Script                    |
|------------|--------------------------------------------------------------|-----------|---------------------------|
| 2026-04-15 | Le diagramme ER interactif : visualiser un schéma relationnel | Produit   | 2026-04-15-publish.js     |

## Après publication

Une fois publié avec succès, le script créera `post-id.txt` avec l'ID du post.

Mets à jour manuellement le fichier `articles-tracker.json` :
- Retire le sujet de la `queue`
- Ajoute dans `published` : `{"slug": "diagramme-er-interactif-visualiser-schema-relationnel", "title": "Le diagramme ER interactif : visualiser un schéma relationnel", "category": "Produit", "publishedAt": "2026-04-15"}`

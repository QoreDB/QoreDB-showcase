# Post LinkedIn

La plupart des conseillers d'index lisent le texte SQL et devinent les colonnes filtrées. Ça tient jusqu'à la première vue, le premier alias ou le premier prédicat réécrit par l'optimiseur.

Dans QoreDB j'ai pris l'autre chemin : les suggestions d'index sont dérivées du plan EXPLAIN. Le plan dit quelle table a été lue en entier, quel filtre y était attaché, et ce que ça coûtait.

Le reste est du nettoyage. Les casts de type et les littéraux de chaîne sont retirés du filtre avant extraction, sinon un mot contenu dans une chaîne passe pour un nom de colonne. Deux seuils écartent les scans sans intérêt, parce qu'une table de quarante lignes est lue en entier quel que soit l'index. Et un prédicat du type lower(email) = 'x' ne produit aucune suggestion, puisqu'un index B-tree sur email ne serait pas utilisé.

Il n'y a pas de bouton pour exécuter le CREATE INDEX. On le copie. Poser un index prend des verrous et du temps, cette décision appartient à celui qui connaît la fenêtre de maintenance.

#QoreDB #OpenSource #PostgreSQL #MySQL #SQL #DatabasePerformance

---

# Commentaire

Le mécanisme complet est détaillé dans l'article : normalisation des plans PostgreSQL et MySQL en un seul arbre, extraction des colonnes indexables, déduplication par table et colonnes.

https://www.qoredb.com/fr/blog/suggestions-index-derivees-du-plan-explain

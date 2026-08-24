# Post LinkedIn

Sur QoreDB, la pagination des résultats est faite côté serveur avec OFFSET / LIMIT. C'est le seul mécanisme qui existe partout, avec la même sémantique, sur PostgreSQL, MySQL, SQL Server, SQLite, CockroachDB, Mongo et les autres.

Le trade-off est connu : plus l'OFFSET grandit, plus le moteur travaille pour rien avant de renvoyer sa page. Sur une exploration desktop, ce n'est presque jamais un problème réel. On filtre, on trie, on affine, et l'OFFSET utile reste bas.

Par-dessus, le Data Grid rend ça invisible : infinite scroll côté UI, requêtes paginées classiques côté transport. Chaque page est une requête SQL lisible dans les logs du moteur, annulable, cache-able. Pas de réécriture magique, pas de curseur maison.

Quand l'usage bascule vers l'extraction massive, on passe sur le streaming dédié plutôt que de faire semblant qu'OFFSET est ce qu'il n'est pas.

#QoreDB #OpenSource #Rust #Database #SQL #Postgres

---

# Commentaire

Article complet ici, avec le détail du choix et des cas où ça tient :
https://www.qoredb.com/fr/blog/pagination-offset-limit-limites-reelles

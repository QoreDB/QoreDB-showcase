# Post LinkedIn

Afficher le nombre de lignes d'une table dans un client de BDD, ça paraît trivial.

Sauf quand la table fait 400 millions de lignes.

Un SELECT COUNT(*) au chargement du browser bloque l'interface plusieurs secondes, parfois plusieurs minutes. Inacceptable.

Dans QoreDB, je lis d'abord les statistiques que le moteur maintient déjà :
- PostgreSQL : pg_class.reltuples + pg_stat_user_tables.n_live_tup
- MySQL : information_schema.TABLES.TABLE_ROWS
- SQL Server : SUM(p.rows) FROM sys.partitions
- SQLite : COUNT(*) direct (les fichiers restent petits)

Sur PostgreSQL, j'ajoute un seuil hybride : si la table fait moins de 100k lignes ou moins de 64 Mo, je lance un vrai COUNT(*) pour donner un chiffre exact. Au-delà, l'estimation suffit.

Le champ row_count_estimate est un Option<u64>. Un driver a le droit de retourner None. L'UI affiche alors rien plutôt qu'un chiffre trompeur.

Règle simple : ne jamais inventer une donnée que le moteur ne fournit pas.

#QoreDB #OpenSource #PostgreSQL #Rust #DatabaseTools #Backend

---

# Commentaire

L'article détaille l'implémentation par driver et le raisonnement derrière le seuil hybride :

https://www.qoredb.com/fr/blog/estimation-nombre-lignes-pourquoi-count-etoile

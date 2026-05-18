# Post LinkedIn

CockroachDB est wire-compatible avec PostgreSQL. Pour un client de base de données, c'est tentant de tout réutiliser tel quel. Mais wire-compatible ne veut pas dire identique.

Dans QoreDB, le driver CockroachDB partage son socle avec celui de Postgres via un module pg_compat : connexion, pool sqlx, exécution, transactions, routines, triggers. Ce qui diverge est surchargé proprement : on filtre les namespaces crdb_internal et pg_extension, on ne liste pas de vues matérialisées, on n'expose que ANALYZE en maintenance (pas de VACUUM ni REINDEX, le moteur les gère en interne), et on évite pg_stat_user_tables pour l'estimation de lignes.

Le résultat : un driver mince, des écarts assumés là où ils existent vraiment, et zéro émulation qui finirait par mentir au moteur.

#QoreDB #OpenSource #Rust #CockroachDB #PostgreSQL #Database

---

# Commentaire

L'article complet avec le détail des choix d'implémentation :
https://www.qoredb.com/fr/blog/driver-cockroachdb-compatibilite-postgresql

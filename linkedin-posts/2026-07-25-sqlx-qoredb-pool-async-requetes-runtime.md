# Post LinkedIn

Trois drivers de QoreDB parlent à leur moteur via SQLx : PostgreSQL, MySQL/MariaDB et SQLite.

Ce qui me sert au quotidien, ce n'est pas la vérification compile-time des requêtes. C'est le pool async natif, le typage précis des colonnes et l'intégration propre avec tokio.

Les macros query! et query_as! interrogent une base à la compilation pour vérifier les types. Formidable dans une app qui embarque son propre schéma. Inutile dans un client généraliste où l'utilisateur tape ses requêtes au runtime.

Sur l'API runtime (sqlx::query, sqlx::query_as), je récupère le bind sécurisé, la préparation côté serveur et un décodeur typé par colonne. Pour PostgreSQL, un dispatch construit une table de décodeurs qui préserve timestamps, numeric et enums. Pour SQLite, la classe de stockage est lue par valeur.

Un pool async par session, une connexion dédiée pour les transactions, un after_connect qui normalise sql_mode et time_zone : le backend reste léger et prédictible.

MongoDB, Redis, SQL Server et DuckDB, eux, passent par leurs crates dédiées. Chaque driver choisit sa couche.

#QoreDB #OpenSource #Rust #SQLx #PostgreSQL #DatabaseTools

---

# Commentaire

Article complet ici :
https://www.qoredb.com/fr/blog/sqlx-qoredb-pool-async-requetes-runtime

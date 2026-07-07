# Post LinkedIn

Dans un client SQL, quand je vois `author_id = 42`, j'aimerais savoir de qui il s'agit sans ouvrir un onglet et écrire un SELECT à la main.

C'est ce que fait le Foreign Key Peek dans QoreDB.

Au survol d'une cellule qui porte une FK, un tooltip s'affiche avec les colonnes de la ligne référencée. La requête part uniquement au survol, jamais en préchargement. Elle est paramétrée (`SELECT * FROM ref_table WHERE ref_col = ? LIMIT 6`), bornée par la governance policy si l'environnement est marqué Prod, et le résultat est mis en cache dans un Map côté React pour éviter les doublons.

Pas de proxy, pas d'agent, pas de préchauffage en arrière-plan. Le tooltip est le reflet exact d'une requête qu'un DBA aurait pu écrire.

Supporté par PostgreSQL, MySQL, MariaDB, SQLite, DuckDB, CockroachDB, SQL Server, TimescaleDB, Neon et Supabase. Pas de peek sur MongoDB ou Redis : pas de FK natives, pas d'émulation.

#QoreDB #OpenSource #Rust #Tauri #Postgres #Databases

---

# Commentaire

Article complet ici :
https://www.qoredb.com/fr/blog/foreign-key-peek-relations-survol-cellule

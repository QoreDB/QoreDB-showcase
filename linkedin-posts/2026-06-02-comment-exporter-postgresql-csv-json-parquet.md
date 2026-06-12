# Post LinkedIn

Exporter une base PostgreSQL vers CSV, JSON ou Parquet, ce n'est pas le même outil ni le même cas d'usage.

J'ai compilé dans un article les trois approches natives :

- CSV via COPY côté serveur (ou \copy côté client), imbattable pour un export massif et scriptable.
- JSON via row_to_json et json_agg, en privilégiant le JSONL dès qu'on dépasse quelques centaines de milliers de lignes pour éviter de tout matérialiser en mémoire.
- Parquet via l'extension pg_parquet ou via DuckDB et son postgres_scanner, sans installer quoi que ce soit côté serveur.

Le choix du format se ramène à trois questions : qui consomme le fichier, quel volume, quelle durée de vie.

Dans QoreDB, j'ai voulu que ces trois exports passent par un pipeline de streaming Rust, avec une mémoire bornée même sur des tables de plusieurs millions de lignes.

#QoreDB #OpenSource #PostgreSQL #DataEngineering #Parquet #DuckDB

---

# Commentaire

L'article complet avec les commandes exactes et les critères de choix :
https://www.qoredb.com/fr/blog/comment-exporter-postgresql-csv-json-parquet

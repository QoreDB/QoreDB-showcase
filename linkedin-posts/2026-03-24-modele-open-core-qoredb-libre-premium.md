# Post LinkedIn

J'ai publié un article sur le modèle open-core de QoreDB : ce qui est libre, ce qui ne l'est pas.

Le Core (Apache 2.0) couvre tout ce qu'un dev utilise au quotidien : les 8 drivers natifs (PG, MySQL, MongoDB, SQLite, Redis, DuckDB, SQL Server, CockroachDB), l'éditeur SQL, le DataGrid, le vault chiffré, les tunnels SSH, les protections de production, la fédération inter-bases. Libre de modifier, distribuer, utiliser commercialement.

Le Pro (BUSL-1.1) couvre les outils avancés : Sandbox Mode, Visual Data Diff, ER Diagram, audit/profiling avancés, exports XLSX/Parquet, et l'assistant IA BYOK. Ce code passera automatiquement en Apache 2.0 après 3-4 ans.

Techniquement, le split est rigoureux : chaque fichier porte un header SPDX, les features Pro sont compilées derrière des feature flags Cargo (absentes physiquement du build Core), et la vérification de licence est 100% offline via Ed25519.

Une règle sans exception : aucune feature déjà gratuite ne sera jamais reclassée en Premium.

#QoreDB #OpenSource #Rust #Tauri #OpenCore

---

# Commentaire

L'article complet est ici : https://www.qoredb.com/fr/blog/modele-open-core-qoredb-libre-premium

Détails techniques sur le mécanisme de licence, le périmètre Core/Pro, et la philosophie derrière ce choix.

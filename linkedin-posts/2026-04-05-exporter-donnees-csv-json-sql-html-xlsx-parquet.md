# Post LinkedIn

Dans QoreDB, l'export de données repose sur un pipeline de streaming asynchrone en Rust.

Chaque ligne est consommée depuis un curseur et écrite sur disque au fil de l'eau, sans charger le dataset complet en mémoire.

Six formats disponibles : CSV, JSON, SQL INSERT, HTML self-contained, XLSX et Parquet.

Le HTML génère un fichier autonome avec tri, filtrage et pagination intégrés. Zéro dépendance, ouvrable dans n'importe quel navigateur.

Tous les writers implémentent le même trait Rust (ExportWriter), ce qui rend le pipeline identique quel que soit le format de sortie.

J'explique l'architecture complète dans l'article du jour.

#QoreDB #OpenSource #Rust #Tauri #DataExport #Backend

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/exporter-donnees-csv-json-sql-html-xlsx-parquet

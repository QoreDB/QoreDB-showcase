# Post LinkedIn

Dans QoreDB, on peut joindre une table PostgreSQL avec une collection MongoDB dans une seule requête SQL. Sans ETL, sans middleware, sans infrastructure externe.

Comment ? On embarque DuckDB comme moteur de calcul éphémère.

Le pipeline fonctionne en cinq étapes : parsing des identifiants multi-sources, planification et réécriture de la requête, fetch parallèle sur toutes les connexions via tokio, chargement en tables temporaires DuckDB, puis exécution locale.

Chaque requête fédérée crée une instance DuckDB fraîche en mémoire. Pas de cache à invalider, pas d'état persistant. Les données MongoDB sont aplaties dynamiquement en colonnes relationnelles pour rendre la jointure possible.

Le tout reste 100 % local, avec des métadonnées détaillées (temps de fetch par source, warnings, lignes extraites) visibles dans l'interface.

Nouvel article sur le blog technique de QoreDB.

#QoreDB #OpenSource #DuckDB #DataFederation #Rust #Tauri

---

# Commentaire

L'article détaille le pipeline complet de fédération inter-bases dans QoreDB, du parsing SQL à l'exécution DuckDB en mémoire.

https://www.qoredb.com/fr/blog/duckdb-moteur-federation-pourquoi-comment

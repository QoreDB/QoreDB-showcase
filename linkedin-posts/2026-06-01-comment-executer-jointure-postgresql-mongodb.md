# Post LinkedIn

Joindre PostgreSQL et MongoDB dans une seule requête revient régulièrement, et pourtant aucun des deux moteurs ne sait le faire nativement.

J'ai recensé les quatre approches qui marchent en 2026 :

- ETL custom (Airbyte, Meltano, scripts) : robuste, mais lourd et toujours en retard.
- Foreign Data Wrappers Postgres (mongo_fdw) : élégant si le pushdown joue, douloureux sinon.
- Trino / Presto : la solution propre côté data engineering, mais c'est une infra à part entière.
- Fédération côté client (QoreDB via DuckDB embarqué) : exécution locale, éphémère, zéro setup serveur.

Le choix se fait moins sur la technique que sur le contexte : qui exécute la requête, à quelle fréquence, sur quel volume.

#QoreDB #OpenSource #PostgreSQL #MongoDB #DataEngineering #DuckDB

---

# Commentaire

L'article détaille chaque approche avec ses contraintes réelles :
https://www.qoredb.com/fr/blog/comment-executer-jointure-postgresql-mongodb

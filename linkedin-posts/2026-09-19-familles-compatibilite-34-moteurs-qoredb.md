# Post LinkedIn

QoreDB enregistre aujourd'hui 34 drivers. Ça ne fait pas 34 implémentations.

La majorité des moteurs récents sont wire-compatibles avec un protocole déjà supporté, donc j'ai organisé le code sur trois niveaux.

Niveau 1, une saveur sur un driver existant : TiDB, StarRocks, Doris et SingleStore sont des constructeurs du driver MySQL, Valkey/Dragonfly/KeyDB/Garnet du driver Redis. L'enum ne sert pas qu'au branding, il pilote les vraies divergences (StarRocks sans transactions, SingleStore sans SET time_zone, Keyspaces qui refuse ALLOW FILTERING).

Niveau 2, un module partagé et des drivers minces : pg_compat fait 2600 lignes (pool sqlx, keyset, streaming, annulation par PID) et sert PostgreSQL, CockroachDB, Neon, Supabase, TimescaleDB. CockroachDB délègue presque tout mais réécrit list_namespaces parce que son catalogue ne répond pas comme PostgreSQL.

Niveau 3, une implémentation dédiée quand le protocole est nouveau : Cassandra a son module CQL complet, ClickHouse son client et son mapping de types.

Ce qui rend le partage sûr, c'est que chaque moteur garde son driver_id et son contrat de capacités. Azure Synapse réutilise le driver SQL Server mais ne déclare ni transactions, ni mutations, ni triggers. L'UI lit ces flags. Une opération non supportée renvoie un "non supporté" explicite, jamais un faux succès.

#QoreDB #OpenSource #Rust #DatabaseEngineering #SoftwareArchitecture #Backend

---

# Commentaire

Le détail des trois niveaux, avec les exemples de code et les divergences par moteur, est dans l'article.

https://www.qoredb.com/fr/blog/familles-compatibilite-34-moteurs-qoredb

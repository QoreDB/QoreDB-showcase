# Post LinkedIn

QoreDB parle aujourd'hui à dix-huit moteurs : PostgreSQL, MySQL, SQL Server, SQLite, DuckDB, MongoDB, Redis, Elasticsearch, ClickHouse et leurs variantes managées.

Tous derrière un seul trait Rust, DataEngine.

Le point clé n'est pas le trait lui-même, c'est la façon dont il gère ce que les moteurs ne savent pas faire.

Une dizaine de méthodes seulement sont obligatoires. Le reste porte des implémentations par défaut, et je les ai séparées en trois familles : erreur NotSupported explicite quand la question n'a pas de sens pour ce moteur, liste vide quand elle en a un mais que la réponse est nulle, délégation vers une méthode plus simple sinon. L'interface traite ces cas différemment.

Et les capacités sont déclarées, pas devinées. L'annulation de requête n'est pas un booléen mais un enum à trois valeurs. La pagination décrit le keyset, le snapshot, le plafond d'offset. La valeur par défaut est toujours la plus pauvre possible : promettre plus est un acte explicite.

Résultat : Redis entre dans le même trait que PostgreSQL sans qu'on ait eu à inventer une notion de table pour lui.

#QoreDB #OpenSource #Rust #DatabaseTools #SoftwareArchitecture #DevTools

---

# Commentaire

L'article détaille le contrat complet, le DriverRegistry et la mutualisation via pg_compat.

https://www.qoredb.com/fr/blog/trait-dataengine-interface-rust-drivers

# Post LinkedIn

ClickHouse écoute sur deux protocoles : le natif binaire et HTTP. Pour le driver ClickHouse de QoreDB, j'ai retenu HTTP.

La raison n'est pas la performance brute. Un client de base de données exécute des requêtes qu'il ne connaît pas à l'avance : pas de structure typée à générer, pas de forme de retour connue à la compilation. Les bindings natifs sont optimisés pour l'usage inverse.

Le format JSONCompactEachRowWithNamesAndTypes règle le reste : une seule réponse porte les noms de colonnes, les types déclarés et les lignes. Nullable() et LowCardinality() sont déballés comme des modificateurs, et les valeurs qui ne tiennent pas dans un nombre JSON (Int128, Decimal, UUID) restent du texte plutôt que d'être arrondies par un passage en flottant.

Le point qui m'a demandé le plus d'attention : classer la requête avant de l'exécuter. Read, Mutation, Dangerous, Unknown. Sur ClickHouse, dangereux ne s'arrête pas à DROP et DELETE : DETACH TABLE, OPTIMIZE FINAL et SYSTEM SHUTDOWN comptent aussi. Et ce qui n'est pas reconnu renvoie Unknown, que la politique de sécurité traite comme une demande de confirmation.

Enfin, chaque requête part avec un query_id, pour qu'une annulation devienne un vrai KILL QUERY côté serveur et pas une connexion fermée pendant que le cluster continue de travailler.

#QoreDB #OpenSource #ClickHouse #Rust #DataEngineering #OLAP

---

# Commentaire

Le détail du protocole, du mapping de types et du classificateur est dans l'article.

https://www.qoredb.com/fr/blog/driver-clickhouse-http-classer-requetes

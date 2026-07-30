# Post LinkedIn

Intégrer Redis dans un client multi-bases pose une question qu'on ne peut pas éluder : comment représenter un keyspace sans faire semblant que c'est une table ?

Dans QoreDB, j'ai fait trois choix qui structurent le driver Redis.

D'abord, SCAN partout, KEYS jamais. Sur une prod chargée, KEYS bloque le serveur mono-thread. Un client desktop n'a rien à faire à provoquer ce genre d'incident.

Ensuite, une lecture guidée par TYPE. String, list, hash, set, sorted set : chaque type déclenche la bonne commande (GET, LRANGE, HSCAN, SSCAN, ZRANGE) et son propre schéma de colonnes. Rien n'est simulé.

Enfin, une classification de sécurité propre à Redis. FLUSHDB, EVAL, MIGRATE ne sont pas de simples mutations : elles peuvent contourner toutes les autres protections. Le driver les bloque en amont sur les sessions marquées production.

Le résultat : un client qui reste utile sur une instance chargée sans mentir sur ce qu'est vraiment un keyspace Redis.

#QoreDB #OpenSource #Redis #Rust #Database #Backend

---

# Commentaire

Article complet avec les détails d'implémentation (curseurs, tas borné pour la pagination, classification des sous-commandes) :

https://www.qoredb.com/fr/blog/driver-redis-navigation-type-cle-scan

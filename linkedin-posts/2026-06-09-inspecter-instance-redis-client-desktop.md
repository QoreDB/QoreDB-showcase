# Post LinkedIn

Inspecter une instance Redis depuis un client desktop, c'est moins normalisé qu'avec une base SQL.

Pas d'équivalent JDBC, chaque outil interprète la navigation à sa manière, et certains font encore des KEYS * sur des prod partagées.

Le bon réflexe c'est de vérifier trois choses sur le client qu'on utilise.

Qu'il itère avec SCAN et un curseur, pas KEYS.
Qu'il appelle TYPE avant d'afficher une clé pour utiliser la bonne commande de lecture (HGETALL, LRANGE, ZRANGE WITHSCORES, XRANGE).
Qu'il distingue clairement les commandes destructrices (FLUSHALL, FLUSHDB, EVAL, MIGRATE) des opérations de lecture.

Tour d'horizon des clients courants et choix techniques retenus dans QoreDB pour le driver Redis.

#QoreDB #OpenSource #Redis #NoSQL #Backend #SRE

---

# Commentaire

Le guide complet avec les commandes utiles et le détail des outils est ici :
https://www.qoredb.com/fr/blog/inspecter-instance-redis-client-desktop

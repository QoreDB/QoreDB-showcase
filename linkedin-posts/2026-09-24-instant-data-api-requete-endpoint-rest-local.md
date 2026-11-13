# Post LinkedIn

Une requête finit rarement sa vie à l'écran. Un script de reporting en a besoin, un notebook veut la même agrégation, un job vérifie un compteur toutes les dix minutes.

Dans QoreDB, j'ai ajouté l'Instant Data API : une requête de lecture sauvegardée devient un endpoint HTTP local. Trois contraintes posées avant la première ligne de code.

Le listener se lie strictement à 127.0.0.1, jamais à 0.0.0.0, et il n'y a pas d'option pour écouter ailleurs. Le TLS optionnel est un certificat auto-signé frappé en RAM au démarrage, jamais écrit sur disque.

Chaque endpoint porte son propre token : 32 octets aléatoires, préfixe api-, et seul le hash Argon2id est stocké. La valeur brute est affichée une fois.

Les paramètres {{nom}} sont substitués en littéraux typés selon le dialecte, en une seule passe pour qu'une valeur ne puisse pas fabriquer un placeholder. Puis la requête substituée repasse par l'analyseur de sûreté avant exécution : le contrôle read-only est refait à chaque appel, pas seulement à l'enregistrement.

Le reste suit la même logique : token bucket de 10 req/s par endpoint, masquage de colonnes appliqué avant la sérialisation JSON, et arrêt du serveur au verrouillage du vault. Un vault verrouillé et une API qui continue de servir des données, ça n'aurait pas de sens.

#QoreDB #OpenSource #Rust #API #DatabaseTools #Security

---

# Commentaire

Le détail de l'implémentation est dans l'article : bind loopback, token Argon2, substitution de paramètres et OpenAPI 3.1 généré à la demande.

https://www.qoredb.com/fr/blog/instant-data-api-requete-endpoint-rest-local

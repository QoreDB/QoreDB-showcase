# Post LinkedIn

J'ai ajouté un cache de résultats dans QoreDB, et la partie intéressante n'est pas la lecture. C'est le périmètre et l'invalidation.

Seule la navigation dans les tables passe par le cache. Le SQL que vous écrivez dans l'éditeur, jamais : une requête libre peut contenir un now(), un tirage aléatoire ou une lecture de variable de session, donc deux exécutions identiques ne veulent pas dire la même chose.

La clé porte l'identité de la connexion (driver, hôte, port, utilisateur, base, environnement), pas la session. Deux onglets partagent donc leurs entrées, et une lecture de Prod ne peut pas être servie à un onglet Staging.

Côté mémoire, un nombre d'entrées ne dit rien de l'occupation réelle : 100 aperçus de tables de config et 100 pages de table de logs, ce n'est pas le même ordre de grandeur. D'où deux plafonds en octets en plus du compteur, et un résultat trop gros qui n'est simplement jamais mis en cache.

Pour l'invalidation, j'ai choisi de vider toute la connexion à chaque mutation, pas juste la table touchée. Déduire les tables réellement modifiées par un statement est illusoire dès qu'il y a cascade, trigger ou procédure stockée. Quelques relectures de navigation coûtent moins cher qu'un écran qui affiche une ligne qu'on vient de supprimer.

Et parce qu'un cache invisible finit par être soupçonné de tout : un badge affiche l'âge de la donnée et sert de bouton de rafraîchissement forcé.

#QoreDB #OpenSource #Rust #Caching #DatabaseTools #BackendEngineering

---

# Commentaire

Le détail de l'implémentation est dans l'article : structure de la clé, les deux bornes mémoire, le TTL borné et le masquage appliqué après le cache.

https://www.qoredb.com/fr/blog/cache-resultats-lru-ttl-invalidation-connexion

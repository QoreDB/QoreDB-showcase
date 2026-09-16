# Post LinkedIn

Un client de base de données ne se teste pas avec des mocks.

Le typage des colonnes, la pagination, les curseurs, la négociation TLS : tout ça dépend du comportement exact d'un moteur, dans une version donnée. Un mock valide la forme du code, pas le protocole.

Pour QoreDB, la CI démarre donc de vraies bases en conteneurs avant de lancer cargo test : PostgreSQL, MySQL, MongoDB, une instance MongoDB en TLS et Dragonfly. Le même docker-compose que celui du dépôt, sans configuration réservée à l'intégration continue.

Deux détails qui font toute la différence au quotidien :

1. Une variable QOREDB_TEST_<SERVICE>_REQUIRED par moteur. En local, un service absent met le test en skip, donc une pile partielle donne une suite verte. En CI, la variable est à true et le même test devient bloquant : un conteneur qui meurt est un build rouge, pas une lacune silencieuse.

2. Les tests du vault tournent sous dbus-run-session avec gnome-keyring installé. Si le produit dépend du trousseau système, le test doit dépendre d'un vrai trousseau système, pas d'une abstraction inventée pour l'occasion.

Ça coûte du temps de CI et un fichier compose à maintenir. En échange, les incompatibilités de protocole se détectent au commit plutôt que chez l'utilisateur.

#QoreDB #OpenSource #Rust #DevOps #Testing #Docker

---

# Commentaire

J'ai détaillé le fonctionnement complet dans un article : le contrat de skip, les sondes de santé par moteur et le découpage en deux workflows.

https://www.qoredb.com/fr/blog/ci-qoredb-tester-drivers-vraies-bases

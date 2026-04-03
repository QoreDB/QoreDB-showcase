# Post LinkedIn

SQLite n'est pas un serveur. C'est un fichier.

Dans QoreDB, le driver SQLite en tient compte dès la première ligne de code.

Le WAL est activé par défaut pour permettre des lectures concurrentes pendant les écritures. La validation du chemin de fichier est stricte : seules les extensions reconnues (.db, .sqlite, .sqlite3) sont acceptées.

L'inspection du schéma passe par les PRAGMA natifs, pas par un information_schema simulé. Le typage dynamique de SQLite est géré proprement, en testant chaque valeur dans l'ordre des types possibles.

Et comme tous les drivers QoreDB, SQLite implémente le trait DataEngine : mutations paramétrées, transactions via connexion dédiée, streaming des résultats ligne par ligne.

Un moteur fichier traité comme un moteur à part entière.

#QoreDB #OpenSource #SQLite #Rust #Tauri #DatabaseTooling

---

# Commentaire

Nouvel article sur le blog QoreDB : comment on a implémenté le driver SQLite avec WAL par défaut, validation stricte des chemins, et toutes les capacités du trait DataEngine.

https://www.qoredb.com/fr/blog/driver-sqlite-wal-extensions-fichiers-locaux

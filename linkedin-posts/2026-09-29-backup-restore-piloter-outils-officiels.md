# Post LinkedIn

Quand j'ai ajouté le backup à QoreDB, j'avais deux options : réimplémenter les formats de dump, ou piloter les binaires officiels.

J'ai pris la seconde. Le module backup du backend Rust ne sérialise rien : il détecte pg_dump, mysqldump, mariadb-dump, mongodump et sqlite3 dans le PATH, construit leurs arguments et lance le processus.

Ce que ça implique côté code :

- aucun shell, les arguments passent un par un dans Command::arg
- un validateur d'identifiants qui refuse les noms de table commençant par un tiret, donc pas d'injection d'option
- les mots de passe via PGPASSWORD et MYSQL_PWD plutôt que sur la ligne de commande, et tirés du vault sans jamais remonter au frontend
- stdout et stderr streamés ligne à ligne vers l'UI, avec un job_id et un bouton d'annulation câblé avant la première sortie

Le vrai bénéfice est pour l'utilisateur : le fichier produit est un dump PostgreSQL ordinaire. Un collègue qui n'a pas QoreDB le restaure avec psql.

DuckDB est le contre-exemple utile : pas de binaire externe, mais EXPORT DATABASE en SQL natif. Même règle, mécanisme officiel du moteur, même forme d'événements côté front.

#QoreDB #OpenSource #Rust #PostgreSQL #DevTools #Database

---

# Commentaire

L'article détaille la détection des binaires, la construction des arguments par driver et le streaming des processus.

https://www.qoredb.com/fr/blog/backup-restore-piloter-outils-officiels

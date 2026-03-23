# Post LinkedIn

Un DROP TABLE en production, ça arrive plus souvent qu'on ne le pense.

Dans QoreDB, chaque connexion est classée par environnement : Dev, Staging, Production.

En production, les requêtes destructrices (DROP, TRUNCATE) sont bloquées côté backend, en Rust, avant d'atteindre le moteur de base de données.

Le parsing est fait avec sqlparser, un vrai parser AST, pas un regex sur la chaîne SQL. Chaque dialecte (PostgreSQL, MySQL, DuckDB, SQL Server) a son propre analyseur.

Le Safety Engine applique des règles graduées : blocage, confirmation obligatoire, ou avertissement. Et ces règles sont personnalisables, avec des overrides par variable d'environnement pour les déploiements gérés.

Un choix simple : rendre l'accident structurellement impossible, pas juste improbable.

#QoreDB #OpenSource #Rust #DatabaseSecurity #Tauri #DevTools

---

# Commentaire

Nouvel article sur le blog QoreDB : comment fonctionne le blocage des mutations en production, du parsing SQL au moteur de règles.

https://www.qoredb.com/fr/blog/pourquoi-qoredb-bloque-mutations-production

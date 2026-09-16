# Post LinkedIn

"Créer une base" ne veut pas dire la même chose selon le moteur, et c'est un piège classique quand on construit un client multi-bases.

Sur MySQL, c'est un CREATE DATABASE. Sur PostgreSQL, ce que le développeur veut au quotidien est un CREATE SCHEMA. Sur Cassandra, c'est un keyspace avec sa stratégie de réplication. Sur MongoDB, la base n'existe pas tant qu'elle n'a pas de collection.

Dans QoreDB, j'ai refusé d'inventer un vocabulaire commun pour masquer ces écarts. Chaque driver déclare ce que l'action de création signifie chez lui, et c'est ce libellé qui s'affiche. Redis et SQLite, qui n'ont pas de DDL de création, ne montrent simplement pas l'entrée de menu.

Le formulaire ne construit aucune requête : il appelle une commande Tauri qui délègue au driver, et chaque driver écrit le DDL de son propre moteur, avec sa validation d'identifiant et son échappement.

Pour la suppression, deux gestes distincts sont demandés, dont retaper le nom exact. Retaper un nom oblige à le lire, et lire le nom oblige à vérifier sur quelle connexion on se trouve.

#QoreDB #OpenSource #PostgreSQL #Rust #DatabaseTools #DevTools

---

# Commentaire

J'ai détaillé le fonctionnement complet dans un article : comment le DDL est écrit par le driver, pourquoi les charsets MySQL sont lus sur le serveur, et comment l'interceptor de requêtes contrôle ces opérations.

https://www.qoredb.com/fr/blog/creer-supprimer-base-interface-ddl-guide

# Post LinkedIn

Dans QoreDB, chaque connexion déclare son environnement : Dev, Staging ou Production.

Ce n'est pas juste un label. C'est une métadonnée persistée dans le vault chiffré, propagée au backend Rust, et utilisée par un moteur de règles pour adapter les garde-fous.

En dev, aucune restriction. En staging, les UPDATE/DELETE sans WHERE demandent confirmation. En prod, les DROP et TRUNCATE sont bloqués, les DELETE exigent un acquittement explicite.

L'analyse passe par sqlparser, qui parse l'AST selon le dialecte du driver. Pas de regex approximatives, une vraie classification syntaxique.

Le tout est configurable par variables d'environnement pour les déploiements managés.

J'explique le mécanisme complet dans l'article du jour.

#QoreDB #OpenSource #DatabaseSecurity #Rust #Tauri #DevTools

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/systeme-environnements-dev-staging-prod-garde-fous

# Post LinkedIn

Donner à un agent IA l'accès à une base de données, c'est d'abord un problème d'autorisation, pas de protocole.

Dans QoreDB, j'ai choisi de ne pas écrire un serveur MCP qui redemande des identifiants. Le serveur réutilise ce que l'app a déjà : le vault chiffré, les drivers natifs, la classification des requêtes et le journal d'audit.

Deux contraintes sont posées côté serveur, pas côté modèle :

Aucune connexion n'est visible par défaut. Il faut cocher une case par connexion. Et l'ordre compte : le drapeau d'exposition est vérifié avant que le moindre secret ne sorte du keychain.

La lecture seule est forcée sur la configuration de connexion, quelle que soit la valeur enregistrée. Chaque requête passe par le même preflight que celles tapées dans l'éditeur, et une requête que l'analyseur SQL n'arrive pas à classer est refusée plutôt que tolérée.

Le reste suit : plafond de lignes, timeout, limitation du débit, sessions fermées après dix minutes d'inactivité, et une source « mcp » distincte dans l'audit pour savoir après coup ce qui venait d'un agent.

Le tout tient dans un binaire séparé sous Apache 2.0, compatible avec n'importe quel client MCP.

#QoreDB #OpenSource #MCP #Rust #DevTools #DatabaseSecurity

---

# Commentaire

L'article détaille l'architecture du serveur : pourquoi un binaire à part, où l'opt-in est vérifié, et les huit outils exposés.

https://www.qoredb.com/fr/blog/serveur-mcp-qoredb-lecture-seule-opt-in

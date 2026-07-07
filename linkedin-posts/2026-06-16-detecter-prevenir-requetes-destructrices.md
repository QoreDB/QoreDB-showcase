# Post LinkedIn

Dans un client de base de données, détecter ce qui peut casser une prod ne peut pas reposer sur une regex `DROP|DELETE`.

Pour QoreDB, j'ai choisi d'attaquer le problème côté backend avec un parseur d'AST (sqlparser-rs). Un `Statement::Drop`, un `Statement::Truncate`, un `Statement::Update` sans clause `selection`: c'est l'arbre syntaxique qui décide, pas une recherche de mots-clés.

L'analyse est croisée avec l'environnement déclaré pour la connexion (Dev, Staging, Prod) et une policy. En Prod, soit la requête est refusée, soit elle exige un jeton de confirmation à TTL court, lié à un nom d'action précis et consommé une seule fois. Un appel direct au binding Tauri ne peut pas falsifier l'acceptation.

Et au-delà des classiques: DuckDB a ses commandes spécifiques (`INSTALL`, `LOAD`, `ATTACH`, `COPY ... TO`), SQLite ses PRAGMAs (`writable_schema`, `journal_mode = OFF`), tous traités par des classifieurs dédiés.

Un seul fichier Rust à raisonner, un seul fichier Rust à tester.

#QoreDB #OpenSource #Rust #Database #SQL #Security

---

# Commentaire

L'article détaille le pipeline complet, le rôle de la cache LRU, et le traitement à part de ClickHouse:

https://www.qoredb.com/fr/blog/detecter-prevenir-requetes-destructrices

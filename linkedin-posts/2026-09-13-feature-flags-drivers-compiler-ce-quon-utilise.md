# Post LinkedIn

QoreDB reconnaît aujourd'hui plus de trente moteurs de base de données. Tous ne sont pas compilés dans tous les binaires.

Chaque driver est derrière un feature flag Cargo, et chaque flag active exactement les dépendances de ce moteur. driver-snowflake tire reqwest, jsonwebtoken et rsa parce que Snowflake s'authentifie par JWT signé. driver-sqlserver tire Tiberius et bb8. Si le flag n'est pas activé, rien de tout ça n'entre dans le binaire.

Les familles de moteurs partagent leur transport : TiDB, StarRocks et SingleStore passent par sqlx-mysql, Valkey et Dragonfly par le client Redis. Chaque variante garde son identifiant et ses capacités déclarées, parce que la compatibilité de protocole ne veut pas dire compatibilité fonctionnelle.

Ce qui m'intéresse le plus, c'est la cohérence de bout en bout : le DriverRegistry est peuplé sous #[cfg(feature = ...)], et l'interface lit ce registre au lieu d'une liste codée en dur. Un build restreint expose une UI restreinte, sans un seul cfg côté frontend.

Résultat concret : l'app desktop embarque all-drivers, mais un cargo build -p qore-cli --no-default-features --features driver-postgres donne un binaire qui ne sait parler qu'à PostgreSQL. Utile en CI, utile pour un serveur MCP exposé à un agent.

#QoreDB #OpenSource #Rust #Cargo #DatabaseTools #SoftwareArchitecture

---

# Commentaire

J'ai détaillé le graphe de features, la cascade entre les crates du workspace et le lien avec le DriverRegistry dans l'article complet.

https://www.qoredb.com/fr/blog/feature-flags-drivers-compiler-ce-quon-utilise

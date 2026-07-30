# Post LinkedIn

Nouveau billet sur la gestion du TLS dans QoreDB.

Chaque moteur a sa propre grammaire : PostgreSQL parle sslmode avec six valeurs, MySQL manipule un enum typé, MongoDB pilote le TLS par le schéma d'URI, Redis fait pareil avec rediss://, SQL Server gère un EncryptionLevel via Tiberius.

J'ai fait le choix de ne pas unifier tout ça derrière une abstraction commune. Chaque driver traduit fidèlement le mode demandé, et un ssl_mode textuel prend le pas sur le booléen ssl quand il est présent.

Concret : coller une URL Postgres avec sslmode=verify-full donne exactement sslmode=verify-full à libpq. Un utilisateur qui debug un handshake lit la doc du moteur, pas la doc QoreDB.

ClickHouse a une garde spécifique : refus de la connexion si un mot de passe est envoyé sur HTTP clair. Les drivers Elasticsearch et OpenSearch honorent un CA custom via reqwest et rustls-tls.

#QoreDB #OpenSource #Rust #PostgreSQL #Security #TLS

---

# Commentaire

L'article complet ici, avec le détail par driver et le parseur d'URL qui reconstitue le mode :
https://www.qoredb.com/fr/blog/gestion-connexions-ssl-tls-selon-moteur

# Post LinkedIn

Dans QoreDB, chaque requête SQL passe par un pipeline d'interception côté Rust avant d'atteindre le driver de base de données.

Ce pipeline, le Universal Query Interceptor, fait trois choses :
- Il journalise chaque opération en JSONL pour la traçabilité
- Il mesure les latences et détecte les slow queries (P50, P95, P99)
- Il applique des règles de sécurité : DROP et TRUNCATE bloqués en prod, DELETE avec confirmation, UPDATE sans WHERE intercepté

La première version était côté frontend. On l'a réécrite intégralement en Rust. Raison simple : une règle de sécurité dans le processus de rendu d'une app desktop, c'est contournable. Dans le backend Tauri, ça ne l'est pas.

L'overhead est de 0.1 à 0.5 ms par requête. Et les règles sont extensibles via l'UI.

#QoreDB #OpenSource #Rust #Tauri #DatabaseSecurity #Backend

---

# Commentaire

L'article complet sur l'architecture de l'intercepteur, avec le détail du pipeline et des règles de sécurité :
https://www.qoredb.com/fr/blog/universal-query-interceptor-hooks-profiling-prevention

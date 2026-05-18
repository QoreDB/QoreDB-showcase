# Post LinkedIn

Annuler une requête longue, ça paraît trivial. Mais quand on supporte PostgreSQL, MySQL, MongoDB, Redis, SQL Server, SQLite et CockroachDB dans le même client, chaque moteur a son propre mécanisme. Et certains n'en ont aucun.

Dans QoreDB, j'ai fait le choix de ne pas masquer ces différences derrière une fausse abstraction.

PostgreSQL et CockroachDB utilisent pg_cancel_backend(pid).
MySQL et SQL Server passent par KILL QUERY / KILL avec l'identifiant de connexion.
MongoDB et Redis n'ont pas d'API d'annulation serveur dans leurs drivers Rust, donc QoreDB abandonne la tâche Tokio côté client via handle.abort(). La connexion locale est libérée immédiatement.
SQLite refuse explicitement : sqlite3_interrupt n'est pas appelable depuis une autre connexion, donc on retourne not_supported plutôt que de simuler un succès.

Quand vous cliquez sur Annuler dans QoreDB, vous savez ce qui se passe vraiment. Pas de cohérence apparente au prix de la transparence.

#QoreDB #OpenSource #Rust #PostgreSQL #MongoDB #DatabaseTools

---

# Commentaire

Article complet avec les détails par driver et le flow côté UI :
https://www.qoredb.com/fr/blog/annulation-requetes-selon-moteur

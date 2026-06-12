# Post LinkedIn

Quand une base PostgreSQL ralentit, le réflexe c'est souvent de regarder le CPU ou la RAM.

En pratique, le vrai signal vient d'ailleurs : une poignée de requêtes qui s'exécutent souvent, ou quelques requêtes lentes très coûteuses.

PostgreSQL livre nativement tout ce qu'il faut pour les identifier.

pg_stat_statements pour la vue agrégée par empreinte de requête.
log_min_duration_statement pour capter les pics qui se cachent dans la moyenne.
auto_explain pour récupérer le plan réel des requêtes lentes en production.
EXPLAIN ANALYZE pour creuser une requête précise.

Au-dessus, pgBadger fait du rapport offline, pganalyze pousse le SaaS, et QoreDB ajoute un audit côté client avec fingerprint et percentiles P50/P95/P99 sur ce qui passe par le développeur.

J'ai écrit un guide pratique qui décrit le workflow pas à pas.

#QoreDB #OpenSource #PostgreSQL #DatabasePerformance #SRE #Backend

---

# Commentaire

Le guide complet avec les commandes et les paramètres de configuration est ici :
https://www.qoredb.com/fr/blog/auditer-requetes-lentes-postgresql

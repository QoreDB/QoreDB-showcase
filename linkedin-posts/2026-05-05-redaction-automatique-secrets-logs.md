# Post LinkedIn

Un client de base de données voit passer beaucoup de données sensibles : credentials, jetons, contenu utilisateur. Le risque, ce n'est pas seulement leur exécution, c'est leur trace.

Dans QoreDB, la rédaction des secrets repose sur deux mécanismes complémentaires.

D'abord, un wrapper Sensitive<T> côté Rust. Tout secret manipulé en mémoire passe par lui. Debug, Display et Serialize émettent [REDACTED] ou ***. Pour accéder à la valeur, il faut appeler .expose() ou .into_inner(). C'est le compilateur qui empêche les fuites accidentelles dans les logs.

Ensuite, une fonction redact_query spécialisée par moteur. SQL, MongoDB et Redis ont chacun leur stratégie : URI de connexion, assignations password=/token=, littéraux entre quotes, clés sensibles JSON, AUTH, CONFIG SET requirepass, ACL SETUSER, EVAL collapsé.

La rédaction est appliquée aux frontières de persistance, pas à l'exécution. Le moteur reçoit la requête brute. Le journal d'audit, la mémoire des slow queries, l'export et l'historique reçoivent la version masquée.

#QoreDB #OpenSource #Rust #Security #Observability #DataPrivacy

---

# Commentaire

L'article complet, avec les détails par moteur (SQL, MongoDB, Redis) et la mécanique de Sensitive<T>, est ici :
https://www.qoredb.com/fr/blog/redaction-automatique-secrets-logs

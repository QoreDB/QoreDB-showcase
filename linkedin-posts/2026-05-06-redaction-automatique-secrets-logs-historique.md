# Post LinkedIn

Un client de base de données touche en permanence à des secrets : URIs avec mot de passe, requêtes contenant des tokens, commandes Redis avec AUTH.

Le risque n'est pas une faille spectaculaire, c'est l'accumulation discrète de ces valeurs dans l'historique local, dans les logs d'erreur, dans les exports.

Dans QoreDB, j'ai pris deux décisions sur ce point.

D'abord un type Rust Sensitive<T> qui rend la fuite impossible à compiler : Debug, Display et Serialize renvoient toujours [REDACTED]. Pour accéder à la valeur, le code doit appeler explicitement .expose(). C'est une garantie statique, auditable.

Ensuite trois pipelines de redaction spécialisés par moteur (SQL, MongoDB, Redis) qui nettoient les requêtes au moment où elles franchissent une frontière de persistance. La requête en mémoire reste intacte pour l'analyse de sécurité, mais ce qui touche le disque est nettoyé.

Une regex universelle aurait été plus simple. Elle aurait soit cassé des requêtes légitimes, soit laissé passer des secrets selon le format. Trois pipelines connus donnent un résultat plus prévisible.

#QoreDB #OpenSource #Rust #Security #DatabaseTools

---

# Commentaire

L'article complet avec les patterns regex utilisés et les frontières exactes où la rédaction s'applique :
https://www.qoredb.com/fr/blog/redaction-automatique-secrets-logs-historique

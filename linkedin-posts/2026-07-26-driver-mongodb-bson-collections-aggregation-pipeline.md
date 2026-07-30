# Post LinkedIn

Intégrer MongoDB dans un client de BDD généraliste ne devrait pas revenir à faire semblant que c'est du SQL.

Dans QoreDB, chaque document remonte comme une seule colonne JSON, avec les types BSON préservés (ObjectId, Int64, Date). Pas d'aplatissement forcé, pas de colonnes fantômes.

Côté agrégation, j'ai écrit un validateur AST dédié qui rejette les opérateurs à risque ($function, $accumulator, $where) et classe les stages $out et $merge comme mutations, pour les faire passer par les mêmes garde-fous que DELETE en production.

La pagination reprend la stratégie keyset des drivers SQL, adaptée au BSON via un $or lexicographique dans le find.

Un seul mot d'ordre : respecter le modèle documentaire au lieu de l'émuler.

#QoreDB #OpenSource #MongoDB #Rust #Database #NoSQL

---

# Commentaire

L'article détaille l'architecture du driver, la validation du pipeline et la pagination par curseur :

https://www.qoredb.com/fr/blog/driver-mongodb-bson-collections-aggregation-pipeline

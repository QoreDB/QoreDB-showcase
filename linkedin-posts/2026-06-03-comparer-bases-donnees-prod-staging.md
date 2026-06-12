# Post LinkedIn

Comparer deux bases Prod et Staging, c'est en fait deux problèmes distincts.

Le schéma d'un côté : pg_dump + diff, Liquibase, migra. Du SQL versionnable, facile à brancher en CI.

Les données de l'autre : c'est plus piégeux. EXCEPT/MINUS marche en SQL maison mais ne dit pas quelles colonnes diffèrent. Pour de gros volumes, l'approche checksum par blocs (data-diff, Datafold) reste la bonne réponse.

Mais pour le cas le plus fréquent (un dev qui veut comprendre pourquoi UNE ligne diffère entre Prod et Staging), tous ces outils sont surdimensionnés.

Dans QoreDB, j'ai intégré un Visual Data Diff côté client : deux connexions, deux tables, détection auto de la clé primaire, surlignage des cellules modifiées. Le même paradigme qu'un diff Git, mais sur des lignes de données.

Article complet en commentaire.

#QoreDB #OpenSource #PostgreSQL #DevTools #Database #DataEngineering

---

# Commentaire

L'article détaille les différentes approches (pg_dump, Liquibase, Datafold, data-diff) et explique le fonctionnement du Visual Data Diff de QoreDB :

https://www.qoredb.com/fr/blog/comparer-bases-donnees-prod-staging

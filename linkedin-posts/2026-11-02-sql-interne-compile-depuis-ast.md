# Post LinkedIn

Un client de base de données ne se contente pas d'exécuter le SQL qu'on lui donne. Il en génère aussi beaucoup lui-même : lister une table avec tri et pagination, appliquer un filtre de la grille, compter, préparer un export.

Le réflexe rapide est de concaténer des chaînes. Au bout de quelques moteurs, c'est un passif : guillemets doubles sur PostgreSQL, backticks sur MySQL, crochets sur SQL Server, placeholders en $1, en ? ou en @p1, et un LIMIT/OFFSET qui devient OFFSET/FETCH NEXT sur SQL Server.

Dans QoreDB, ce SQL part d'un arbre typé que je compile ensuite pour sept dialectes. La traversée de l'arbre ne connaît pas le moteur ; un trait DialectOps porte tout ce qui varie, avec une implémentation par dialecte de quarante lignes.

Deux conséquences que j'apprécie au quotidien. Tout littéral devient un paramètre lié, donc l'injection sort du périmètre plutôt que d'être surveillée. Et quand il n'y a pas d'équivalent honnête sur un moteur, par exemple FULL OUTER JOIN sur MySQL, le compilateur rend une erreur typée côté client au lieu d'émuler quelque chose.

À noter : ça ne concerne que le SQL que l'outil produit. Ce que l'utilisateur écrit part tel quel au driver, sans réécriture. C'est une règle que je ne compte pas changer.

#QoreDB #OpenSource #Rust #SQL #DatabaseTools #SoftwareArchitecture

---

# Commentaire

J'ai détaillé le compilateur dans un article : les deux couches, le traitement des placeholders et du quoting, les garde-fous sur la profondeur d'AST et le nombre de paramètres, et les tests de propriétés qui reparsent le SQL émis.

https://www.qoredb.com/fr/blog/sql-interne-compile-depuis-ast

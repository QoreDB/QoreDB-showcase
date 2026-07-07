# Post LinkedIn

Sur QoreDB, éditer une valeur dans une table se fait en double-cliquant sur la cellule. J'ai voulu documenter comment c'est câblé, parce que c'est l'une des opérations les plus faciles à mal implémenter dans un client de base.

Trois règles portent la fonctionnalité.

La clé primaire vient toujours du moteur. Pas d'heuristique côté client, pas de FK inventée. Si la base ne déclare pas de PK, l'édition est refusée avant d'ouvrir l'input.

La mutation ne touche que la colonne modifiée. Un UPDATE paramétré ciblé, ou un updateOne + $set côté MongoDB. Le driver reste natif, aucune couche ne réécrit la syntaxe.

La conversion de type est minimale. Le client détecte les booléens, les numériques, NULL et JSON à partir du type déclaré, mais si la base rejette la valeur, on remonte son erreur telle quelle. C'est le moteur qui arbitre, pas le grid.

Les environnements Staging et Prod déclenchent une confirmation avec valeur avant/après. Le mode Sandbox stocke la modification localement sans jamais parler à la base.

#QoreDB #OpenSource #Rust #Tauri #DatabaseTools #PostgreSQL

---

# Commentaire

L'article complet, avec le détail du hook useInlineEdit, de la commande Tauri updateRow et du parcours par driver :
https://www.qoredb.com/fr/blog/inline-edit-data-grid-modifier-cellule-directement

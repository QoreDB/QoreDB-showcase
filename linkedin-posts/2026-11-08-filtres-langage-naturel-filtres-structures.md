# Post LinkedIn

QoreDB a une barre de filtre en langage naturel dans le Data Grid. On écrit "les commandes de plus de 500 euros passées la semaine dernière" et la grille se filtre.

L'implémentation évidente consiste à demander au modèle d'écrire la clause WHERE. Je ne l'ai pas fait.

Le modèle rend un tableau JSON de filtres typés : colonne, opérateur dans une liste fermée de onze valeurs, valeur scalaire. La réponse est désérialisée dans un Vec<ColumnFilter> par serde. Un opérateur inventé ou une valeur qui n'est pas un scalaire, et la commande échoue. Pas de chemin de secours.

Ce type existait déjà : c'est celui des filtres par colonne qu'on pose à la souris. Donc chaque valeur emprunte le chemin des paramètres liés, $1 sur PostgreSQL, ? sur MySQL et SQLite, un document BSON sur MongoDB. Rien de ce que le modèle écrit n'atteint le moteur sous forme de chaîne concaténée.

Les dates relatives sont résolues en bornes absolues, à partir d'un "today" fourni par l'appelant plutôt que devinée par le modèle. Et l'utilisateur relit des pastilles avant d'appliquer : colonne, opérateur, valeur. Trois choses vérifiables en une seconde, au lieu d'un dialecte SQL.

La fonctionnalité cesse d'être une nouvelle façon d'interroger la base. Elle devient une façon de remplir un formulaire qui existait déjà, avec les garanties qu'il avait déjà.

#QoreDB #OpenSource #Rust #SQL #DataEngineering #AI

---

# Commentaire

L'article détaille le contrat de sortie, les garde-fous côté Rust et la traduction par driver :

https://www.qoredb.com/fr/blog/filtres-langage-naturel-filtres-structures

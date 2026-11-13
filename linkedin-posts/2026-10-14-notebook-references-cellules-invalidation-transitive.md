# Post LinkedIn

J'ai écrit le Notebook de QoreDB autour d'une question simple : dans un notebook SQL, quand une cellule peut consommer le résultat d'une autre, que devient ce résultat quand l'amont change ?

Les notebooks de calcul relancent automatiquement. Sur une base de données, ça veut dire déclencher une requête d'une minute, ou scanner une table de prod, sans que personne ne l'ait demandé.

J'ai choisi l'autre réponse : marquer périmé, ne rien relancer.

Concrètement, une cellule porte une étiquette, une autre écrit $comptes.id et récupère les valeurs sous forme de liste utilisable dans un IN. La propagation du "périmé" est un calcul de point fixe sur les étiquettes : éditer la première cellule d'une chaîne marque toute la suite en une passe, suppression d'une cellule comprise.

Une référence ne se résout que si exactement une cellule porte l'étiquette, qu'elle est en succès, que son résultat n'est pas tronqué et que la colonne n'est pas masquée. Sinon l'exécution s'arrête et nomme le jeton fautif. Une liste incomplète donnerait une requête juste en apparence.

Et le notebook reste un fichier .qnb en JSON validé à l'ouverture, versionné à côté du dépôt.

#QoreDB #OpenSource #SQL #Rust #DeveloperTools #DataEngineering

---

# Commentaire

Le détail du format .qnb, de la résolution des références et du contexte d'exécution est dans l'article :

https://www.qoredb.com/fr/blog/notebook-references-cellules-invalidation-transitive

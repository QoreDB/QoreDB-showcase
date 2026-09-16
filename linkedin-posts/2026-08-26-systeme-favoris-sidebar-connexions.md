# Post LinkedIn

Quand on gère une quinzaine de connexions, la liste plate cesse de fonctionner. On ne cherche plus une base, on scanne une colonne.

Dans QoreDB, j'ai répondu à ça avec trois mécanismes seulement : des favoris épinglés en haut, un filtre par nom, et un arbre de schéma qui ne se charge que pour la connexion active.

Le point qui m'intéresse le plus, c'est où vit chaque donnée. Une connexion enregistrée est une donnée de travail : elle va sur le disque, dans le workspace, avec son secret dans le vault chiffré. Un favori n'est qu'une préférence d'affichage locale : il va dans le localStorage, sous une clé namespacée par workspace.

Concrètement, les favoris sont un simple tableau de chaînes. Pas d'objets, pas de timestamps. L'ordre du tableau est l'ordre d'affichage. Une connexion supprimée laisse un identifiant orphelin, réconcilié à chaque chargement de la sidebar plutôt que par une tâche de nettoyage.

Résultat : une soixantaine de lignes, aucune migration de schéma à prévoir, aucun conflit de synchronisation à arbitrer. La donnée persistée est reconstructible à tout moment à partir de la liste des connexions.

#QoreDB #OpenSource #Rust #React #DevTools #Database

---

# Commentaire

J'ai détaillé le raisonnement complet dans l'article : le modèle d'état de l'arbre, le seuil d'apparition du filtre et la normalisation défensive du localStorage.

https://www.qoredb.com/fr/blog/systeme-favoris-sidebar-connexions

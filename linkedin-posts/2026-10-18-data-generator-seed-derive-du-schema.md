# Post LinkedIn

Remplir une table de test, c'est le genre de tâche qu'on bâcle avec un script maison. Le problème : ce script connaît la table du jour où il a été écrit, et il ignore tout des lignes déjà présentes dans la base visée.

Dans QoreDB, j'ai pris le problème dans l'autre sens. Le Data Generator lit le schéma réel au moment de la génération : il écarte les colonnes à valeur par défaut et les auto-incréments, parce que c'est la base qui sait quoi y mettre.

Le point le plus intéressant, ce sont les clés étrangères. Générer un entier plausible ne sert à rien, il faut un entier qui existe dans la table parente. Donc avant de produire une ligne, on échantillonne jusqu'à 500 valeurs réelles dans la table référencée et on tire dedans. Table parente vide : NULL plus un avertissement nommant la colonne, jamais une clé inventée.

Et la commande n'écrit rien en base. Elle rend un script INSERT, découpé par lots de 500 lignes parce que SQLite plafonne là, cité selon le dialecte du moteur courant. On le relit, on le copie, on l'exporte en .sql, ou on l'exécute par le chemin normal avec les garde-fous d'environnement.

Un script qu'on relit avant de l'exécuter, c'est un script qu'on peut corriger, versionner et rejouer ailleurs.

#QoreDB #OpenSource #Rust #SQL #DevTools #Database

---

# Commentaire

Le détail de l'implémentation est dans l'article : résolution du dialecte, heuristiques de génération par type, gestion des contraintes.

https://www.qoredb.com/fr/blog/data-generator-seed-derive-du-schema

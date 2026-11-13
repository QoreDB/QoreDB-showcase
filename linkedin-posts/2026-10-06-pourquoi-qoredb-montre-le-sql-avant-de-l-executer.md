# Post LinkedIn

Un client de base de données graphique écrit du SQL à votre place en permanence : édition d'une cellule, mise à jour de quarante lignes, création de table depuis un formulaire, génération de données de test.

Dans QoreDB, toute instruction générée est affichée avant d'être exécutée, dans le dialecte du moteur connecté.

Le point qui m'intéresse n'est pas l'affichage, c'est ce qui garantit qu'il dit la vérité. L'interface ne construit jamais de chaîne SQL : elle produit une liste de changements typés, un DTO par ligne touchée. Cette liste part dans deux directions.

Une commande la rend en texte via le générateur Rust de la crate qore-sql, et c'est ce texte qui s'affiche. L'autre reçoit exactement la même liste et l'exécute par les méthodes typées du driver, avec des valeurs liées en paramètres.

Une seule description de l'intention, deux rendus : un pour l'œil, un pour le réseau. L'exécution ne rejoue pas la chaîne affichée, et l'aperçu n'est pas une reconstitution écrite à côté du vrai chemin.

Le même composant d'aperçu sert l'édition en masse, le générateur de seed, le formulaire CREATE TABLE et la revue de migration du Sandbox. Et le journal d'audit, lui, ne reçoit que la forme courte, sans valeurs : un fichier survit à la session, un écran non.

#QoreDB #OpenSource #Rust #SQL #DatabaseTools #Tauri

---

# Commentaire

J'ai détaillé la mécanique complète dans l'article : générateur de dialecte, avertissements remontés avec le script, et ce que ça change pour les migrations.

https://www.qoredb.com/fr/blog/pourquoi-qoredb-montre-le-sql-avant-de-l-executer

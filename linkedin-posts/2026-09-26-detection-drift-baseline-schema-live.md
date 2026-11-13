# Post LinkedIn

Un fichier de migration décrit ce que le schéma devrait être. Il ne dit rien de ce qu'il est vraiment.

Entre deux déploiements, quelqu'un ajoute une colonne à la main, crée un index en urgence pendant un incident, lance un ALTER depuis un psql. Le schéma live s'éloigne des fichiers versionnés, et on ne le découvre qu'à la migration suivante qui échoue.

Dans QoreDB j'ai traité ça avec une baseline : un instantané structuré du schéma, pas un dump SQL. Une map de définitions de table, stockée en JSON dans .qoredb/baselines/, un fichier par connexion, git-ignoré. Comparer deux structures champ par champ évite tous les faux positifs d'un diff textuel (ordre des colonnes, casse des types, guillemets).

Le même comparateur sert deux choses : le contrôle de drift baseline contre live, et le diff de schéma entre deux connexions Prod et Staging. Une seule option change, le matching de clé.

Les deux décisions dont je suis le plus content sont des refus. Si la capture du schéma live est incomplète, la génération de migration ne produit rien : des tables non décrites ressembleraient à des suppressions et le up contiendrait de vrais DROP TABLE. Et si le dialecte ne sait pas exprimer une opération, un changement de type de colonne en SQLite par exemple, elle refuse aussi, opération par opération, parce qu'émettre la moitié qui compile livrerait une migration incomplète qui passe en silence.

Un refus explicite vaut mieux qu'un script qui a l'air correct.

#QoreDB #OpenSource #Rust #DatabaseMigrations #SchemaDrift #DevTools

---

# Commentaire

J'ai détaillé la structure de la baseline, le comparateur partagé et les deux garde-fous de génération ici :

https://www.qoredb.com/fr/blog/detection-drift-baseline-schema-live

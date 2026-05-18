# Post LinkedIn

Beaucoup de bases ne déclarent jamais leurs relations.

Une collection MongoDB n'a pas de FK. Un schéma SQL hérité de dix ans de migrations finit souvent avec des colonnes liées entre elles mais sans contrainte FOREIGN KEY pour le formaliser. Et un client de base de données s'appuie sur ces FK pour à peu près tout : navigation entre tables, Foreign Key Peek, diagramme ER.

Dans QoreDB, j'ai ajouté les Virtual Relations : des FK définies côté client, persistées localement dans un fichier JSON par connexion, et fusionnées avec les FK réelles que le driver remonte.

La base n'est jamais modifiée. La distinction visuelle est gardée (ligne pointillée dans l'ER, label "virtual"), donc on sait toujours ce qui vient de la base et ce qui a été ajouté manuellement.

C'est une couche locale qui transforme une vue partielle du schéma en quelque chose d'exploitable au quotidien, sans toucher au modèle de données.

#QoreDB #OpenSource #DatabaseTools #Rust #MongoDB #DataModeling

---

# Commentaire

L'article complet, avec le détail du modèle de données, la fusion avec describe_table et le rendu dans le diagramme ER :

https://www.qoredb.com/fr/blog/virtual-relations-fk-cote-client

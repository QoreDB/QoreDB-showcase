# Post LinkedIn

Elasticsearch n'a pas de protocole SQL, pas de table, pas de curseur serveur. Quand j'ai ajouté le driver à QoreDB, la vraie question n'était pas technique mais éditoriale : qu'est-ce qu'on expose au développeur ?

J'ai choisi de ne rien inventer. La syntaxe de l'éditeur est celle de la console Dev Tools : une ligne METHOD /chemin, puis un corps JSON. Une requête copiée depuis la doc d'Elastic s'exécute telle quelle.

Le point qui m'a demandé le plus de réflexion, c'est le mapping des réponses. Un _cat renvoie un tableau plat, un _search des hits imbriqués, une agrégation un arbre, un PUT un accusé d'écriture. Énumérer les endpoints serait une bataille perdue, la surface REST bouge à chaque version. Le driver inspecte donc la forme de la réponse, dans un ordre fixe, et affiche en colonne JSON brute ce qu'il ne reconnaît pas. Un endpoint inconnu reste utilisable sans mise à jour du client.

Côté pagination, la fenêtre de 10 000 documents est déclarée au moteur de pagination au lieu d'être découverte via une erreur. Et quand une clé unique existe, on passe en search_after, ce qui lève la limite.

Elasticsearch et OpenSearch partagent le même module, paramétré par un enum. Environ 95 % du code est commun.

#QoreDB #OpenSource #Elasticsearch #OpenSearch #Rust #DatabaseTools

---

# Commentaire

L'article détaille le transport HTTP, le mapping par forme de réponse, la pagination keyset et la classification lecture/écriture par méthode HTTP.

https://www.qoredb.com/fr/blog/elasticsearch-opensearch-console-rest-grille

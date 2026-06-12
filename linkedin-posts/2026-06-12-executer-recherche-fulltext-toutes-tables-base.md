# Post LinkedIn

Chercher une chaîne dans toutes les tables d'une base, ça arrive plus souvent qu'on le pense : retrouver un orphelin, suivre une donnée perso, déboguer un identifiant.

Trois options possibles : un script SQL ad hoc sur information_schema, les index full-text natifs (tsvector, FULLTEXT, $text), ou un client qui scanne l'ensemble du schéma.

Dans QoreDB, j'ai opté pour la troisième. Le client liste les colonnes texte de chaque table, détecte les index full-text quand ils existent, et utilise la syntaxe native. Sinon, il retombe sur du LIKE/ILIKE.

Le scan parallélise jusqu'à cinq tables via tokio, avec un timeout par table et un streaming progressif des résultats vers l'UI. La méthode utilisée (native, pattern, hybrid) est remontée pour qu'on sache si l'index a servi.

L'idée n'est pas de remplacer un index full-text dédié quand on en a vraiment besoin. C'est d'éviter d'écrire le script à chaque fois qu'on doit retrouver une chaîne quelque part.

#QoreDB #OpenSource #PostgreSQL #Rust #Database #Tauri

---

# Commentaire

L'article détaille la stratégie par driver, la détection d'index et le mécanisme de cache :

https://www.qoredb.com/fr/blog/executer-recherche-fulltext-toutes-tables-base

# Post LinkedIn

Quand on débogue en prod ou qu'on reprend un projet, on cherche souvent une valeur sans savoir dans quelle table elle se trouve.

Dans QoreDB, la recherche full-text scanne toutes les tables d'une base connectée en parallèle.

Chaque moteur a sa propre stratégie : tsvector + index GIN sur PostgreSQL, FULLTEXT sur MySQL, $text sur MongoDB. Quand il n'y a pas d'index natif, on se rabat sur du LIKE/ILIKE.

Le scan est borné : 5 tables en parallèle, 5 secondes de timeout par table, 100 résultats max. Les résultats arrivent progressivement via les événements Tauri.

Un clic sur un résultat ouvre la table avec le filtre pré-appliqué. Pas de magie, juste un outil d'exploration rapide qui s'adapte à chaque driver.

#QoreDB #OpenSource #PostgreSQL #MySQL #MongoDB #FullTextSearch #Rust

---

# Commentaire

L'article technique complet est ici :
https://www.qoredb.com/fr/blog/recherche-fulltext-scanner-toutes-les-tables

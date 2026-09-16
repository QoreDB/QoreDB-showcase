# Post LinkedIn

Un index n'a pas la même définition selon le moteur.

Sur PostgreSQL c'est une structure typée par une méthode d'accès. Sur MySQL une entrée de STATISTICS. Sur SQLite un B-tree parfois créé implicitement. Sur MongoDB un document de clés. Sur ClickHouse un filtre de saut de granules, qui ne garantit aucune unicité.

Quand j'ai conçu l'affichage des index dans QoreDB, j'ai choisi un modèle commun réduit à cinq champs : nom, colonnes, unique, primaire, type. Le type est optionnel, pas défaut. Sur SQLite je préfère ne rien afficher plutôt qu'écrire "btree" que le client aurait inventé au lieu de le lire dans la base.

Chaque driver interroge son propre catalogue : pg_index joint à pg_am, information_schema.STATISTICS, PRAGMA index_list, sys.indexes, listIndexes, system.data_skipping_indices. Aucune couche de normalisation intermédiaire.

Et pas de méthode list_indexes dans le trait : les index arrivent avec describe_table, dans le même aller-retour que les colonnes et les clés étrangères. Un seul appel, donc pas de risque que la liste de colonnes et la liste d'index viennent de deux instants différents.

Cinq champs suffisent à alimenter l'éditeur ALTER TABLE, le diff de migrations, l'analyse de tri et le contexte de l'assistant.

#QoreDB #OpenSource #Rust #PostgreSQL #DatabaseTools #Architecture

---

# Commentaire

J'ai détaillé les requêtes catalogue driver par driver dans l'article, y compris les cas tordus comme DuckDB et ClickHouse.

https://www.qoredb.com/fr/blog/index-afficher-ce-que-le-moteur-expose

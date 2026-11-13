# Post LinkedIn

DuckDB est le moteur de fédération de QoreDB : c'est lui qui exécute une requête croisant une table PostgreSQL et une collection MongoDB.

DuckDB est écrit en C++. Compilé avec sa feature bundled, il produit un libduckdb.a de 1,7 Go, et il le recompile dans chaque répertoire de build.

Ce coût achète quelque chose de réel : un binaire autonome qui démarre sur une machine dont on ne sait rien. Mais il ne l'achète qu'au moment de la distribution. Dans la boucle de développement, il n'achète rien.

J'ai donc séparé les deux chemins avec une feature Cargo, duckdb-bundled, relayée de qore-drivers vers qore-service puis vers chaque crate binaire. Sans elle, on se lie à la bibliothèque partagée officielle, téléchargée une fois et mise en cache. Chaque point d'entrée de release (Tauri, MSIX, Docker, AUR) l'active nommément : le binaire distribué n'a pas changé.

Dans le même passage, j'ai aligné Arrow et Parquet sur la version de DuckDB. Deux familles de la même bibliothèque cohabitaient dans le binaire. Résultat : 15 paquets en moins dans le lockfile, et les crates Arrow CSV et JSON hors du graphe.

Ce qui a changé n'est pas le produit, c'est le prix d'entrée pour quelqu'un qui veut compiler le projet.

#QoreDB #OpenSource #Rust #DuckDB #Cargo #BuildEngineering

---

# Commentaire

Le détail du linkage, de la propagation de la feature et de l'alignement Arrow/Parquet est ici :

https://www.qoredb.com/fr/blog/linkage-duckdb-partage-developpement-statique-distribution

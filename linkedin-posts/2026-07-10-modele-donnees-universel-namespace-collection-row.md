# Post LinkedIn

Comment est-ce qu'on unifie PostgreSQL, MongoDB, SQLite et Redis dans une seule UI, sans mentir à l'utilisateur ?

Dans QoreDB, tout tient en trois types Rust dans qore-core :

Namespace = (database, schema optionnel). Deux niveaux pour PG et SQL Server, un seul pour MySQL, Mongo ou SQLite, et un mapping direct pour les db0..db15 de Redis.

Collection = un Namespace, un nom, et un discriminant CollectionType (Table, View, MaterializedView, Collection).

Row + Value = un vecteur ordonné de cellules typées, avec huit variantes de Value (Null, Bool, Int, Float, Text, Bytes, Json, Array).

Le trait DataEngine que chaque driver implémente s'exprime presque uniquement en termes de ces trois briques. Le reste, dialecte SQL, transactions, capacités précises, remonte via DriverCapabilities. C'est une abstraction de structure, pas de comportement. Ajouter un moteur ne casse pas l'UI et ne demande pas d'émuler ce qui n'existe pas.

#QoreDB #OpenSource #Rust #DatabaseTools #SoftwareArchitecture

---

# Commentaire

L'article détaille la forme exacte des types Rust et le raisonnement derrière ce modèle minimaliste :

https://www.qoredb.com/fr/blog/modele-donnees-universel-namespace-collection-row

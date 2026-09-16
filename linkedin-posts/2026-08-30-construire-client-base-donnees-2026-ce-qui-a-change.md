# Post LinkedIn

phpMyAdmin date de 1998, pgAdmin de 2002, DBeaver de 2010. Ces outils marchent, et leurs choix d'architecture étaient les bons pour l'époque où ils ont été pris.

Le problème n'est pas leur qualité, c'est que quatre hypothèses de départ ont bougé.

Un produit stocke aujourd'hui son relationnel dans PostgreSQL, ses sessions dans Redis, ses documents dans MongoDB. La base n'est plus dans la même salle mais derrière un bastion SSH, et la prod est à un clic d'un onglet de dev. Le webview système tient une interface exigeante. Et l'écosystème Rust rend les drivers natifs accessibles : sqlx, tiberius, redis-rs, tokio. Couvrir plusieurs moteurs n'oblige plus à passer par un dénominateur commun comme JDBC.

C'est ce qui m'a décidé sur QoreDB. Un driver natif par moteur, derrière un trait Rust commun, DataEngine. L'abstraction est côté application, pas côté protocole : chaque driver reste libre d'exposer ce que son moteur a de spécifique.

Corollaire assumé : aucune traduction de requête. Du SQL Postgres part vers Postgres, un pipeline d'agrégation part vers Mongo. Ce qui est unifié, c'est l'enveloppe de travail (onglets, grille, export, historique), jamais le langage.

Et les règles de sécurité vivent dans le backend Rust, pas dans le composant qui affiche le bouton. Un DELETE sans WHERE sur une connexion classée Prod est refusé avant exécution, motif à l'appui, y compris au milieu d'un script multi-statements.

Réécrire un client de BDD n'a de sens que si les contraintes de départ ont vraiment changé. Je pense que c'est le cas.

#QoreDB #OpenSource #Rust #Tauri #DevTools #Databases

---

# Commentaire

L'article détaille les quatre hypothèses qui ont bougé, et ce que chacune implique concrètement dans l'architecture : trait DataEngine, DriverRegistry, streaming par curseur, Safety Policy côté backend.

https://www.qoredb.com/fr/blog/construire-client-base-donnees-2026-ce-qui-a-change

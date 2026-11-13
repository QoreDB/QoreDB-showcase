# Post LinkedIn

Ajouter Cassandra et ScyllaDB à QoreDB m'a obligé à trancher une question que les autres moteurs ne posaient pas : CQL est un protocole binaire natif, pas du SQL posé sur un socket que j'avais déjà.

J'ai écrit le client à la main. Environ 2500 lignes : le cadrage des trames, la poignée de main STARTUP, du SASL PLAIN pour l'authentification, et surtout le codec de types, qui représente le gros du travail.

Ce que j'abandonne en renonçant à la crate officielle, c'est le routage token-aware, l'équilibrage de charge et l'exécution spéculative. Sur un client desktop où une personne lance un statement et attend que sa grille se remplisse, ça n'a aucun usage. Un socket, un échange à la fois, et le borrow checker qui l'impose.

Ce que je gagne : aucune dépendance de driver tierce, un Core qui reste en Apache-2.0, et des garde-fous écrits dans le même module que la classification des requêtes. ALLOW FILTERING refusé en production, refusé dans tous les environnements sur Amazon Keyspaces où la lecture est facturée par ligne, et clé primaire complète exigée pour toute écriture depuis la grille.

Détail que je ne soupçonnais pas avant d'y être : le paging state de CQL est un vrai curseur serveur. C'est le seul driver de QoreDB qui pagine sans avoir besoin qu'on identifie une colonne unique de notre côté.

#QoreDB #OpenSource #Rust #Cassandra #ScyllaDB #DatabaseTools

---

# Commentaire

Le détail du protocole, la pagination par curseur natif et les refus appliqués en production sont dans l'article complet.

https://www.qoredb.com/fr/blog/client-cql-ecrit-main-cassandra-scylladb-keyspaces

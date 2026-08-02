# Post LinkedIn

Un client de base de données se juge d'abord sur son bouton "Tester la connexion".

Dans QoreDB, ce bouton n'ouvre jamais de session persistée. Il crée un pool minimal, envoie une requête de vérification, referme tout.

Le tout est enveloppé dans un timeout de 10 secondes qui englobe DNS, TLS, auth, et l'éventuel tunnel SSH ou proxy ouvert pour l'occasion.

Deux garde-fous tournent avant même de toucher au driver : refus de StrictHostKeyChecking=no en production, refus de la combinaison proxy + SSH (qui empile deux résolutions d'adresses dans le mauvais ordre).

Chaque driver expose la même signature (test_connection sur le trait DataEngine) mais implémente le test comme le moteur l'exige : pool SQLx pour PostgreSQL et MySQL, client Tiberius brut + SELECT 1 pour SQL Server, ping pour MongoDB, endpoint racine pour Elasticsearch.

Les messages d'erreur passent par un pipeline de sanitisation avant d'atteindre l'UI, pour éviter de fuiter des connection strings ou des credentials dans la fenêtre modale.

Objectif : un feedback rapide, aucun état résiduel, les mêmes règles de sécurité qu'une connexion normale.

#QoreDB #OpenSource #Rust #Tauri #DatabaseTools #Architecture

---

# Commentaire

L'article détaille le câblage complet, du Tauri command jusqu'aux impl par driver :
https://www.qoredb.com/fr/blog/test-connexion-dry-run-timeout-qoredb

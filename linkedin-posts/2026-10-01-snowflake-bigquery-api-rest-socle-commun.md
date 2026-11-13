# Post LinkedIn

J'ai ajouté Snowflake et BigQuery à QoreDB, et j'ai choisi de les écrire directement sur leurs API REST plutôt que d'embarquer les SDK éditeurs.

La raison est simple : sur un client qui compile plusieurs dizaines de moteurs derrière la même interface Rust, chaque dépendance lourde se paie trois fois, en temps de compilation, en taille de binaire et en surface d'audit cargo-deny.

Résultat : environ 2000 lignes par moteur, un graphe de dépendances inchangé, et un socle commun qui tient en deux objets, une paire de clés RSA signée en RS256 et un client HTTPS qui refuse le clair.

Deux détails qui comptent vraiment en usage.

Les deux drivers soumettent la requête en asynchrone au lieu d'attendre la réponse sur le même appel. Ça coûte un aller-retour, et ça donne le statement handle ou l'id de job dès la première milliseconde. Donc le bouton d'annulation arrête réellement le calcul côté entrepôt.

Et sur BigQuery, où on est facturé à l'octet scanné, chaque requête de lecture passe d'abord par un dryRun. Le volume s'affiche, et rien ne part sans confirmation. Les aperçus de table passent par tabledata.list, qui lit le stockage directement : zéro octet facturé pour cliquer sur une table.

#QoreDB #OpenSource #Rust #BigQuery #Snowflake #DataEngineering

---

# Commentaire

L'article détaille l'authentification, le polling, l'annulation et les plafonds de résultats des deux drivers.

https://www.qoredb.com/fr/blog/snowflake-bigquery-api-rest-socle-commun

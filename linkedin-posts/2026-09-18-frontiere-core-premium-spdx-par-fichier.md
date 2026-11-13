# Post LinkedIn

QoreDB est open-core. Une partie du code est sous Apache-2.0, une autre sous BUSL-1.1. Restait à décider où passe la frontière, et surtout comment la rendre lisible.

Le réflexe habituel, c'est de séparer par dossier. Ça ne tient pas dès que le code est bien organisé : dans le Notebook, SqlCell et MarkdownCell sont Core, AiCell et ChartCell sont Premium, et les cinq implémentent la même interface de cellule. Les éloigner pour satisfaire une contrainte de licence, c'est casser une cohésion technique qui a de bonnes raisons d'exister.

Donc la frontière passe par le fichier, et elle est écrite dedans : un en-tête SPDX en première ligne, un seul, sur chaque source .ts, .tsx et .rs. 651 fichiers Core, 190 fichiers Premium aujourd'hui.

Deux conséquences que j'aime bien. La carte des modules dans la doc n'est qu'une aide à la navigation : l'inventaire réel se fait avec un ripgrep sur les en-têtes, exact par construction. Et la feature Cargo "pro" reste une dimension de build, pas une dimension de licence : on ne déduit jamais l'une de l'autre, on lit l'en-tête.

Le tout est vérifié en CI par une regex sur la première ligne, appliquée aussi aux fichiers pas encore committés. Peu de machinerie pour une propriété qui doit tenir sur 841 fichiers à chaque commit.

#QoreDB #OpenSource #SPDX #Licensing #Rust #DevTools

---

# Commentaire

L'article détaille le raisonnement, le rôle exact de la BUSL et sa Change Date, et ce que vérifie précisément le script de CI.

https://www.qoredb.com/fr/blog/frontiere-core-premium-spdx-par-fichier

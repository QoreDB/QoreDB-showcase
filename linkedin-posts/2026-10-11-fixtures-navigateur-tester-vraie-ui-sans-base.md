# Post LinkedIn

Dans un client de base de données, les bugs qui remontent vraiment ne sont presque jamais des fonctions fausses. Ce sont des enchaînements : une réponse IPC qui arrive après un changement d'onglet, une écriture refusée par le moteur, deux pages chargées en parallèle.

Les tests unitaires en Node ne voient pas ça, et les tests d'intégration contre de vraies bases prouvent le driver, pas la grille.

J'ai donc ajouté un troisième étage dans QoreDB : onze scripts Playwright qui montent les vrais composants React dans Chromium, servis par le serveur Vite de dev. Une fixture = un index.html et un app.jsx d'une centaine de lignes qui importe le vrai DataGrid et le vrai hook de pagination.

La frontière Tauri est simulée, pas contournée : un window.__TAURI_INTERNALS__ installé avant tout script de page, avec une latence et des drapeaux failRead/failWrite. Un scénario de course devient un booléen au lieu d'une base mise dans un état improbable.

Deux assertions que j'aime bien : la liste des requêtes réseau prouve qu'un dialogue n'est chargé qu'à l'ouverture, et chaque script se termine sur un assert.deepEqual(errors, []) alimenté par pageerror.

Ces checks tournent à la demande, pas en CI. Playwright reste hors des dépendances de production, et les scripts sont suivis dans le dépôt sous Apache 2.0.

#QoreDB #OpenSource #Rust #Tauri #Testing #Playwright

---

# Commentaire

Le détail complet est dans l'article : comment une fixture est construite, ce que chacun des onze scripts couvre, et pourquoi la qualification native sur WebKitGTK reste un étage séparé.

https://www.qoredb.com/fr/blog/fixtures-navigateur-tester-vraie-ui-sans-base

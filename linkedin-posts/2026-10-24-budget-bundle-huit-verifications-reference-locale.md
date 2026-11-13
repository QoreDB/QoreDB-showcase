# Post LinkedIn

QoreDB est une app desktop, mais son interface reste du code web dans un webview. Le poids du frontend se paie au démarrage à froid, et il grossit toujours sans qu'on le remarque.

J'ai donc mis un script de mesure dans le dépôt, lancé avant et après chaque lot frontend. Il construit en mode production, lit le manifeste Vite et sépare deux choses : ce que les imports statiques tirent au démarrage, et le volume total livré. Déplacer un module derrière un import dynamique fait baisser le premier sans faire disparaître le second.

Deux budgets, pas un : zéro croissance sur le chargement initial, 2 % tolérés sur le total. La comparaison est faite en arithmétique entière pour qu'un arrondi ne décide pas du verdict.

Le point que je trouve le plus utile : chaque rapport embarque une empreinte de build (versions Node, pnpm, Vite, zlib, plateforme, hash du lockfile et de la config). Si une seule clé diffère entre deux rapports, le script répond "incomparable" et sort en erreur, au lieu de produire un pourcentage auquel personne ne devrait croire.

Les fichiers .env sont hachés, jamais lus : un rapport peut circuler dans une PR sans emporter de secret.

#QoreDB #OpenSource #Frontend #Vite #Performance #DevTools

---

# Commentaire

J'ai détaillé le fonctionnement du script, les huit vérifications et le choix de garder les références en local dans un article :

https://www.qoredb.com/fr/blog/budget-bundle-huit-verifications-reference-locale

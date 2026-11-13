# Post LinkedIn

Un client de base de données garde en général son état dans un dossier de config utilisateur. Ça marche tant qu'on est seul sur un seul projet.

Dans QoreDB, on peut aussi poser un dossier .qoredb/ à la racine d'un projet et le versionner avec le code. Il est détecté en remontant l'arborescence depuis le répertoire courant, comme .git ou Cargo.toml.

Il contient les connexions, la bibliothèque de requêtes, les notebooks, les contrats de données et les migrations SQL. Les mots de passe, eux, restent dans le keyring de l'OS, avec un espace de secrets par projet. Un dossier commité est un dossier sans secret.

Deux choix de conception qui font tout le reste :

- un fichier JSON par connexion, pour que deux personnes qui en ajoutent chacune une sur leur branche ne se marchent pas dessus au merge
- un watcher qui repère les changements venus de Git, avec un debounce et un registre des écritures de l'app pour ne pas boucler sur ses propres sauvegardes

Le résultat : un git clone suffit pour récupérer la topologie des bases d'un projet. Pas de compte, pas de serveur de synchro. La synchronisation, c'est Git.

#QoreDB #OpenSource #Rust #DevTools #Git #Database

---

# Commentaire

J'ai détaillé la détection du dossier, la dérivation de l'identité du workspace et le fonctionnement du watcher dans l'article.

https://www.qoredb.com/fr/blog/workspace-qoredb-etat-depot-projet

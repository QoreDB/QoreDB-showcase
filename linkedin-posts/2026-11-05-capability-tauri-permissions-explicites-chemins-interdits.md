# Post LinkedIn

Une app desktop sur webview a un pont entre son interface et le système. Tauri 2 oblige à déclarer tout ce qui traverse ce pont, et j'ai traité cette contrainte comme un inventaire.

Dans QoreDB, un seul fichier décrit ce que la fenêtre peut demander à la machine : quatre actions de fenêtre, l'updater, le redémarrage, les sélecteurs natifs, et trois commandes fichier (lire du texte, écrire du texte, écrire du binaire). Pas de suppression, pas de parcours de répertoire, pas d'exécution de commande côté frontend.

Le scope fichiers se limite aux dossiers de l'application. Les répertoires de credentials sont refusés par leur nom : .ssh, .aws, .gnupg, .kube, .pgpass, .my.cnf, les historiques de shell et de psql. Un client de base de données est précisément l'outil pour lequel lire .pgpass aurait l'air d'une commodité raisonnable, donc la réponse est écrite une fois pour toutes.

Pour exporter ailleurs, c'est le sélecteur système qui élargit le scope, au chemin choisi, au moment où c'est utile. Et la CSP limite connect-src au canal IPC local : l'interface ne joint aucun hôte externe, tout le réseau part du code Rust.

Résultat : pour savoir ce que l'app peut faire sur une machine, il y a deux fichiers courts à lire dans le dépôt.

#QoreDB #OpenSource #Rust #Tauri #Security #DesktopApp

---

# Commentaire

Le détail des permissions, du scope fichiers et de la CSP est dans l'article :
https://www.qoredb.com/fr/blog/capability-tauri-permissions-explicites-chemins-interdits

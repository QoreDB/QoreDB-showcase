# Post LinkedIn

QoreDB est une app desktop, mais il y a des moments où l'interface graphique est la mauvaise surface : trois lignes de vérification dans un job CI, un serveur sans écran, une question qu'on se pose entre deux commandes git.

J'ai donc ajouté un second binaire, `qore`. Ce n'est pas un client réécrit pour le terminal : c'est le même moteur, appelé depuis une autre entrée.

Le crate dépend de qore-service, pas du binaire Tauri. Pas de webview, pas de runtime graphique, une sortie JSON sur stdout et un code de retour non nul en cas d'erreur. Les drivers sont des features Cargo, donc on peut compiler un binaire qui ne parle qu'à PostgreSQL et SQLite.

Aucun credential en ligne de commande. Le CLI lit un identifiant de connexion et va chercher le reste là où le desktop l'a rangé : le répertoire de config pour les métadonnées, le keychain du système pour les secrets. Lancé depuis un dépôt qui contient un dossier .qoredb, il voit les connexions de ce projet et pas celles de la machine entière.

Deux règles non négociables, partagées avec le serveur MCP : opt-in par connexion (un drapeau désactivé par défaut, vérifié avant même de lire un secret) et lecture seule forcée, quel que soit le réglage enregistré. Il n'y a pas d'option pour la lever.

Et les requêtes traversent le même preflight que l'éditeur : rate limit, analyse du dialecte, blocage des mutations. Avec leur origine tracée dans le journal d'audit.

#QoreDB #OpenSource #Rust #CLI #DevOps #Database

---

# Commentaire

Le détail de l'implémentation est dans l'article : découpage du workspace Cargo, résolution du vault, et les garde-fous appliqués aux surfaces sans interface.

https://www.qoredb.com/fr/blog/cli-qore-interroger-connexions-terminal

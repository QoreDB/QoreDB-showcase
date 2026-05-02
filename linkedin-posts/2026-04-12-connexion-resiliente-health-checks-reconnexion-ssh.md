# Post LinkedIn

Une connexion à une base de données ne reste pas ouverte indéfiniment. Timeout réseau, tunnel SSH qui tombe, redémarrage serveur - ça arrive.

Dans QoreDB, un monitor de santé tourne en arrière-plan et vérifie chaque session toutes les 30 secondes.

Le cycle est ordonné : vérification TCP du tunnel SSH d'abord (si présent), puis ping du driver avec un timeout de 5 secondes. Si le tunnel est mort depuis 2 cycles consécutifs, QoreDB tente de le rouvrir automatiquement.

L'état de santé a trois valeurs : healthy, unhealthy, reconnecting. Le frontend reçoit les changements via un événement Tauri et affiche une notification. Quand la connexion est restaurée, une notification de succès s'affiche. L'utilisateur n'a rien à faire.

Toute la logique est dans le SessionManager, un composant Rust dans le crate qore-drivers. C'est la source unique de vérité pour toutes les connexions actives.

J'explique le mécanisme complet dans l'article, avec les détails d'implémentation.

#QoreDB #OpenSource #Rust #DatabaseTooling #SoftwareArchitecture #Tauri

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/connexion-resiliente-health-checks-reconnexion-ssh

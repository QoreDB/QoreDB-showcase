# Post LinkedIn

Se connecter à une base PostgreSQL derrière un bastion, c'est trois fois la même opération avec trois niveaux d'ergonomie.

J'ai posé tout ça à plat dans un guide :

1. La commande nue : ssh -L 5433:db.internal:5432 user@bastion. Pratique pour comprendre, vite pénible au quotidien.

2. Le fichier ~/.ssh/config avec LocalForward, ProxyJump, ServerAliveInterval. La vraie source de vérité, à versionner si on bosse en équipe.

3. Les clients qui intègrent le tunnel : DBeaver (SSH Java maison), DataGrip (peut relire ~/.ssh/config), QoreDB (délègue à OpenSSH système).

Les quatre pièges qui reviennent à chaque fois : keepalive manquant, résolution DNS du remote_host côté bastion, host key qui change après recréation du bastion, et ProxyJump enchaîné qui spam les clés.

#QoreDB #OpenSource #PostgreSQL #SSH #DevOps #Database

---

# Commentaire

Le guide complet est ici, avec les configs exactes pour chacune des trois méthodes :
https://www.qoredb.com/fr/blog/comment-connecter-postgresql-tunnel-ssh-guide-complet

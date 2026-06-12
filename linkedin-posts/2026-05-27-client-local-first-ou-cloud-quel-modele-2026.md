# Post LinkedIn

Local-first ou cloud pour un client de base de données : ce n'est pas un débat de goût.

Sur un client desktop, la requête fait un seul aller-retour poste vers base. Les credentials ne quittent jamais la machine. Une base en VPC privé est joignable dès que le VPN est actif, sans rien à configurer.

Sur un client cloud, la requête fait deux hops, l'éditeur du SaaS stocke et déchiffre les credentials, et il faut un agent on-premise ou un IP allowlist pour atteindre une base privée.

L'un n'est pas mieux que l'autre. Le cloud gagne dès que la valeur principale est le partage : dashboards, notebooks, interfaces admin pour le support. Le local-first gagne pour le travail individuel sur des bases sensibles : exploration, debug, migrations, écriture de SQL complexe.

J'ai écrit un article qui détaille les quatre axes techniques (latence, souveraineté des credentials, accès VPC, partage) et donne des cas concrets pour choisir.

QoreDB est explicitement local-first, et c'est un choix structurant que j'assume.

#QoreDB #OpenSource #DatabaseTools #LocalFirst #DevOps #SoftwareArchitecture

---

# Commentaire

L'article complet, avec la comparaison technique et les cas pratiques :
https://www.qoredb.com/fr/blog/client-local-first-ou-cloud-quel-modele-2026

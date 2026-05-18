# Post LinkedIn

J'ai souvent la question : "pourquoi QoreDB n'est pas une app web ?"

La réponse courte : un client de BDD manipule des credentials et des données sensibles. Faire passer ça par un SaaS, c'est ajouter un secret partagé et un point de défaillance qui n'ont pas à exister.

Concrètement, en restant desktop, QoreDB obtient :

- les credentials chiffrés dans le keychain de l'OS, jamais sur un serveur tiers
- les requêtes qui partent directement de la machine vers la base, sans relais
- l'accès aux bases dans des VPC privés sans configuration spécifique, dès que le VPN est actif
- un usage offline réel pour les SQLite locales et l'historique

Ce n'est pas une étape transitoire en attendant un SaaS. C'est le format final. Tout ce qu'on ajoute, des drivers à la fédération via DuckDB, est pensé pour fonctionner sur la machine du dev.

Article complet (lien en commentaire).

#QoreDB #OpenSource #LocalFirst #DatabaseTools #Rust #Tauri

---

# Commentaire

Article ici :
https://www.qoredb.com/fr/blog/pourquoi-qoredb-est-desktop-only-et-le-restera

# Post LinkedIn

Le modèle de sécurité d'un client de base de données desktop n'est pas celui d'un SaaS.

Sur QoreDB, je travaille à partir de quatre actifs : credentials, données de la base, métadonnées de connexion, état local. Les deux risques les plus probables sur un poste de développeur ne sont pas exotiques :

1. Le vol de credentials par un malware local. Réponse : stockage dans le keychain OS via la crate keyring (Keychain macOS, Secret Service Linux, Credential Manager Windows). Aucun mot de passe en clair sur disque, et un wrapper Sensitive<String> qui rédige les secrets dans les logs en mémoire.

2. La destruction accidentelle de données. Réponse : classement explicite Dev/Staging/Prod, bordures rouges sur la prod, blocage de DROP/TRUNCATE en production, confirmation pour DELETE/UPDATE sans WHERE. Les règles s'appliquent dans l'intercepteur de requêtes, pas seulement dans l'UI.

Au deuxième ordre, je rédige le texte des requêtes avant de l'écrire dans l'audit (driver-aware : SQL, MongoDB, Redis), et la CSP du webview empêche le frontend d'appeler n'importe quelle URL.

L'objectif n'est pas de répliquer un modèle multi-tenant. C'est d'offrir une protection cohérente avec le contexte desktop.

#QoreDB #OpenSource #Security #Rust #ThreatModel #Database

---

# Commentaire

L'article complet, avec le détail de la rédaction multi-driver, des règles built-in et de l'enchaînement des défenses :
https://www.qoredb.com/fr/blog/modele-securite-qoredb-menaces-contre-mesures

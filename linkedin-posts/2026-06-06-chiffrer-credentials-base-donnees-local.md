# Post LinkedIn

Combien de credentials de bases de données traînent en clair sur la machine d'un dev backend ?

Un .pgpass ici, un .env là, parfois directement dans l'historique du shell. La permission 0600 protège contre l'utilisateur d'à côté, pas contre un processus malveillant qui tourne sous votre compte.

Le keychain de l'OS (macOS Keychain, libsecret sur Linux, Credential Manager sur Windows) résout 90% du problème pour un dev seul: chiffrement au repos, déverrouillage à la session, accès contrôlé par processus. Les bindings existent dans tous les langages: keyring en Python, keytar en Node, la crate keyring en Rust.

Pour le partage en équipe, un gestionnaire comme 1Password ou pass via CLI permet de récupérer un secret à la volée sans jamais l'écrire sur le disque.

Dans QoreDB, on a fait le choix de déléguer au keychain plutôt que d'inventer notre propre vault. Les métadonnées de connexion vont dans un JSON local, les mots de passe vont au keychain. Un vault lock optionnel basé sur Argon2id ajoute une seconde couche.

J'ai écrit un article qui passe en revue les différentes approches et leurs trade-offs.

#QoreDB #OpenSource #Security #DevOps #Database #Cybersecurity

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/chiffrer-credentials-base-donnees-local

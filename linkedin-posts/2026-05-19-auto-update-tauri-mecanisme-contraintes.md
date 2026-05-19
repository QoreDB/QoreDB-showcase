# Post LinkedIn

Comment je distribue les mises à jour de QoreDB sans plateforme dédiée.

J'utilise tauri-plugin-updater avec un setup volontairement minimaliste :

- un manifeste latest.json hébergé directement sur GitHub Releases
- des binaires signés minisign, clé publique embarquée dans tauri.conf.json
- la clé privée dans les secrets GitHub Actions, signature automatique au build
- pas de dialog imposé : UI custom dans la titlebar et les Settings
- check au démarrage avec un délai de 4s, opt-out propre via les préférences

Pour le mainteneur, publier une nouvelle version revient à pousser un tag git. La CI build, signe, attache le manifeste à la release. Zéro infra de distribution à maintenir.

Pour l'utilisateur, deux clics : un sur le bouton de mise à jour, un sur Restart. La signature minisign garantit que rien d'autre que mon binaire signé ne peut être installé, ce qui compte pour un client de base de données qui a accès au vault.

#QoreDB #OpenSource #Tauri #Rust #DesktopApp #SoftwareDistribution

---

# Commentaire

L'article complet, avec le détail du flux d'installation, la chaîne de confiance minisign et le raisonnement derrière le choix d'une UI custom plutôt que du dialog par défaut :

https://www.qoredb.com/fr/blog/auto-update-tauri-mecanisme-contraintes

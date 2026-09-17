# Post LinkedIn

Distribuer une app desktop, ce n'est pas publier un binaire.

Sur QoreDB, un seul tag Git déclenche toute la chaîne : quatre cibles de build (macOS ARM, macOS Intel, Windows, Linux), la génération du changelog avec git-cliff à partir des commits conventionnels, la signature des artefacts, et la publication sur AUR, Homebrew et winget.

Deux détails que j'ai dû corriger en route.

D'abord le fichier latest.json que lit l'auto-updater Tauri. Chaque job de la matrice le réécrivait, et quatre jobs en parallèle sur le même fichier, ça donne des entrées de plateforme qui disparaissent. Un seul job l'écrit maintenant, après la matrice, en relisant les signatures réellement attachées à la release.

Ensuite le paquet AUR. Il part du .deb et pas de l'AppImage, parce que le binaire du .deb est lié dynamiquement à webkit2gtk-4.1. L'AppImage embarque ses propres libs, et sur Arch ça provoque des plantages EGL et Wayland. Laisser pacman résoudre les dépendances règle le problème.

Tout ça tient en quelques YAML et trois scripts Node, versionnés à côté du code. Pas de service externe qui orchestre les builds, pas d'étape manuelle non écrite.

#QoreDB #OpenSource #Rust #Tauri #DevOps #CICD

---

# Commentaire

L'article détaille le pipeline complet : signature Tauri vs notarisation Apple, la matrice de build, les manifestes Homebrew et winget, et pourquoi le PKGBUILD extrait le .deb.

https://www.qoredb.com/fr/blog/distribution-qoredb-tag-git-plateformes-canaux

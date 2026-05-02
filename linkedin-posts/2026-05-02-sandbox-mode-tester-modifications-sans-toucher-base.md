# Post LinkedIn

Tester un changement sur une base avant de le valider, c'est rarement bien outillé.

Dans QoreDB, j'ai ajouté un Sandbox Mode qui capture chaque insertion, mise à jour ou suppression effectuée dans la grille, sans aucun aller-retour avec la base.

Tout est accumulé en local dans un store dédié. Quand on insère puis supprime la même ligne, l'insert disparaît. Quand on met à jour deux fois, les deltas sont fusionnés. On garde le minimum d'instructions nécessaires pour atteindre l'état désiré.

Au moment de valider, le backend Rust génère un script SQL adapté au dialecte du driver actif, prévisualisable, copiable, exportable. Si on l'applique, c'est dans une transaction quand le moteur le permet, avec rollback automatique sur la première erreur.

Aucun aller-retour réseau, aucune trace côté serveur, juste un filet de sécurité avant que le SQL parte.

#QoreDB #OpenSource #Rust #Tauri #DevTools #Database

---

# Commentaire

L'article complet sur le fonctionnement du Sandbox Mode (store local, fusion des opérations, génération de migration, application transactionnelle) :

https://www.qoredb.com/fr/blog/sandbox-mode-tester-modifications-sans-toucher-base

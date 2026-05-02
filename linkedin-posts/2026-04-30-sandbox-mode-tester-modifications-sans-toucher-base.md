# Post LinkedIn

La plupart des incidents en BDD viennent du clic de trop : un UPDATE sans WHERE, une cellule modifiée par erreur, un DELETE sur la mauvaise ligne.

Dans QoreDB, le Sandbox Mode interpose une couche locale entre l'utilisateur et le moteur. Tant qu'il est actif, les modifications s'accumulent dans le poste, jamais sur la base.

Chaque édition inline, chaque insertion, chaque suppression devient un objet typé (insert, update, delete) avec son namespace, sa clé primaire et son diff. Le grid affiche immédiatement le rendu visuel : surbrillance, cellule colorée, ligne barrée.

On peut prévisualiser le SQL généré, l'exporter, retirer un changement du lot, puis appliquer en transaction. Si une contrainte casse en cours de route, ROLLBACK et le panneau garde tout pour qu'on puisse corriger.

Le badge persistant change de couleur selon l'environnement (bleu dev, orange staging, rouge prod). Impossible d'oublier qu'on est en train de composer un lot.

C'est la même mécanique que les drafts dans un IDE, transposée à la donnée.

#QoreDB #OpenSource #SQL #DatabaseTools #Rust #DevTools

---

# Commentaire

L'article technique complet est ici :
https://www.qoredb.com/fr/blog/sandbox-mode-tester-modifications-sans-toucher-base

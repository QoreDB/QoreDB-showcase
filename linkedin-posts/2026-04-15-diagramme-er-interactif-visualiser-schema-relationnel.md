# Post LinkedIn

Quand on débarque sur une base inconnue, la première question c'est toujours : à quoi ressemble le schéma ?

J'ai intégré dans QoreDB un diagramme ER interactif. Pas de librairie de graphes externe - tout est rendu en SVG natif. Les tables sont disposées en grille par un algorithme de column-packing simple, les arêtes sont des courbes de Bézier ancrées sur les colonnes FK concernées.

Quelques choix techniques qui m'ont semblé importants :

- Les FK sont lues depuis les métadonnées du moteur, pas devinées depuis les noms de colonnes. Si une FK n'est pas déclarée, elle n'apparait pas.
- Le chargement est parallélisé avec 6 workers asynchrones, avec annulation propre si l'utilisateur change de namespace.
- Les colonnes PK et FK sont toujours prioritaires dans l'affichage (max 8 colonnes par noeud).
- Un mode "isolation" permet de se concentrer sur une table et ses voisines directes.

Pour les bases sans FK déclarées (MongoDB, tables legacy), on peut définir des Virtual Relations côté client. Elles apparaissent en pointillé pour distinguer ce qui vient du moteur de ce qu'on a défini nous-mêmes.

Article disponible en lien ci-dessous.

#QoreDB #OpenSource #PostgreSQL #DatabaseTools #Rust

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/diagramme-er-interactif-visualiser-schema-relationnel

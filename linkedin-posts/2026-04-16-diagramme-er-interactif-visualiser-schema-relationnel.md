# Post LinkedIn

Quand on débarque sur une base inconnue, lire des listes de colonnes ne suffit pas. On a besoin de voir ce qui pointe vers quoi.

Dans QoreDB, le diagramme ER interactif est construit à partir des métadonnées natives du moteur (information_schema, pg_catalog, Tiberius), sans inférence ni reverse engineering.

Rendu SVG avec des courbes de Bézier pour les arêtes, positionnement HTML absolu pour les tables (texte sélectionnable, Tailwind, événements fins), chargement parallèle des schémas par un pool de six workers.

Deux types d'arêtes : les FK natives en ligne pleine, les FK virtuelles déclarées côté client en pointillés violet. On distingue toujours ce que la base garantit de ce que l'utilisateur a ajouté.

Pour naviguer sans se perdre : isolation d'une table et de ses voisines directes, recherche par nom, pan/zoom aux conventions habituelles.

#QoreDB #OpenSource #PostgreSQL #MongoDB #ERDiagram #Rust #DataViz

---

# Commentaire

L'article technique complet est ici :
https://www.qoredb.com/fr/blog/diagramme-er-interactif-visualiser-schema-relationnel

# Post LinkedIn

J'ai écrit un article sur le diagramme ER de QoreDB, et le parti pris technique derrière.

Pas de librairie de graphes (D3, react-flow), pas de layout force-directed, pas de reverse engineering sur les noms de colonnes. Le composant est un fichier React unique qui calcule sa propre mise en page et dessine tout en SVG natif.

La règle est simple : on affiche ce que le moteur déclare. Si une FK n'existe pas en base, aucune arête n'est dessinée. Pour les schémas sans contraintes (MongoDB, bases mal structurées), les Virtual Relations permettent de déclarer des FK côté client, avec un style visuel distinct pour qu'on sache d'où vient chaque relation.

Côté UX : isolation d'une table et de ses voisines directes, recherche, pan-and-zoom borné, fit-to-view. Le chargement des schémas est parallélisé avec un pool de 6 workers et reste annulable.

L'objectif n'est pas de modéliser, c'est de comprendre vite une base que l'on découvre.

#QoreDB #OpenSource #Rust #React #Database #Architecture

---

# Commentaire

L'article complet ici, avec les détails sur le rendu SVG, l'algorithme de layout, et l'intégration des Virtual Relations :
https://www.qoredb.com/fr/blog/diagramme-er-interactif-visualiser-schema-relationnel

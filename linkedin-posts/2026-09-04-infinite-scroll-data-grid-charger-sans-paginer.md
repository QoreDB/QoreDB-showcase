# Post LinkedIn

Dans QoreDB, parcourir une table ne passe pas par des numéros de page. Les lignes se chargent au fil du scroll, par blocs de 100.

Trois décisions techniques derrière ça :

1. Curseur plutôt qu'OFFSET quand le driver l'annonce et que la table a une clé primaire. Un index unique ne suffit pas : il peut être nullable, donc l'ordre n'est pas total. Chaque réponse déclare sa stratégie et sa garantie d'ordre, l'interface le répète telle quelle.

2. Pas de COUNT(*) à chaque bloc. Le backend demande une ligne de plus que la taille de page, la tronque, et en déduit s'il en reste. Le total exact reste un bouton, annulable, avec son propre timeout.

3. Un budget mémoire de 128 Mo par onglet. Chaque bloc est pesé en parcourant les valeurs plutôt qu'en sérialisant : la page à ne surtout pas recopier est justement celle qui contient un JSONB de plusieurs Mo. Quand le budget est atteint, le chargement s'arrête et le dit.

Pas de fenêtre glissante, pas d'éviction. Au-delà de ce volume, la bonne réponse n'est plus de faire défiler, c'est d'écrire un WHERE.

#QoreDB #OpenSource #Rust #PostgreSQL #DatabaseTools #React

---

# Commentaire

L'article détaille la mécanique complète : épinglage de la stratégie sur la première page, compteur de génération anti-race, reset sur tri et recherche server-side.

https://www.qoredb.com/fr/blog/infinite-scroll-data-grid-charger-sans-paginer

# Post LinkedIn

Un résultat de requête, par nature, c'est éphémère.

On lance un SELECT sur la prod, on regarde le tableau, et l'instant d'après les lignes ont déjà bougé. C'est gênant dès qu'on veut raisonner dans le temps : vérifier l'effet d'une migration, comparer avant/après un batch, garder une trace d'un comportement bizarre.

Dans QoreDB, j'ai ajouté un mécanisme de snapshots : on fige un résultat à un instant T, on lui donne un nom, il est persisté localement en JSON avec toutes ses métadonnées (requête source, connexion, driver, colonnes, timestamp).

Côté implémentation : un fichier par snapshot dans le data dir, UUID v4 comme identifiant, validation stricte contre le path traversal. Pas de SQLite intermédiaire, pas d'index secondaire. Pour un usage desktop ça suffit largement.

La vraie utilité vient de l'intégration avec le Visual Data Diff : un snapshot devient une source comparable comme une autre. On fige la prod, on déploie, puis on diff côte à côte. Les colonnes communes sont alignées, les lignes ajoutées/supprimées/modifiées mises en évidence.

100% local, zéro dépendance cloud, le snapshot reste auto-descriptif même si la connexion source disparaît.

#QoreDB #OpenSource #Rust #Database #DevTools #LocalFirst

---

# Commentaire

L'article détaille l'architecture du store, la validation des UUID, et le flux d'usage complet :
https://www.qoredb.com/fr/blog/snapshots-resultats-figer-etat-comparer-plus-tard

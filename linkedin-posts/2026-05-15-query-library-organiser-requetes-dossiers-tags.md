# Post LinkedIn

Quand on utilise un client de base de données au quotidien, on accumule vite des requêtes qu'on retape de mémoire à chaque fois.

J'ai intégré une Query Library dans QoreDB pour les ranger : dossiers, tags normalisés, favoris, et export/import JSON pour le partage manuel entre développeurs.

Le stockage primaire est localStorage, pas de store global, pas de couche d'état partagé. Quand un workspace file est actif, une sync débouncée écrit aussi vers .qoredb/queries/library.json, ce qui permet de versionner sa bibliothèque dans Git.

L'export propose une option de rédaction qui passe chaque requête dans le même filtre que les logs internes, pour ne pas partager un mot de passe en clair par mégarde.

Pas de cloud sync, pas de templates paramétrés, pas de scheduling. Une bibliothèque qui aide à retrouver une requête, rien de plus.

#QoreDB #OpenSource #LocalFirst #SQL #DeveloperTools #Rust

---

# Commentaire

Article complet sur l'architecture de la Query Library et le choix localStorage + workspace file :
https://www.qoredb.com/fr/blog/query-library-organiser-requetes-dossiers-tags

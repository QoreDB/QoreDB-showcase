# Post LinkedIn

Quand on construit une app Tauri, le réflexe est d'écrire la logique métier dans les commandes IPC. Ça marche tant qu'on n'a qu'une seule surface.

QoreDB en a quatre : l'app desktop, le CLI, un serveur MCP et un serveur HTTP. Les quatre ouvrent des connexions, classifient des requêtes, appliquent une politique de sûreté et lisent un vault chiffré.

J'ai donc découpé le backend Rust en huit crates, et la couche métier (qore-service) ne connaît pas Tauri du tout. Elle est décrite dans son propre manifeste comme "Tauri-free business logic shared by every surface".

La conséquence est la seule chose qui m'intéresse vraiment ici : un garde-fou ajouté dans l'interface ne protège rien. Le preflight d'une requête (classification de mutation, lecture seule, acquittement prod, rate limiting, masquage) vit dans la couche partagée, donc le CLI et le serveur MCP passent par les mêmes contrôles que l'UI.

Ajouter une surface demande d'écrire du transport, pas de réimplémenter un moteur.

J'explique le découpage crate par crate dans l'article.

#QoreDB #OpenSource #Rust #Tauri #SoftwareArchitecture #DatabaseTools

---

# Commentaire

Le détail du découpage, le rôle de chaque crate et la façon dont les feature flags traversent le workspace :
https://www.qoredb.com/fr/blog/huit-crates-qoredb-logique-metier-hors-tauri

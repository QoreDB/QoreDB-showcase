# Post LinkedIn

Envoyer un extrait de table à quelqu'un qui n'a pas de client SQL, c'est un cas d'usage banal et étonnamment mal résolu.

Le CSV se lit mal dans un tableur mal configuré, le JSON demande un outil, le PDF interdit le tri, la capture d'écran perd les données brutes.

Dans QoreDB j'ai ajouté un format d'export HTML self-contained : un seul fichier .html, ouvrable dans n'importe quel navigateur, avec recherche, tri par colonne et pagination intégrés.

Aucune ressource externe, aucun CDN, aucun outil à installer côté destinataire. Le CSS et le JavaScript sont embarqués, les données sérialisées en tableau JS inline. Ça s'ouvre offline, s'attache à un ticket ou à un email, et le destinataire double-clique.

Le writer implémente le même trait ExportWriter que le CSV/JSON/SQL, donc l'écriture est streamée côté Rust. Le fichier reste raisonnable en taille : quelques centaines de Ko pour un millier de lignes.

C'est un format de partage, pas d'archivage. Mais pour partager un jeu de résultats sans imposer un outil, c'est le contrat minimum utile.

#QoreDB #OpenSource #Rust #Tauri #DatabaseTools #DevTools

---

# Commentaire

L'article complet, avec les détails techniques du writer et du script embarqué :
https://www.qoredb.com/fr/blog/export-html-self-contained-partager-donnees-sans-outil

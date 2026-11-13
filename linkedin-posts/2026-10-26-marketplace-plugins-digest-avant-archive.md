# Post LinkedIn

Installer un plugin tiers sur la machine d'un dev, c'est accepter des octets venus d'un serveur qu'on ne contrôle pas.

Dans QoreDB, j'ai choisi de ne faire confiance ni au catalogue, ni à l'hébergeur de l'archive. Un seul point d'ancrage : le sha256 que le registre déclare pour chaque version.

Concrètement, la séquence est ordonnée :
- le digest est normalisé et validé avant même d'ouvrir une connexion
- le téléchargement passe par une lecture plafonnée à 8 Mio, avec garde sur les réponses sans Content-Length
- le sha256 est comparé avant toute extraction, donc avant de parser le moindre manifeste
- l'extraction refuse les archives non plates, plafonne à 256 entrées et comptabilise la taille décompressée pour écarter les zip bombs
- l'installation réutilise le chemin existant : staging, sauvegarde de la version en place, renommage atomique, restauration si ça échoue

Pas de liste blanche de noms d'hôtes. Ce n'est pas l'origine qui établit la confiance, c'est le condensé.

Et la vérification d'intégrité ne répond qu'à une question : ai-je reçu les bons octets. Ce que le plugin a le droit de faire ensuite, c'est le bac à sable WASM qui s'en occupe.

#QoreDB #OpenSource #Rust #SupplyChain #Plugins #Security

---

# Commentaire

L'article détaille toute la séquence, du fetch du catalogue via Rust jusqu'au renommage atomique côté disque.

https://www.qoredb.com/fr/blog/marketplace-plugins-digest-avant-archive

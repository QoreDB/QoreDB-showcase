# Post LinkedIn

Un client de base de données tourne sur le poste du développeur, avec des credentials de production en mémoire. La vraie question de sécurité n'est donc pas seulement mon code, mais les centaines de crates Rust et de paquets npm que j'embarque.

J'ai traité ça avec de l'outillage, pas avec une promesse.

Chaque release de QoreDB publie deux SBOM CycloneDX : un pour le backend Rust (cargo-cyclonedx), un pour le frontend (cdxgen). Deux fichiers séparés, parce que chaque générateur connaît le résolveur de son écosystème et que fusionner ferait perdre la traçabilité. Le script qui les produit est dans le repo, donc n'importe qui peut se placer sur un tag et régénérer les mêmes fichiers.

En amont, cargo-deny filtre ce qui a le droit d'entrer : liste d'autorisation des licences, registre limité à crates.io, dépôts git inconnus refusés. Les quatre advisories ignorées portent chacune leur chemin transitif et la raison écrite dans deny.toml, donc l'exception est relisible et elle saute dès qu'un correctif upstream sort.

Le tout tourne sur chaque pull request, avec cargo audit et pnpm audit, avant même les tests d'intégration. Et chaque release embarque un checksums.sha256 pour vérifier le binaire téléchargé.

L'objectif est simple : qu'une équipe puisse instruire l'outil elle-même, sans m'écrire.

#QoreDB #OpenSource #SupplyChainSecurity #Rust #DevSecOps #SBOM

---

# Commentaire

L'article détaille la configuration exacte : SBOM CycloneDX, deny.toml, audits CI et checksums de release.

https://www.qoredb.com/fr/blog/sbom-cargo-deny-checksums-supply-chain

# Post LinkedIn

Quand on construit un client de base de données multi-moteur, la tentation est forte : émuler côté client ce que le moteur ne supporte pas nativement.

Simuler des transactions sur MongoDB standalone ? Inférer un schéma sur Redis ? Traduire du SQL d'un dialecte à l'autre ?

On a fait le choix inverse dans QoreDB. Chaque driver déclare ses capacités via une structure DriverCapabilities. L'interface s'adapte automatiquement : si le moteur ne supporte pas les transactions, le bouton n'existe pas. Pas de bouton grisé, pas de tooltip "non supporté".

Pourquoi ? Parce qu'un polyfill SQL côté client crée trois problèmes : sémantique divergente, performances imprévisibles, et debugging opaque.

Un client de BDD est un outil de confiance. Si un bouton est là, la fonctionnalité est réelle.

J'explique le raisonnement complet dans l'article.

#QoreDB #OpenSource #Rust #DatabaseTooling #DeveloperExperience #SoftwareArchitecture

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/pourquoi-qoredb-nemule-pas-features-absentes

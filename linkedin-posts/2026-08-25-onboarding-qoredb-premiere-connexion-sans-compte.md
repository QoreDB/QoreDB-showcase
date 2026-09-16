# Post LinkedIn

Quand j'ai conçu l'onboarding de QoreDB, je me suis fixé une règle : au premier lancement, l'app ne doit rien demander.

Pas de compte. Pas de mot de passe maître à inventer. Pas de service à configurer.

Concrètement, ça donne quatre écrans purement informatifs (drivers, confidentialité, Free vs Pro), aucune saisie, un flag dans localStorage, et c'est terminé. Passer et Terminer appellent la même fonction : si tu sautes l'intro, elle ne revient pas te chercher au lancement suivant.

L'onboarding sert aussi de barrière réseau. Tant que le flag n'est pas écrit, la vérification de mise à jour vers GitHub reste inerte. Aucune requête sortante avant que l'utilisateur ait lu ce que fait l'application.

Le vault, lui, est déjà prêt. Les credentials vont dans le trousseau de l'OS, pas dans un fichier propriétaire qu'il faudrait déverrouiller. Rien à initialiser, la frontière de sécurité est le compte système.

Reste le formulaire : grille de drivers, puis des champs pré-remplis en localhost avec le bon port et l'environnement dev. Ou un DSN collé, parsé côté Rust avec des erreurs typées, et une détection locale du fournisseur managé sur le nom d'hôte.

Ce qui reste à saisir est ce que seul l'utilisateur peut savoir : quelle base, dans quel environnement, avec quel niveau de prudence.

#QoreDB #OpenSource #Rust #DevTools #LocalFirst #DeveloperExperience

---

# Commentaire

J'ai détaillé tout le parcours dans l'article : le flag localStorage, le gating réseau, le KeyringProvider, et le parsing DSN côté Rust.

https://www.qoredb.com/fr/blog/onboarding-qoredb-premiere-connexion-sans-compte

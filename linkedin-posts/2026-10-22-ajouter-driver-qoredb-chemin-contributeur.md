# Post LinkedIn

QoreDB parle à une trentaine de moteurs derrière la même interface Rust. La question qui revient le plus souvent : qu'est-ce qu'il faut faire pour en ajouter un ?

La réponse tient moins dans le code du driver que dans la cohérence entre les couches.

Un nouveau driver implémente le trait DataEngine dans qore-core, puis déclare honnêtement ce qu'il sait faire via capabilities() : les supports_*, le cancel_support (aucune, meilleur effort, ou pilotée par le driver), la pagination. Une opération non supportée renvoie un NotSupported explicite, jamais un succès vide.

Ensuite le feature flag driver-<id> traverse six manifestes Cargo, parce que le CLI, le serveur MCP et le serveur HTTP n'ont pas les mêmes valeurs par défaut que l'app de bureau. Un driver branché uniquement côté desktop compile très bien et disparaît silencieusement des points d'entrée headless.

Et la classification de sécurité ne s'hérite pas du driver voisin : le dispatch se fait par identifiant, pour qu'un nouvel ID ne tombe pas dans un classifieur SQL qui n'a rien à voir ni contourne le mode lecture seule.

C'est long. C'est le prix d'une interface unique qui ne masque pas les différences entre les moteurs.

#QoreDB #OpenSource #Rust #Database #SoftwareArchitecture #DevTools

---

# Commentaire

Le chemin complet est détaillé dans l'article, du trait Rust jusqu'aux chaînes traduites de l'interface, avec ce qui fait qu'un driver est considéré comme terminé.

https://www.qoredb.com/fr/blog/ajouter-driver-qoredb-chemin-contributeur

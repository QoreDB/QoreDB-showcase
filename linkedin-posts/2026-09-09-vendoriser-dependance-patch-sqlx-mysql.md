# Post LinkedIn

QoreDB embarque un fork local de sqlx-mysql. Une seule fonction est patchée, et voici pourquoi.

Sur une base MySQL sans mot de passe (un conteneur de dev, un root local), la connexion échouait avec "using password: YES". Contre-intuitif : aucun mot de passe saisi, et le serveur affirme le contraire.

La cause est dans le handshake. SQLx gère bien l'absence de mot de passe au premier échange. Mais quand le serveur demande un changement de plugin d'authentification, le code repasse par la fonction de scramble avec un unwrap_or_default(). La chaîne vide est alors hachée comme n'importe quelle autre, et le client envoie 20 ou 32 octets là où le serveur en attend zéro.

Le correctif tient en une fonction : mot de passe vide, réponse vide, quel que soit le plugin. Un seul fichier modifié, deux tests unitaires, la version épinglée sur 0.8.6, les licences MIT et Apache d'origine conservées, et un README qui donne la condition de retrait du patch.

Bonus : les 7 moteurs de la famille MySQL supportés par QoreDB (MariaDB, TiDB, PlanetScale, SingleStore, StarRocks, Doris) partagent la même feature. Un patch, toute la famille.

Vendoriser n'est pas un aveu d'échec. C'est un outil de dernier ressort qui reste tenable tant que le fork est minuscule et documenté.

#QoreDB #OpenSource #Rust #MySQL #SQLx #Cargo

---

# Commentaire

L'article détaille le handshake MySQL, le rôle du paquet AuthSwitchRequest et les règles qui gardent un répertoire vendor/ maintenable dans le temps.

https://www.qoredb.com/fr/blog/vendoriser-dependance-patch-sqlx-mysql

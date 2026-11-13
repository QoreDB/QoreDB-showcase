# Post LinkedIn

Certaines bases PostgreSQL n'acceptent pas un mot de passe. Elles attendent un certificat client, et une autorité commune pour vérifier les deux bouts.

Dans QoreDB, j'ai choisi de stocker les chemins des trois fichiers TLS, pas leur contenu. Le cycle de vie d'un certificat appartient à la PKI, pas au client de base de données : un cert renouvelé en place au même chemin continue de fonctionner sans qu'on retouche la connexion.

Trois détails qui comptent dans l'implémentation :

Le certificat client et sa clé privée sont validés en paire à l'enregistrement. Fournir l'un sans l'autre ne donne pas une connexion dégradée, ça donne une erreur de handshake opaque.

Les chemins sont encodés en pourcent avant d'entrer dans le DSN. Un chemin Windows avec une espace ou une esperluette couperait l'URL en silence.

Aucun parseur PEM maison : sqlx et rustls lisent, décodent et valident. En échange, la clé doit être un PEM non chiffré, et c'est documenté par driver plutôt que contourné.

Dernier point souvent mal connu : chez sqlx, sslmode=require avec un fichier CA chiffre mais ne vérifie pas le serveur. Il faut verify-ca ou verify-full.

#QoreDB #OpenSource #PostgreSQL #Rust #TLS #Security

---

# Commentaire

L'article détaille la construction du DSN, la règle de validation de la paire certificat / clé et l'import depuis une URL libpq existante.

https://www.qoredb.com/fr/blog/certificats-client-tls-mutuel-chemins-fichiers

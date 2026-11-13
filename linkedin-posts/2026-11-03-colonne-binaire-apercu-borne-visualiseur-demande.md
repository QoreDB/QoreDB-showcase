# Post LinkedIn

Une table de prod contient presque toujours une colonne qu'on ne lit pas : un bytea avec un avatar, un longblob avec un PDF, un varbinary avec une signature.

Le piège est simple. Si on met la valeur dans la cellule, une image de 2 Mo envoie 2,7 millions de caractères de base64 dans le DOM, pour une colonne large de huit caractères.

Dans QoreDB j'ai séparé deux choses : la valeur, qui reste entière pour la copie, l'export et les filtres, et ce que la cellule affiche, qui est borné par construction. Une colonne binaire montre son type et sa taille, pas son contenu.

Le reste suit la même logique. Le type réel est reconnu par test de préfixe sur la chaîne base64, sans rien décoder. Le SVG demande 512 octets décodés, pas un de plus. Le visualiseur est importé en lazy et monté seulement à l'ouverture, et chaque onglet a sa borne : 10 000 octets pour le dump hexadécimal, 5 Mo pour l'aperçu d'image, 50 Mo pour un décodage complet.

Une colonne binaire est une référence vers un contenu, pas un contenu à afficher.

#QoreDB #OpenSource #Rust #Tauri #DatabaseTools #React

---

# Commentaire

L'article détaille le chemin complet, du Value::Bytes côté Rust jusqu'au dump hexadécimal comparable à xxd dans l'interface.

https://www.qoredb.com/fr/blog/colonne-binaire-apercu-borne-visualiseur-demande

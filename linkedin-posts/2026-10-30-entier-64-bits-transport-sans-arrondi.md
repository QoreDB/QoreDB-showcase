# Post LinkedIn

Un nombre JSON est un double IEEE 754. Au delà de 9 007 199 254 740 991, il ne peut plus représenter chaque entier.

Un BIGINT, lui, monte jusqu'à 9 223 372 036 854 775 807.

Le problème n'est pas l'affichage. Dans un client de base de données, la clé primaire lue au chargement repart dans la clause WHERE quand on édite ou supprime une ligne. Un identifiant arrondi ne s'affiche pas de travers, il déplace la cible de la requête. Et le mauvais scénario n'est pas l'échec, c'est le succès silencieux.

Dans QoreDB, j'ai choisi de faire voyager ces valeurs dans une enveloppe marquée à une seule clé plutôt qu'en nombre JSON. En dessous de la limite sûre, rien ne change. Au dessus, la valeur part en chiffres et revient typée, donc le driver reçoit bien un entier et pas une chaîne qu'on confondrait avec une colonne texte.

Côté interface, la règle est de ne jamais déballer : pas de conversion en number ni en bigint, on compare des chaînes de chiffres pour l'identité de ligne, et l'export JSON les sort entre guillemets, parce qu'un nombre nu serait arrondi de nouveau par le premier parseur qui ouvre le fichier.

Pour les colonnes DECIMAL, il n'y a pas d'enveloppe : la valeur part en texte et le moteur l'accepte ou la refuse. Un refus explicite vaut mieux qu'une écriture arrondie que personne ne verra passer.

#QoreDB #OpenSource #Rust #DatabaseTooling #SoftwareEngineering #DataIntegrity

---

# Commentaire

Le détail du mécanisme, côté Rust et côté interface, est dans l'article :
https://www.qoredb.com/fr/blog/entier-64-bits-transport-sans-arrondi

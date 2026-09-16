# Post LinkedIn

Dans QoreDB, le composant qui décide quel code exécuter pour une connexion tient en 68 lignes.

C'est le DriverRegistry : une HashMap qui associe un identifiant de driver à une implémentation du trait DataEngine. Rien de plus.

Trois choix qui expliquent cette taille :

1. La clé n'est pas fournie par l'appelant, elle est lue sur le driver via driver_id(). Une seule source de vérité, pas de fichier de mapping à maintenir.

2. Les 33 drivers sont instanciés au démarrage, pas chargés à chaud. Pas de dlopen, pas de plugin natif à signer. Un driver au repos, c'est une struct et une map de sessions vide, donc le coût est nul.

3. Le registre ne garde aucun état mutable. Les pools vivent dans les drivers, les sessions dans le SessionManager. Le registre répond à "quel code", pas à "quelle connexion".

Bonus de ce découpage : TiDB, StarRocks, Doris et SingleStore réutilisent la même implémentation MySQL, paramétrée par un flavor. Chaque moteur garde son nom et son identifiant propres dans l'interface, sans duplication de code.

Et comme chaque enregistrement est gardé par une feature Cargo, un build CLI qui n'active que PostgreSQL et SQLite n'embarque ni le client MongoDB ni Tiberius.

#QoreDB #OpenSource #Rust #DatabaseTools #SoftwareArchitecture #DevTools

---

# Commentaire

J'ai détaillé le cycle complet d'une connexion dans l'article, y compris la garde Drop qui nettoie une session ouverte si le future est annulé avant son enregistrement.

https://www.qoredb.com/fr/blog/driver-registry-instanciation-dynamique-drivers

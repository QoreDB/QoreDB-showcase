# Post LinkedIn

Comment rendre un setup portable quand on refuse la synchronisation cloud ?

Sur QoreDB, la réponse tient en deux fichiers JSON que l'utilisateur manipule lui-même. Un backup de configuration pour le thème, la langue et la politique de sûreté. Un export de projet pour les connexions et la bibliothèque de requêtes.

Le point le plus important : l'export de projet ne contient jamais de mots de passe. Ce n'est pas une promesse, c'est structurel. Les métadonnées de connexion vivent dans connections.json, les secrets dans le keychain de l'OS sous une entrée séparée. La commande utilisée par l'export ne lit que le premier. Le type sérialisé n'a même pas de champ mot de passe.

L'import est additif, jamais destructif : les IDs sont régénérés, les collisions de noms suffixées. Recevoir le fichier d'un collègue ne peut pas écraser son propre travail. Le pire cas est un doublon visible, pas quinze connexions perdues.

Et parce qu'un JSON choisi par l'utilisateur reste une entrée non fiable : plafond de taille avant parsing, type guard sur la version sans migration silencieuse, validation connexion par connexion, entrée invalide ignorée et comptée plutôt que fatale.

En échange d'un geste explicite, aucun compte à créer et aucun serveur qui détient une copie de votre topologie d'infrastructure.

#QoreDB #OpenSource #Rust #DevTools #Security #LocalFirst

---

# Commentaire

J'ai détaillé le format des deux fichiers, la séparation vault / keychain et les couches de validation à l'import dans l'article complet.

https://www.qoredb.com/fr/blog/import-export-configuration-portabilite-setup

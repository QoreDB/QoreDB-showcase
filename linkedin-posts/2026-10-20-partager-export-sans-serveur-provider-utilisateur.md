# Post LinkedIn

Le partage de fichiers est la fonctionnalité qui pousse naturellement un outil desktop vers le SaaS. Un bucket, un domaine, et on gagne un bouton "Partager" qui marche partout. Au prix d'un chemin par lequel les données de tous les utilisateurs transitent chez l'éditeur.

Dans QoreDB, j'ai pris l'autre direction : il n'y a pas de serveur, donc pas de bucket. Le partage est une requête HTTP que vous décrivez vous-même, en six champs : URL d'upload, verbe POST ou PUT, corps multipart ou binaire, nom du champ fichier, chemin pour lire l'URL dans la réponse, nom d'affichage.

Ça couvre une URL présignée, un worker maison, un service de fichiers interne, sans aucune intégration par provider à maintenir dans le code.

Trois détails qui comptent : le token va au keychain système via le même CredentialProvider que le vault de connexions, donc exporter sa config ne déplace jamais un secret. L'URL d'upload doit être en HTTPS, sauf en boucle locale pour développer son endpoint. Et le fichier temporaire est supprimé juste après l'envoi, que l'upload ait réussi ou non.

Le résultat : l'app ne détient rien, et le lien qu'on colle dans un ticket pointe vers une infra que l'équipe maîtrise déjà.

#QoreDB #OpenSource #Rust #LocalFirst #DataEngineering #Security

---

# Commentaire

Le détail du mécanisme est dans l'article : préparation du fichier, validation des URLs, extraction du lien de retour.

https://www.qoredb.com/fr/blog/partager-export-sans-serveur-provider-utilisateur

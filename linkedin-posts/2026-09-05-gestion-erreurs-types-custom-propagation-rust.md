# Post LinkedIn

Sur un client de base de données, le code du chemin nominal est le plus court à écrire. Tout le reste sert à gérer ce qui rate.

QoreDB parle à une quinzaine de moteurs, et chacun a son propre vocabulaire d'échec : SQLSTATE, statuts HTTP, messages texte du protocole natif. J'ai fait trois choix pour ne pas laisser ça remonter tel quel jusqu'à l'interface.

Un seul enum Rust, EngineError, dont les variantes portent des données et pas seulement du texte : un timeout stocke sa durée, une limite de concurrence stocke le compteur et le plafond. Quand l'info n'existe que dans le message, ce message devient une API implicite que personne n'ose plus reformuler.

La classification appartient au driver, pas à une couche centrale. MySQL distingue "Access denied" d'un hôte injoignable, SQLite sépare syntaxe et exécution, les drivers HTTP partent du code de statut. Ajouter un moteur ne touche pas au code des autres.

Et un assainissement systématique avant la sortie du backend : credentials dans les URLs, paramètres password, chemins absolus. Un message d'erreur brut est un vecteur de fuite discret.

Le message natif du moteur, lui, reste affiché tel quel. Un dev qui lit "relation users does not exist" sait quoi faire. Une reformulation maison serait plus homogène et beaucoup moins utile.

#QoreDB #OpenSource #Rust #DatabaseTools #SoftwareArchitecture #ErrorHandling

---

# Commentaire

L'article détaille le mapping driver par driver, la propagation avec EngineResult et l'opérateur ?, et le nettoyage des messages à la frontière IPC.

https://www.qoredb.com/fr/blog/gestion-erreurs-types-custom-propagation-rust

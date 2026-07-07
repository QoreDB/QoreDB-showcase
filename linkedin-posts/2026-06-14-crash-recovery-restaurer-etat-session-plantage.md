# Post LinkedIn

Un client de base de données desktop accumule beaucoup de contexte au fil d'une session : onglets sur des tables, drafts SQL, vues de schéma. Quand l'app redémarre, par crash ou par mise à jour, je ne veux pas tout reconstruire à la main.

Dans QoreDB j'ai choisi une approche minimaliste pour le crash recovery : un snapshot sérialisé en continu dans localStorage, débouncé à 600 ms, restauré au démarrage si la connexion existe encore dans le vault local.

Pas de service en arrière-plan, pas de base auxiliaire, pas de synchro distante. Le snapshot contient la structure des onglets et les drafts, pas les résultats. Un TTL de 24h évite la restauration d'un état périmé, et un toggle saveQueryDrafts protège les machines partagées.

J'ai détaillé le raisonnement dans un nouvel article.

#QoreDB #OpenSource #Rust #Tauri #LocalFirst #DesktopApp

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/crash-recovery-restaurer-etat-session-plantage

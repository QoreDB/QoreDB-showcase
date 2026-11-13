# Post LinkedIn

Quand on modifie une ligne depuis un client de base de données, il ne reste rien. Le moteur répond OK, et le détail de ce qui a changé n'est nulle part.

Les mécanismes serveur existent (tables temporelles, triggers d'audit, logical decoding, CDC), mais ils se configurent côté base, demandent des privilèges, et n'ont presque rien en commun d'un moteur à l'autre.

Pour Time Travel dans QoreDB, j'ai pris l'autre position : le client est le processus qui exécute la mutation, donc il peut la consigner lui-même. Un fichier JSONL local, une ligne par changement, avec image avant et image après.

Trois points m'ont pris l'essentiel du travail :

- La lecture de l'image avant ne doit jamais abîmer l'écriture qu'elle documente. Sur PostgreSQL elle reste sur la connexion transactionnelle, encadrée par un savepoint privé relâché même en cas de succès, avec des délais bornés. Les drivers doivent déclarer un opt-in explicite pour y avoir droit.
- Chaque entrée porte l'identifiant de la connexion sauvegardée, pas un nom d'affichage. Deux bases "app" avec une table "users" ne mélangent jamais leurs historiques, sinon le SQL de rollback viserait la mauvaise.
- Le masquage s'applique avant l'écriture sur disque, clés primaires et JSON imbriqué compris, et la rétention borne le fichier (30 jours, 50 000 entrées, 500 MiB par défaut).

Le rollback, lui, génère du SQL dans l'éditeur. Il ne l'exécute pas.

#QoreDB #OpenSource #PostgreSQL #Rust #DatabaseTools #DataEngineering

---

# Commentaire

J'ai détaillé la mécanique dans l'article : capture protégée par savepoint, isolation par connexion, masquage et rétention.

https://www.qoredb.com/fr/blog/time-travel-journal-local-plutot-que-moteur

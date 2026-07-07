# Post LinkedIn

Les triggers et les événements planifiés font partie des objets de schéma les moins portables d'un moteur à l'autre.

Dans QoreDB, j'ai fait le choix de ne pas inventer d'abstraction commune.

Un trigger PostgreSQL et un trigger MySQL n'ont ni la même structure, ni les mêmes métadonnées. Les fusionner produirait un modèle qui ne représente correctement ni l'un ni l'autre.

À la place, chaque driver déclare sa capabilité via supports_triggers() et supports_events(). L'onglet Triggers apparaît uniquement quand le moteur le supporte, et la définition affichée est le texte brut renvoyé par pg_get_triggerdef, SHOW CREATE TRIGGER ou sqlite_master, selon le driver.

Côté sécurité, drop_trigger et drop_event passent par le Universal Query Interceptor, comme n'importe quelle requête destructrice. Le toggle reste plus léger parce que réversible.

Le résultat : un comportement prévisible d'un moteur à l'autre, sans surprise au moment de rejouer une définition.

#QoreDB #OpenSource #Rust #Databases #SQL #Tauri

---

# Commentaire

L'article complet ici : https://www.qoredb.com/fr/blog/triggers-evenements-gestion-multi-driver-qoredb

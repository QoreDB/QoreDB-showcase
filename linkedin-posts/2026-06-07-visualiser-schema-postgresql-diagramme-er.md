# Post LinkedIn

Visualiser le schéma d'une base PostgreSQL en diagramme entité-relation reste l'un des moyens les plus rapides pour comprendre un domaine fonctionnel.

J'ai comparé les principales options en 2026 : pgAdmin ERD Tool, SchemaSpy, DBeaver, DataGrip, dbdiagram.io, et l'approche intégrée dans QoreDB.

Le vrai choix se résume à une question : schéma déclaré (DBML, dbdiagram.io) ou schéma inféré par introspection de information_schema et pg_catalog ?

Dans QoreDB, j'ai opté pour l'introspection native, un rendu compact qui privilégie les colonnes clés, et le support des Virtual Relations pour les bases legacy sans FK déclarées. Tout en local, sans envoi de métadonnées à un service tiers.

#QoreDB #OpenSource #PostgreSQL #DatabaseTools #ERDiagram #DevTools

---

# Commentaire

Article complet ici, avec le détail de chaque outil et le workflow d'exploration :
https://www.qoredb.com/fr/blog/visualiser-schema-postgresql-diagramme-er

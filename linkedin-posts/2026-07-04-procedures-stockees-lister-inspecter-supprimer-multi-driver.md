# Post LinkedIn

Comment gérer les procédures stockées dans un client multi-bases ?

Dans QoreDB, j'ai fait un choix minimal : les lister, les inspecter, les supprimer. Pas de formulaire universel pour les créer ni les éditer.

La liste vient directement du catalogue du moteur (pg_proc pour PostgreSQL, information_schema.ROUTINES pour MySQL, sys.objects pour SQL Server). La source affichée est celle que le moteur restitue via pg_get_functiondef, SHOW CREATE PROCEDURE ou OBJECT_DEFINITION. Aucune reformatage, aucun dialecte pivot.

Pour éditer, on copie le CREATE OR REPLACE dans un onglet SQL et on l'exécute. Chaque moteur a sa propre grammaire pour les paramètres, les modes déterministes, la sécurité. Un formulaire universel serait soit trop pauvre soit trop divergent.

La suppression passe par l'intercepteur de sécurité comme n'importe quel DROP : mêmes règles, même journalisation, confirmation typée en Production.

SQLite, MongoDB et Redis n'ont pas cette notion. Dans ce cas, l'entrée Routines n'apparaît simplement pas dans l'arbre.

#QoreDB #OpenSource #PostgreSQL #MySQL #SQLServer #Rust

---

# Commentaire

L'article complet avec les détails d'implémentation du trait DataEngine et l'intégration avec le Universal Query Interceptor :

https://www.qoredb.com/fr/blog/procedures-stockees-lister-inspecter-supprimer-multi-driver

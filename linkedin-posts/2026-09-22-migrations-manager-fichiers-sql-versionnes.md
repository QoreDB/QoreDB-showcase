# Post LinkedIn

J'ai ajouté un gestionnaire de migrations à QoreDB, et le choix le plus structurant n'a pas été le format de fichier mais le chemin d'exécution.

Une migration est un simple fichier SQL versionné dans .qoredb/migrations/, avec des sections up et down à la dbmate. Diffable en Git, lisible et applicable sans QoreDB. L'état appliqué vit dans la base cible, pas sur le disque local : chaque environnement avance à son rythme, et seule la base sait où elle en est.

Le runner, lui, vérifie tout avant d'écrire quoi que ce soit. Chaque statement est découpé, analysé et passé dans le pipeline d'interception avant que le premier ne s'exécute. Une migration à moitié appliquée parce que le septième statement a été bloqué est un état bien pire qu'une migration qui n'a jamais démarré.

Deux détails dont je suis content :

Le splitter ne passe pas par un AST. Il retourne des tranches empruntées du script original, pour que commentaires, casse et formatage arrivent à la base tels qu'ils ont été écrits. Quand il ne peut pas découper proprement (DELIMITER MySQL, GO avec compteur, corps procédural ambigu), il refuse avec un code et un offset au lieu de deviner.

Côté MySQL, le driver annonce des transactions mais beaucoup de statements committent implicitement. J'utilise une liste positive plutôt qu'une liste noire : tout SQL non reconnu reste sur le chemin conservateur. Un rollback ne doit jamais prétendre annuler un commit.

#QoreDB #OpenSource #Rust #PostgreSQL #DatabaseMigrations #DevTools

---

# Commentaire

L'article détaille le format de fichier, la table d'historique qoredb_migrations et les gardes qui encadrent chaque application (checksum, versions dupliquées, apply concurrent).

https://www.qoredb.com/fr/blog/migrations-manager-fichiers-sql-versionnes

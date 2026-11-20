# Post LinkedIn

Une migration qui passe la validation syntaxique ne dit toujours pas ce qu'elle va casser.

J'ai donc ajouté une analyse de blast radius dans QoreDB, qui croise trois sources locales avant l'exécution.

L'AST d'abord : le SQL est parsé avec sqlparser dans le dialecte du driver, et douze types de dangers en sortent (DROP, TRUNCATE, renommages, changement de type, NOT NULL, UNIQUE, FK, CHECK, VARCHAR raccourci). Un DROP TABLE dans un commentaire n'est pas un danger, contrairement à ce qu'une regex aurait conclu.

Le journal d'audit ensuite : les mille dernières requêtes exécutées depuis le client, filtrées sur le driver et la base, avec une correspondance de table sur frontière de mot. users ne matche pas users_archive.

Le workspace enfin : requêtes sauvegardées, carnets, contrats de qualité, jeux de replay et endpoints de l'Instant Data API qui référencent les tables touchées.

Et pour les contraintes, un bouton optionnel lance des sondes SELECT COUNT(*) en lecture seule, qui passent par le même pipeline que n'importe quelle requête utilisateur : rate limiter, intercepteur, politique de sûreté, masquage, timeout à 5 s. Combien de valeurs dépassent la nouvelle longueur, combien de lignes filles n'ont pas de parent. Deux nombres, et la décision n'est plus à l'instinct.

#QoreDB #OpenSource #Rust #PostgreSQL #DatabaseMigrations #DevTools

---

# Commentaire

L'article détaille l'implémentation : extraction des dangers depuis l'AST, croisement avec audit.jsonl, scan du dossier .qoredb/ et génération des sondes de pré-vérification.

https://www.qoredb.com/fr/blog/blast-radius-migration-ast-audit-sondes

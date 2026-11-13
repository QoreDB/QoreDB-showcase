# Post LinkedIn

QoreDB sait générer une migration à partir du delta entre une baseline de schéma et le schéma live. En écrivant cette fonctionnalité, j'ai passé plus de temps sur la capture que sur le générateur de SQL.

La raison est simple : un diff travaille sur deux listes. Une table présente dans la baseline et absente de la capture live n'est pas une table illisible, c'est une table supprimée. Donc un DROP TABLE.

Du coup tout ce qui peut rendre une capture partielle devient un chemin vers du SQL destructeur : une page d'énumération tronquée, un total qui change en cours de route, un describe en erreur.

L'énumération est donc en fail-closed. Une seule sortie normale, le cumul égale exactement le total annoncé. Tout le reste lève : total instable, nom dupliqué, page vide prématurée, borne de pagination atteinte.

La capture remonte les tables qu'elle n'a pas pu décrire dans une seconde liste au lieu de les faire disparaître du snapshot. La vue de comparaison tolère ces trous et les annote. La génération, elle, refuse.

Troisième cas, plus subtil : un changement que le dialecte ne sait pas exprimer, typiquement un changement de type sur SQLite. Le script produit serait vide et se lirait comme "aucun changement". Les opérations sont donc réévaluées une par une, et la génération est refusée plutôt que de livrer une migration à moitié écrite.

#QoreDB #OpenSource #Rust #DatabaseMigrations #SQL #DevTools

---

# Commentaire

J'ai détaillé les garde-fous de la capture, la distinction baseline / comparaison et le traitement du down irréversible dans l'article :

https://www.qoredb.com/fr/blog/refus-migration-capture-schema-incomplete

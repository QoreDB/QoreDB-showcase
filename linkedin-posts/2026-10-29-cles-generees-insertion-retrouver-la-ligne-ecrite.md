# Post LinkedIn

Quand on insère une ligne depuis un client de base de données, on connaît les valeurs qu'on a saisies, pas celles que la base fabrique. Un identifiant auto-incrémenté ne prend sa valeur qu'à l'écriture.

Pour que Time Travel puisse revenir sur cette insertion, il faut une clé primaire vérifiée. Dans QoreDB, je la demande à la base dans l'instruction d'insertion elle-même, via une clause RETURNING limitée aux colonnes de clé, lues dans le schéma et pas dans le formulaire.

Deux détails qui comptent.

D'abord, les valeurs restituées établissent une identité, pas un état : la sortie de RETURNING ne reflète pas les triggers AFTER, donc l'image finale est relue depuis la base juste après.

Ensuite, sur PostgreSQL, RETURNING impose des privilèges de lecture et déclenche les politiques de sécurité au niveau ligne. Le driver vérifie d'abord avec row_security_active et has_column_privilege. Si ça ne passe pas, l'insertion se fait sans restitution : l'écriture réussit, l'historique reste incomplet. La mutation demandée ne dépend jamais de la capacité à l'archiver.

Pas de second INSERT, pas de lecture d'un compteur global, pas de clé devinée.

#QoreDB #OpenSource #Rust #PostgreSQL #SQLite #DatabaseTooling

---

# Commentaire

J'ai détaillé le contrat interne, les garde-fous et le parcours complet d'une insertion dans l'article :
https://www.qoredb.com/fr/blog/cles-generees-insertion-retrouver-la-ligne-ecrite

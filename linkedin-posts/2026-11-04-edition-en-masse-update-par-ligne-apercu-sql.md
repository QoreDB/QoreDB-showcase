# Post LinkedIn

Modifier cinq lignes d'une table depuis une grille, c'est banal. Mais la vraie question est : quel SQL va réellement partir, et sur quelles lignes exactement ?

Dans QoreDB, l'édition en masse ne compose pas un seul UPDATE avec un WHERE IN. Chaque ligne sélectionnée produit une modification indépendante, avec sa clé primaire capturée au moment de la sélection, son ancienne valeur et sa nouvelle. Le périmètre est fermé par construction : aucune ligne arrivée entre temps ne peut être touchée.

Le dialogue n'écrit pas de SQL lui-même. Il envoie la liste des changements au backend Rust, qui génère le script dans le dialecte réel du moteur, et l'affiche. MongoDB reçoit des updateOne, pas un UPDATE traduit. Un driver inconnu produit un avertissement, pas une génération silencieuse.

Le piège le moins visible était numérique : Number() en TypeScript transforme 9007199254740993 en ...992. L'arrondi se produisait avant l'aperçu, donc l'aperçu montrait une valeur jamais tapée. Les entiers hors plage sûre passent maintenant par une enveloppe exacte, et les décimaux longs restent du texte jusqu'au driver.

Et quand une erreur arrive alors qu'une écriture a peut-être déjà eu lieu, le résultat est marqué indéterminé plutôt que décrété en échec. Dire "je ne sais pas" est plus utile que choisir à la place de l'utilisateur.

#QoreDB #OpenSource #Rust #SQL #DatabaseTools #DataEngineering

---

# Commentaire

L'article détaille le chemin complet : plan, validation, génération backend, précision numérique et application transactionnelle.

https://www.qoredb.com/fr/blog/edition-en-masse-update-par-ligne-apercu-sql

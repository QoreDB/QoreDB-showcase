# Post LinkedIn

Dans QoreDB, une requête sauvegardée peut contenir des placeholders : {{client_id}}, $depuis. On les remplit à l'exécution. C'est pratique, et c'est exactement là que vit l'injection SQL.

Impossible de déléguer ça au protocole de paramètres liés du moteur : la requête est du texte libre, le placeholder peut être n'importe où, et les moteurs supportés n'ont ni la même syntaxe ni les mêmes règles de littéraux. J'ai donc écrit la substitution, avec trois décisions.

Un type déclaré par variable (text, number, date, select). Le type décide du formatage et de ce qui est refusé. Un nombre doit matcher un littéral numérique, et il est émis caractère pour caractère : 9007199254740993 ne passe jamais par un flottant, donc pas d'arrondi. Une saisie comme "1; DROP TABLE users" n'est pas un nombre, le placeholder reste non résolu et la requête échoue bruyamment sur une erreur de syntaxe.

Une seule passe de remplacement. Si la valeur d'une variable contient elle-même {{autre}}, ce texte reste du texte : il n'est jamais réexaminé. Pas de boucle jusqu'à point fixe, donc pas de moyen de fabriquer un placeholder depuis une valeur.

Des littéraux, jamais des identifiants. Une seule forme de sortie à sécuriser, pas deux jeux de règles d'échappement avec guillemets doubles, backticks et crochets selon le moteur.

Le même moteur sert la Query Library et les notebooks. Un chemin de code, un jeu de tests.

#QoreDB #OpenSource #SQL #Rust #Security #DatabaseTools

---

# Commentaire

Le détail du mécanisme, avec les cas de test et le raisonnement derrière chaque règle de formatage :
https://www.qoredb.com/fr/blog/requetes-parametrees-substitution-une-passe

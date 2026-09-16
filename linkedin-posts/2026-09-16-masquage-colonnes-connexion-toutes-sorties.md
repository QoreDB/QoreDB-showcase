# Post LinkedIn

Masquer une colonne sensible dans un client de base de données, c'est facile à faire mal : on formate la cellule côté UI, et la valeur ressort quand même dans l'export, dans le streaming ou dans le contexte envoyé à un agent.

Dans QoreDB, j'ai posé le masquage au point de sortie des lignes, côté Rust, pas à l'affichage. Une règle est attachée à la connexion sauvegardée (table, colonne, mode) et le même code l'applique à la grille, la pagination, l'export, la fédération, la Data API, les mutations, la recherche plein texte, le serveur MCP et le CLI.

Trois modes : masqué complet, partiel (jamais plus de la moitié de la valeur, pour qu'un CVV à 3 chiffres ne s'affiche pas en entier), et empreinte SHA-256 salée par connexion, qui laisse encore grouper les doublons sans être comparable à un dictionnaire public.

Le cas le plus intéressant, ce sont les agents : ils écrivent leurs propres requêtes. Masquer la sortie ne suffit pas, parce qu'un alias ou un WHERE LIKE permet de deviner la valeur sans jamais l'afficher. Sur une connexion masquée, une colonne masquée n'est donc acceptée qu'en projection nue. Alias, expressions, filtres, tris, UNION et sérialisations de ligne entière (row_to_json, json_agg) sont refusés avant exécution.

Ce n'est pas un contrôle d'accès, les droits restent ceux du compte base. C'est un garde-fou d'affichage et d'extraction, placé à l'endroit où il n'y a qu'une seule fonction à relire.

#QoreDB #OpenSource #Rust #DataPrivacy #Security #DevTools

---

# Commentaire

Le détail de l'implémentation (plan de masquage, streaming, bases documents, analyse des requêtes d'agent) est dans l'article :

https://www.qoredb.com/fr/blog/masquage-colonnes-connexion-toutes-sorties

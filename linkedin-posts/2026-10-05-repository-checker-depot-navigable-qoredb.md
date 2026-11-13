# Post LinkedIn

Sur QoreDB, les conventions de dépôt qui ne sont pas vérifiées par une machine finissent par n'exister que dans ma tête.

J'ai donc écrit un script Node de 109 lignes, lancé en local et en CI, qui contrôle quatre choses : les liens Markdown locaux dans les docs maintenues, le fait que tout document public soit atteignable depuis un index, la forme et la taille des fichiers d'instructions pour agents, et l'en-tête SPDX en première ligne des 857 fichiers TypeScript et Rust de première main.

Deux détails qui comptent plus qu'ils n'en ont l'air.

La liste des fichiers vient de git ls-files, pas d'un parcours du disque : node_modules et dist ne sont jamais vus, et un fichier pas encore committé est déjà contrôlé.

Le script ne fait aucune requête réseau et ne valide pas les ancres. Un contrôle qui dépend d'un site tiers finit par échouer pour une raison qui n'a rien à voir avec le commit, et un contrôle qui échoue au hasard cesse d'être lu.

Le vérificateur a ses propres tests, avec un dépôt minimal construit dans un répertoire temporaire et un override par règle cassée. En CI, il est validé avant d'être utilisé comme juge.

#QoreDB #OpenSource #DevTools #CI #Rust #DeveloperExperience

---

# Commentaire

J'ai détaillé le fonctionnement du script, les quatre règles et les arbitrages derrière ce périmètre étroit dans l'article :

https://www.qoredb.com/fr/blog/repository-checker-depot-navigable-qoredb

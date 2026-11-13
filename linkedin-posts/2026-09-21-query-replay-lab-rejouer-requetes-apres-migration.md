# Post LinkedIn

Une migration de schéma se teste mal. Les tests passent, et trois jours plus tard une requête d'un écran secondaire renvoie des lignes différentes.

J'ai construit le Query Replay Lab pour ça : QoreDB enregistre les requêtes exécutées pendant une session de travail, puis les rejoue après la migration.

Deux décisions structurent le reste.

Le fichier de jeu est versionné dans le dépôt, mais il ne contient aucune ligne de résultat. Deux tests verrouillent cette frontière. Le texte des requêtes est du code, les données qu'elles renvoient ne le sont pas : elles restent sur la machine, bornées et purgées par rétention.

L'empreinte de résultat est un SHA-256 calculé après tri canonique des lignes. Sans ORDER BY, un moteur ne garantit pas l'ordre, et un outil qui remonte un faux positif à chaque rejeu perd toute crédibilité en une semaine.

Le reste suit la même logique : un verdict "résultat non comparé" explicite quand il n'y a ni nombre de lignes ni empreinte des deux côtés, une couverture affichée dans le rapport, et une classification de mutation recalculée depuis le texte au preflight, jamais lue depuis le fichier. Un fichier versionné arrive par une pull request, donc il n'est pas une source d'autorité.

#QoreDB #OpenSource #Rust #DatabaseMigration #BackendEngineering #DevTools

---

# Commentaire

L'article détaille le format du fichier, le calcul de l'empreinte, les sept verdicts et le mode A/B.

https://www.qoredb.com/fr/blog/query-replay-lab-rejouer-requetes-apres-migration

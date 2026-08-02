# Post LinkedIn

Coller un script SQL de plusieurs instructions dans un éditeur de base de données paraît trivial.

En pratique, ça cache plusieurs décisions techniques.

Sur QoreDB, j'ai choisi de découper le buffer côté client avec sqlparser plutôt que de l'envoyer en bloc au driver.

Trois raisons concrètes :

1. Les protocoles réagissent différemment. PostgreSQL en extended query ne l'autorise pas. MySQL exige un flag CLIENT_MULTI_STATEMENTS. Restituer proprement chaque résultat impose de connaître le nombre exact d'instructions.

2. Le parsing garantit qu'un point-virgule dans une chaîne ou un commentaire ne sera jamais confondu avec un séparateur. Un cache LRU rend le split quasi gratuit après le premier appel.

3. L'exécution reste dans la même session : variables locales, transactions et search_path sont préservés. Si l'instruction N échoue après N-1 succès, l'erreur remonte le rang exact.

Pour les migrations versionnées, un chemin séparé préserve le texte byte-à-byte et rejette les constructions ambiguës plutôt que de deviner.

Deux mécanismes distincts pour deux contrats incompatibles.

#QoreDB #OpenSource #Rust #SQL #DatabaseTools #Tauri

---

# Commentaire

Article complet avec les détails d'implémentation (sqlparser, split_ch_statements pour ClickHouse, propagation d'erreur) :

https://www.qoredb.com/fr/blog/multi-statement-execution-script-sql-complet

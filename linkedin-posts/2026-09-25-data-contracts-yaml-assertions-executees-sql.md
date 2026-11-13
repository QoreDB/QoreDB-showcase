# Post LinkedIn

Vérifier la qualité d'une table, ça finit toujours pareil : trois requêtes tapées à la main pour compter les NULL, les doublons et les orphelins, un coup d'oeil, et on ferme l'onglet. La semaine suivante, on retape les mêmes.

J'ai sorti les Data Contracts dans QoreDB pour arrêter ça. Un contrat, c'est un fichier YAML dans le workspace : une table cible, une liste de règles. Onze types typés (not_null_pct, unique, allowed_values, foreign_key_integrity, row_count...) plus custom_sql pour le reste.

Le point technique qui compte : rien n'est évalué côté client. Chaque règle est traduite en SQL par le moteur cible, avec une requête de métrique qui ramène une seule ligne et une requête d'échantillons qui ne part que si la règle échoue. Le volume transféré est indépendant de la taille de la table, et c'est le planificateur du moteur qui travaille, avec ses index.

Huit dialectes couverts, le quoting, les fonctions de longueur et les opérateurs regex centralisés dans un seul module. Un moteur non reconnu n'est pas approximé : ça s'arrête avec un message clair.

Et custom_sql passe par sqlparser avant exécution : exactement un statement, et ce statement doit être une requête. PostgreSQL accepte plusieurs statements par message via le Simple Query protocol, donc envelopper la requête dans un SELECT count(*) ne suffit pas à garantir la lecture seule. La barrière est au parseur.

Chaque exécution s'ajoute à un JSONL local, tronqué aux 200 dernières. De quoi voir une dérive s'installer sur plusieurs semaines sans monter de plateforme d'observabilité.

#QoreDB #OpenSource #DataQuality #Rust #SQL #DataEngineering

---

# Commentaire

L'article détaille le format YAML, la génération SQL par dialecte et le hook de réévaluation post-mutation.

https://www.qoredb.com/fr/blog/data-contracts-yaml-assertions-executees-sql

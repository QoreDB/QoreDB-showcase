# Post LinkedIn

VACUUM, OPTIMIZE, REPAIR, CHECK, compact, validate.

Chaque moteur a son propre vocabulaire pour parler de la maintenance des tables, et ces mots ne veulent pas dire la même chose.

Dans QoreDB, j'ai fait le choix de ne pas les uniformiser derrière un menu abstrait "Optimiser la table".

Chaque driver déclare ses propres opérations avec leurs options réelles : FULL pour VACUUM PostgreSQL, choix d'index pour CLUSTER, moteur cible pour ChangeEngine sur MySQL.

Le dialog affiche la commande qui va être exécutée avant de la lancer, structure la sortie (info, warning, error, status) et passe par le même point de contrôle que le reste des mutations : mode read-only, environnement Dev/Staging/Prod, règles de l'interceptor.

Le développeur voit le nom du moteur. QoreDB s'occupe de la découverte, de l'exécution et des garde-fous.

#QoreDB #OpenSource #PostgreSQL #MySQL #DatabaseAdmin #Rust

---

# Commentaire

Lien vers l'article complet, qui détaille comment le dialog est câblé et ce que chaque driver expose :

https://www.qoredb.com/fr/blog/operations-maintenance-vacuum-analyze-optimize-repair

# Post LinkedIn

Le bug qui fait le plus de dégâts sur une base, ce n'est pas la requête malveillante. C'est la boucle qu'on n'avait pas vue.

Un notebook qui itère, un composant qui se réabonne parce qu'une dépendance est mal mémorisée, un script de migration mal borné : la base encaisse des centaines de requêtes en quelques secondes sans que personne ne l'ait voulu.

Dans QoreDB, j'ai mis un token bucket par session en tête du preflight. 60 jetons, remplissage continu de 6 par seconde. Le remplissage continu plutôt qu'une fenêtre glissante, c'est volontaire : ouvrir un onglet qui déclenche dix requêtes de métadonnées d'un coup doit passer, une boucle serrée ne doit pas.

Le contrôle est la première instruction du preflight, avant la lecture du mode read-only, avant la récupération du driver, avant le parsing SQL. Une requête refusée ne coûte donc presque rien. Et l'agent IA, le serveur MCP et l'utilisateur partagent le même budget : la source change l'attribution dans l'audit, pas le plafond.

Rien n'est persisté, les seaux vivent en mémoire et sont oubliés à la déconnexion. Ça protège d'un emballement dans une session en cours, pas d'un quota à faire respecter dans la durée. Quarante lignes de Rust, sans dépendance.

#QoreDB #OpenSource #Rust #DatabaseTools #RateLimiting #Observability

---

# Commentaire

J'ai détaillé l'implémentation, le calibrage du budget et le placement dans le pipeline ici :
https://www.qoredb.com/fr/blog/rate-limiting-requetes-token-bucket-qoredb

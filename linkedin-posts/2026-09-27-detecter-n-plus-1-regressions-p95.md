# Post LinkedIn

Un client de base de données voit passer toutes les requêtes d'une session : l'éditeur, la navigation, le CLI, le serveur MCP, un agent. C'est une position d'observation que ni l'ORM ni le serveur n'ont vraiment.

J'ai utilisé ça dans QoreDB pour détecter trois motifs coûteux, sans rien instrumenter.

Le N+1 : la même empreinte de requête, 20 fois ou plus, en moins de 2 secondes. La fenêtre courte est volontaire. 40 exécutions espacées d'une demi-seconde ne déclenchent rien, c'est souvent un traitement par lots légitime. Ce qui mérite une alerte, c'est la boucle serrée. Avec les agents qui parcourent un résultat ligne par ligne via MCP, le cas est devenu fréquent.

Les seuils : taux d'erreur et nombre de requêtes lentes sur une fenêtre glissante de 15 minutes, avec un plancher de 10 exécutions. Sur 3 requêtes, un échec fait 33 %, ce qui ne veut rien dire.

La régression : le P95 des dernières 24 h comparé à celui des 7 jours précédents, sur au moins 20 exécutions. Celle-là relit le journal d'audit sur disque, parce qu'une comparaison sur 8 jours doit survivre à un redémarrage.

Trois échelles de temps, trois mécanismes distincts plutôt qu'un moteur générique paramétrable à l'infini. Chaque détection écrit aussi son entrée dans le journal d'audit : une notification qui disparaît ne se relit pas.

#QoreDB #OpenSource #Rust #Database #Observability #Performance

---

# Commentaire

Le détail de l'implémentation, avec les constantes et le raisonnement derrière chaque seuil :
https://www.qoredb.com/fr/blog/detecter-n-plus-1-regressions-p95

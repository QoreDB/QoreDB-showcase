# Post LinkedIn

Brancher un agent IA sur une base de données pose une question que le prompt système ne règle pas : qu'est-ce qu'il a le droit de faire sans demander ?

Dans QoreDB, j'ai sorti cette réponse du modèle pour la mettre dans le backend Rust. Le Database Agent ne parle jamais à un driver. Il émet des appels d'outils, et chaque appel traverse une fonction de classification qui renvoie Auto, Confirm ou Block.

Lecture et écriture ne passent pas par le même outil. run_query est analysé selon le dialecte du driver : une écriture déguisée est refusée, et une requête que l'analyseur n'a pas su classer est refusée aussi. Sur 34 moteurs, ce cas arrive, et le traiter comme un refus est ce qui rend la garantie vérifiable.

run_mutation dépend de l'environnement de la connexion : confirmation humaine en dev et staging, blocage inconditionnel en production, évalué avant même d'afficher une question. Une confirmation peut être mémorisée pour la session, jamais sur disque, et jamais pour la production ni pour une requête fédérée.

L'ensemble des actions possibles est une liste fermée de branches dans une fonction, pas ce que le modèle a compris de ses instructions.

#QoreDB #OpenSource #Rust #AIAgents #DatabaseSecurity #DevTools

---

# Commentaire

J'ai détaillé le fonctionnement du permission gate, la classification des requêtes et la provenance dans l'audit ici :

https://www.qoredb.com/fr/blog/permission-gate-actions-ia-qoredb

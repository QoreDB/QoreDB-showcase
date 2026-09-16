# Post LinkedIn

La question qu'on me pose le plus souvent sur QoreDB n'est pas "est-ce que ça fait X", c'est "pourquoi ça ne fait pas X".

J'ai fini par écrire le périmètre noir sur blanc, avec une règle de tri simple : est-ce qu'un développeur ferait confiance à cette interface pour toucher sa prod à deux heures du matin ?

Ce qui reste dehors, et pourquoi :

Pas de reporting. Un graphique agrège, arrondit, choisit une échelle. À chaque étape il éloigne de la ligne réelle. L'écran principal reste le Data Grid.

Pas d'ETL. La fédération monte les sources dans DuckDB à l'exécution et jette le résultat. Aucun entrepôt à provisionner, aucun job à surveiller. C'est ce qui la rend utilisable en cinq minutes pendant un incident.

Pas de framework de migration. QoreDB applique des fichiers SQL et en garde la trace. Le schéma est déjà géré ailleurs, par Prisma, Flyway ou un dossier de scripts. Arbitrer par-dessus créerait deux sources de vérité sur le même schéma.

Pas de backend applicatif. L'Instant Data API est bindée sur 127.0.0.1, lecture seule, sans option pour l'exposer sur le réseau.

Le temps qu'on ne passe pas à construire un moteur de reporting, on le passe à ce que la pagination, l'annulation de requête et l'édition en ligne se comportent correctement sur les dix-huit drivers.

#QoreDB #OpenSource #DatabaseTools #Rust #ProductDesign #Engineering

---

# Commentaire

L'article détaille le raisonnement derrière chaque frontière, et ce qui reste ouvert sur la roadmap.

https://www.qoredb.com/fr/blog/perimetre-qoredb-ce-qu-il-ne-fait-pas

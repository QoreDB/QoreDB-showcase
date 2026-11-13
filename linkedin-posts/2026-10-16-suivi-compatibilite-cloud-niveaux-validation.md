# Post LinkedIn

QoreDB parle à 34 moteurs. Beaucoup n'existent que comme services hébergés : Snowflake, BigQuery, PlanetScale, Amazon Keyspaces, Azure SQL.

Je n'ai pas un compte payant chez chaque fournisseur. La question n'est donc pas "comment tout tester", mais "comment ne jamais raconter n'importe quoi sur ce qui est testé".

La règle que j'applique : un scénario porte deux étiquettes, le résultat et le niveau. Moteur local, réponses simulées, service réel, non exécuté. Un test vert en local laisse le parcours cloud non vérifié, et les deux affirmations cohabitent sans se contredire.

Conséquences concrètes dans le dépôt :

Les identités compatibles sont nommées comme telles. La suite d'intégration affiche "MySQL (PlanetScale stand-in)", pas "PlanetScale".

Pour les drivers HTTP, wiremock couvre ce que je contrôle vraiment : JWT par paire de clés, réutilisation du token en cache, polling jusqu'à l'état terminal, mapping des erreurs par statut, annulation, dry run BigQuery sans polling.

Un service absent fait sauter ses tests avec un message explicite. En CI, QOREDB_TEST_<SERVICE>_REQUIRED retransforme le saut en échec : un conteneur mort donne un build rouge, pas un trou silencieux.

Ça coûte un peu de discipline d'écriture. En échange, un contributeur peut couvrir un driver sérieusement sans abonnement, et quelqu'un qui lit la doc avant de brancher sa prod sait ce qui a été exercé, sur quoi, et à quelle date.

#QoreDB #OpenSource #Rust #Testing #DevTools #Database

---

# Commentaire

J'ai détaillé les quatre niveaux de validation, le mécanisme de skip explicite et la fiche de suivi ici :

https://www.qoredb.com/fr/blog/suivi-compatibilite-cloud-niveaux-validation

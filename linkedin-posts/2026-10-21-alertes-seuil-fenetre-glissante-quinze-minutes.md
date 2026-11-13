# Post LinkedIn

J'ai ajouté des alertes de seuil dans QoreDB, et le code tient dans un seul fichier d'environ 150 lignes.

Deux signaux seulement : le taux d'erreur et le nombre de requêtes lentes, mesurés sur une fenêtre glissante de 15 minutes.

Trois décisions qui font tout le mécanisme :

Une file d'échantillons (instant, succès, lenteur) où l'on retire par l'avant tout ce qui dépasse la fenêtre. Un compteur cumulé depuis le démarrage ne dit rien : après deux heures d'usage normal, dix erreurs d'affilée ne bougent pas la moyenne.

Un minimum de 10 requêtes avant d'évaluer le taux d'erreur. Une requête ratée sur une, c'est 100 %, et c'est juste la première connexion de la session.

Un désarmement par seuil : une alerte ne se rejoue pas à chaque requête suivante, seulement après une fenêtre complète. Un franchissement est un événement, pas un état à répéter.

Le franchissement sort par deux chemins : une entrée dans audit.jsonl avec le chiffre exact, et un événement vers l'app que l'interface transforme en notification. Le backend décide qu'il y a quelque chose à dire, l'interface décide de l'affichage.

Pas de collecteur, pas de réseau, pas de compte. La surveillance se règle sur le poste qui exécute les requêtes.

#QoreDB #OpenSource #Rust #Observability #DatabaseTools #SRE

---

# Commentaire

J'ai détaillé le mécanisme complet dans l'article : la fenêtre glissante, l'horloge monotone, pourquoi les requêtes bloquées ne comptent pas dans le taux d'erreur.

https://www.qoredb.com/fr/blog/alertes-seuil-fenetre-glissante-quinze-minutes

# Post LinkedIn

Dans QoreDB, chaque requête exécutée laisse une ligne dans un fichier JSONL local. Pas de serveur de collecte, pas d'agent : un append en fin de fichier, lisible avec un grep ou un jq.

Trois décisions structurent ce journal.

La rédaction des secrets est appliquée à la construction de l'entrée, avant le cache mémoire et avant le disque. Le texte brut reste disponible en amont, parce que l'analyse de sûreté a besoin de la requête réelle pour décider de la bloquer. Rédiger plus tôt affaiblirait la détection, plus tard laisserait la valeur transiter par le disque.

Chaque entrée porte une empreinte : la requête est normalisée (littéraux et placeholders remplacés, espaces compactés) puis hachée en SHA-256 dont on garde 16 caractères hex. Deux exécutions qui ne diffèrent que par leurs paramètres tombent dans le même groupe. Ce n'est pas une primitive de sécurité, c'est une clé de regroupement stable.

Les tendances sont recalculées depuis le fichier, pas depuis la mémoire : top 50 des empreintes sur 7, 14 ou 30 jours, avec P50, P95 et taux d'erreur par jour. C'est ce qui permet de répondre à "est-ce que cette requête est plus lente qu'il y a une semaine" après un redémarrage de l'app.

Les entrées bloquées sont exclues des tendances : elles n'ont jamais atteint la base, leur temps d'exécution ne décrit rien.

#QoreDB #OpenSource #Rust #Observability #DatabaseTools #Security

---

# Commentaire

Le détail du format, de la rotation write-then-rename et de la normalisation par driver est dans l'article.

https://www.qoredb.com/fr/blog/journal-audit-qoredb-jsonl-empreintes-tendances

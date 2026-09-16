# Post LinkedIn

QoreDB a embarqué une intégration analytics opt-in jusqu'à la v0.1.x. Je l'ai supprimée. Pas désactivée par défaut, supprimée.

La raison est simple : un client de base de données voit passer des noms de tables, des noms de colonnes, des messages d'erreur qui contiennent parfois des valeurs. Maintenir la garantie "rien ne part de votre poste" avec un SDK tiers dans le bundle, c'est revérifier à chaque release que le court-circuit tient toujours. En face, le bénéfice était un compteur d'usage agrégé.

Aujourd'hui la garantie tient par construction, pas par une case à cocher. La directive connect-src de la CSP Tauri n'autorise que les canaux IPC locaux : depuis le webview, aucune requête externe ne peut aboutir, même ajoutée par accident.

Ce qui reste : les diagnostics sont locaux et désactivés par défaut, les logs sont purgés au bout de 7 jours, les rapports de crash sont nettoyés (credentials, tokens, chemin HOME) avant même d'atteindre l'interface, et leur envoi reste une action manuelle.

Le seul appel sortant est la vérification de mise à jour vers GitHub. Elle est annoncée dans l'onboarding, ne part pas avant qu'il soit terminé, et se coupe dans les réglages.

Ne pas mesurer a un prix : je découvre les bugs par les issues, pas par un dashboard. Pour un outil branché sur des bases de prod, l'arbitrage est vite fait.

#QoreDB #OpenSource #Privacy #Rust #Tauri #DevTools

---

# Commentaire

L'article détaille le mécanisme complet : purge de l'état hérité au démarrage, CSP, scrubbing des rapports de crash, signature minisign des mises à jour. Et comment vérifier tout ça soi-même en quelques commandes.

https://www.qoredb.com/fr/blog/telemetrie-qoredb-ce-qui-est-collecte

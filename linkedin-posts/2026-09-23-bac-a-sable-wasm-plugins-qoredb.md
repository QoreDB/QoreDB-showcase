# Post LinkedIn

Faire tourner du code tiers dans un client de base de données, c'est accepter qu'un module inconnu s'exécute à côté de credentials de production.

Dans QoreDB, j'ai choisi de le faire avec un interpréteur WebAssembly en Rust pur, sans JIT. Les hooks manipulent une chaîne de requête, pas du calcul lourd : la prévisibilité vaut plus que la vitesse brute.

Trois principes structurent le bac à sable.

Tout est refusé par défaut. Les sept capabilities (log, notification, stockage, lecture de résultat, HTTP, fichiers, secrets) sont demandées dans le manifeste et accordées une par une par l'utilisateur. La vérification a lieu à l'appel, donc révoquer coupe immédiatement, sans redémarrage.

Chaque invocation est bornée. Un Store neuf, 50 M d'unités de fuel, 16 Mio de mémoire, 500 ms sur le chemin critique de la requête. Trois échecs consécutifs et le plugin est déchargé.

Un plugin qui échoue ne bloque rien. Seule une décision explicite de blocage arrête une requête, et l'utilisateur voit lequel et pourquoi.

#QoreDB #OpenSource #WebAssembly #Rust #Security #Plugins

---

# Commentaire

Le détail technique complet est dans l'article : capabilities, budgets fuel, allowlist HTTP, vérification d'intégrité sha256 du module.

https://www.qoredb.com/fr/blog/bac-a-sable-wasm-plugins-qoredb

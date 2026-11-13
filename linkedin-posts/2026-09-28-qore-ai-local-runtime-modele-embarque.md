# Post LinkedIn

Le Database Agent de QoreDB avait un angle mort : pour raisonner sur une base, il fallait un provider cloud. Donc le schéma, les noms de tables et des extraits de requêtes partaient chez un tiers. Dans un client local-first, c'était le seul endroit où quelque chose quittait la machine.

J'ai donc embarqué le runtime. QoreDB gère llama-server de bout en bout : détection de la cible parmi six couples OS/architecture, téléchargement des artefacts, démarrage à la demande, health check, arrêt.

Trois décisions structurent l'implémentation.

Le frontend ne fournit jamais d'URL. Le backend lit un manifest curé et embarqué qui épingle, pour chaque artefact, une URL HTTPS, une taille et un SHA-256. Les mises à jour arrivent par un catalogue distant signé Minisign, vérifié avec la même racine de confiance que l'auto-updater, et vérifié avant toute désérialisation.

Le téléchargement est reprenable par HTTP Range, vérifié avant extraction, puis mis en place par renommage atomique avec rollback. Une coupure ne remplace jamais un artefact déjà validé.

Le runtime est compilé par le projet, deux fois par cible, sans cache, et les deux archives doivent avoir le même SHA-256. Un écart bloque la publication de toute la matrice.

À l'usage : port réservé dynamiquement sur 127.0.0.1, serveur lancé avec une fenêtre de 32768 tokens, API OpenAI-compatible pour le tool calling. Et surtout, aucun passe-droit : lecture auto, écriture confirmée en dev/staging, mutation bloquée en production, audit et rate limiting identiques.

#QoreDB #OpenSource #Rust #LocalFirst #LLM #SupplyChainSecurity

---

# Commentaire

J'ai détaillé le manifest signé, la reprise de téléchargement et les builds reproductibles dans l'article complet.

https://www.qoredb.com/fr/blog/qore-ai-local-runtime-modele-embarque

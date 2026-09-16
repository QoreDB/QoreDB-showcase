# Périmètre — audit du 16 septembre 2026

Demande : analyser QoreDB-showcase et proposer un plan d’implémentation pour une direction artistique plus affirmée, professionnelle, moderne et minimaliste, avec une meilleure fluidité.

- Repo : `/home/raphael/dev/perso/QoreDB-showcase` ; état Git initial propre.
- Surfaces : accueil en priorité, puis téléchargement, tarifs, fonctionnalités, documentation et blog pour la cohérence du système. Desktop et mobile, clair et sombre, français et anglais ; sept locales à préserver.
- Hypothèse de cible : développeurs produit, indépendants et petites équipes qui évaluent un client desktop SQL/NoSQL local-first. Tâche principale : comprendre sa valeur, vérifier la compatibilité, télécharger. Tâche secondaire : évaluer les offres professionnelles.
- Contraintes : préserver l’identité QoreDB, Next.js/React/Tailwind, les routes et les parcours existants. Aucun changement de produit ou de tarifs prévu. Le site se déclare propriétaire dans README.md : ne pas appliquer automatiquement les licences du repo applicatif.
- Références internes : doc/DESIGN_SYSTEM.md et doc/VISUAL_FOUNDATION.md, à confronter au code ; doc/PROJECT.md est une vision historique, pas une preuve des capacités livrées.
- Livrables : audit sourcé, captures et mesures si l’exécution locale est possible, direction recommandée et plan progressif avec critères d’acceptation. Pas d’implémentation du site durant cette demande.
- Instructions : aucun AGENTS.md spécifique trouvé dans le repo vitrine ni ses ancêtres consultés ; RTK.md finalement retrouvé et lu dans `/home/raphael/.claude/RTK.md` ; exécutable rtk absent. Utiliser les consignes fournies, pnpm et des recherches ciblées. Le script pnpm typecheck a ensuite été bloqué par sa tentative de réinstallation ; compilation directe réussie sans modifier les dépendances.

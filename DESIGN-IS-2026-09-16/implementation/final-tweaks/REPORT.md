# Derniers ajustements — 16 septembre 2026

- Hero et bandeau réunis dans un premier écran complet ; la section suivante commence ensuite. Sur petit écran, la hauteur naturelle est préservée.
- Cinq logos en défilement CSS doux (38 s), bords estompés, pause explicite, pause au survol/focus et arrêt hors écran. Liste statique en réduction du mouvement, consultable sans JavaScript.
- Fils d’Ariane : index réel lorsqu’il existe, sinon premier article de la rubrique selon l’ordre documentaire. Langue conservée, destinations identiques dans le JSON-LD, aucune URL fictive pour une rubrique vide.
- Téléchargement Windows : Store, EXE et MSI. URL issues du manifeste de publication, formats absents indiqués comme indisponibles. Vérification réelle des deux URL de la version 0.1.39, sans télécharger/exécuter les installateurs.

Validation : TypeScript, Biome (14 fichiers), 5 tests unitaires, builds Next et Pagefind réussis. [36 scénarios navigateur](report.json) réussis, puis [10 reprises ciblées](final-build/report.json) réussies après les deux dernières retouches visuelles. Aucun scénario ignoré.

[Aperçu de la hero](final-build/hero-light-1440.png), [bandeau mobile](final-build/drivers-dark-390.png), [formats Windows](final-build/windows-fr.png), [mesures de géométrie et URL](final-build/visual.json). CLS observé nul sur quatre vues locales ; LCP et poids JavaScript non remesurés.

Aperçu final disponible sur http://127.0.0.1:3101/fr et http://127.0.0.1:3101/fr/download. Le serveur de développement existant sur 3000 n’a pas été arrêté. Aucun commit, push ou déploiement effectué.

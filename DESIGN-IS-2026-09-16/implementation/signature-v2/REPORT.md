# QoreDB showcase — raffinement de signature

Livré le 16 septembre 2026 sur `codex/showcase-precision`. Aperçu local de production : http://127.0.0.1:3101/fr. Aucun déploiement, commit ni push effectué dans cette passe.

## Résultat

- Hero enrichie : emblème inspiré du cube QoreDB, connexions orthogonales statiques, coins violets et nouvelle capture SQL cadrée pour garder les résultats visibles sur mobile. La composition de la première passe est conservée.
- Cinq logos couleur rétablis : PostgreSQL, MySQL, MongoDB, Redis et SQLite. Noms visibles et images décoratives pour éviter la répétition vocale.
- Deux nouvelles captures réelles : requête et exploration de table. Sources WebP 1280×800 de 44 944 et 46 994 octets ; dérivés responsives produits par le générateur existant.
- Démonstration muette de 22,72 secondes après la première preuve, fichier MP4 de 291 908 octets (285 Kio), lecture volontaire, contrôles natifs, erreur/réessai et déroulé traduit dans les sept langues. Aucune source vidéo n’est attachée avant activation.

La [provenance reproductible](../../../scripts/showcase-media/README.md) et le [relevé de capture](../../../scripts/showcase-media/capture-provenance.json) documentent QoreDB 0.1.39, le frontend React inchangé et le vrai moteur SQLite via HTTP. Base synthétique isolée « Atelier / demo » ; un SELECT exécuté, un UPDATE seulement rédigé. Ce tournage n’est pas une démonstration de Sandbox Pro. Les captures historiques Sandbox et garde-fous sont conservées, sans leur attribuer une nouvelle version. Aucun fichier source de l’application QoreDB adjacente n’a été modifié.

## Performance mesurée

Même protocole local que la première passe : production Chrome 152, contexte neuf et cache désactivé ; mobile 390×844 DPR1, CPU ×4, latence 150 ms, débit descendant 200 000 octets/s, observation jusqu’à `load + 3 s`, ressources externes bloquées. Trois échantillons ralentis, serveur local préchauffé.

| Mesure | Première passe | Raffinement | Évolution |
| --- | ---: | ---: | ---: |
| JS initial de la route, compressé | 279 729 o | 280 830 o | +1 101 o (+0,4 %) |
| JS au démarrage desktop, compressé | 336 107 o | 337 284 o | +0,4 % |
| JS au démarrage mobile, compressé | 299 688 o | 300 827 o | +0,4 % |
| Ressources au démarrage desktop, compressées, hors HTML | 722 193 o | 629 539 o | −12,8 % |
| Ressources au démarrage mobile, compressées, hors HTML | 629 123 o | 529 474 o | −15,8 % |
| LCP mobile simulé médian | 2 132 ms | 1 284 ms | −39,8 % |
| Logos initialement chargés, DPR1 | 0 o | 4 754 o | 5 logos |
| CLS observé | 0 | 0 | Stable |

LCP mobile : 1 284 / 1 284 / 1 272 ms. La capture est l’élément LCP. Les cinq observations comptent **zéro requête vidéo avant clic**, aucune exception navigateur et aucune animation infinie. Six ressources supplémentaires au démarrage (61 desktop / 40 mobile), avec un poids total inférieur grâce aux nouvelles images.

Par rapport à l’audit initial avant toute refonte : JS initial −19,9 %, démarrage desktop −32,5 %. Le LCP médian initial était 1 264 ms ; le raffinement revient à +1,6 %, dans le budget de non-régression de 10 % de ce protocole. Le budget de 300 Kio de JS initial est respecté ; la cible ambitieuse de 250 Kio ne l’est pas (274,2 Kio). Ces trois mesures locales ne constituent pas une mesure terrain ni une garantie sur tous les appareils.

[Mesures brutes](production/performance.json), [script de mesure](../measure-signature.cjs), [bilan historique de la première passe](../REPORT.md). Les anciennes preuves sont conservées.

## Vérifications

- TypeScript normal : `pnpm --config.verify-deps-before-run=false run typecheck`, réussi.
- Images : `build:images`, 12 nouveaux dérivés et 105 sources au manifeste.
- Production : `build:next` puis `build:search`, réussis.
- Biome ciblé sur les 13 fichiers TSX/JSON de cette passe : réussi. Les six diagnostics historiques hors périmètre de la première passe ne sont pas présentés comme corrigés.
- `node --check scripts/smoke-showcase.mjs` : syntaxe valide.
- Smoke indépendant : **23/23 réussites, zéro échec, zéro scénario ignoré**. Sept langues, largeurs 320 à 1920 px, thèmes clair/sombre, absence de JS, réduction du mouvement, préférences et trois parcours vidéo. Les contrôles vidéo vérifient la vraie lecture MP4, le focus, pause/reprise au clavier, la fin sans boucle, l’erreur 503 puis le réessai, et le lien/transcript sans JS.
- Quatre vues de production inspectées par l’agent principal (390/1440 px, clair/sombre), avec capture complète puis lecteur avant/après activation : aucune image cassée, exception navigateur ou largeur débordante.
- Contrôle complémentaire du designer en développement : 84 configurations (sept langues × deux thèmes × six largeurs), sans débordement. Les interactions ont été validées sur production : le serveur de développement existant avait une hydratation incomplète et n’a pas servi de preuve de lecture.

[Rapport smoke](verification/smoke/report.json), [revue indépendante](verification/INDEPENDENT_REVIEW.md), [relevé visuel](production/visual-review.json), [matrice de développement](../refinement/layout-dev.json). Les 52 scénarios de la première passe restent une preuve historique ; les parcours inchangés de paiement et documentation n’ont pas été rejoués intégralement ici.

## Aperçus

- [Hero desktop claire](production/home-light-1440.png) et [sombre](production/home-dark-1440.png).
- [Hero mobile claire](production/home-light-390.png) et [sombre](production/home-dark-390.png).
- [Accueil complet desktop](production/home-light-1440-full.png) et [mobile](production/home-dark-390-full.png).
- [Vidéo avant lecture](production/home-light-1440-demo-poster.png) et [pendant la lecture](production/home-light-1440-demo-playing.png).

Limites : tests Chrome Linux automatisés, sans Safari/iOS physique, lecteur d’écran ni étude utilisateur. Les médias représentent le frontend partagé avec le desktop ; les IPC Tauri ne sont pas couverts par ce tournage. Le code et la documentation nécessaires à cette passe sont livrés ; aucun parcours commercial réel n’a été déclenché.

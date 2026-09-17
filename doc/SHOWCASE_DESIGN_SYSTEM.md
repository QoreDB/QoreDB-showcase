# QoreDB — déclinaison marketing : instrument de précision

Référence du 16 septembre 2026, issue du plan approuvé. Complète [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) et [VISUAL_FOUNDATION.md](VISUAL_FOUNDATION.md), sans modifier le système de l’application.

## Intention et référence vérifiable

La qualité vient de la composition : grand titre droit, asymétrie 5/7, image réelle cadrée pour une tâche, filets précis, légendes courtes, accent violet ponctuel. Le caractère « fait main » repose sur les alignements, les césures, le rythme et le choix des détails montrés. Le produit reste l’objet principal.

[Prototype HTML](../DESIGN-IS-2026-09-16/implementation/reference.html) et [CSS de référence](../DESIGN-IS-2026-09-16/implementation/reference.css) : hero et première preuve, variantes clair/sombre via `?theme=light` ou `?theme=dark`, largeur mobile et desktop. Les polices locales sont figées dans le dossier du prototype pour que celui-ci ne dépende pas des hashes d’un prochain build. En production, conserver les imports `next/font` existants. Le prototype est une référence visuelle autonome ; sa navigation réduite et son sélecteur de thème ne remplacent pas les composants accessibles et traduits du site.

## Tokens de couleur

Les noms courts du prototype correspondent aux rôles `--q-*` existants en production. Une couleur par rôle, pas de duplication de palette dans les composants.

| Rôle | Token production | Clair | Sombre |
| --- | --- | --- | --- |
| Fond | `--q-bg-0` | `#FAFAF9` | `#0E1014` |
| Panneau | `--q-bg-1` | `#F0F1F3` | `#17191F` |
| Surface renforcée | `--q-bg-2` | `#E7E9ED` | `#20232B` |
| Texte principal | `--q-text-0` | `#15161B` | `#F3F4F7` |
| Texte secondaire et métadonnées utiles | `--q-text-1` / `--q-text-2` | `#5B6070` | `#A3A8B5` |
| Filet | `--q-border` | `#DADDE3` | `#30343E` |
| Accent texte, focus, repère | `--q-accent` | `#5847EB` | `#AA9FFF` |
| Fond d’action primaire | `--q-action` | `#5847EB` | `#6553DF` |
| Texte sur action primaire | `--q-on-action` | `#FFFFFF` | `#FFFFFF` |

`--q-accent-strong` reste un accent de texte (`#4836D0` / `#B8AFFF`) pour les pages existantes ; `--q-action-hover` vaut `#4836D0` / `#5847CB`. Les alias shadcn `--primary` et `--primary-foreground` pointent sur l’action et son texte. Les boutons neutres utilisent les surfaces, pas un violet plein.

Ne pas employer l’accent texte sombre comme fond d’un bouton à texte blanc. Les filets sont structurels, pas un substitut au contraste des contrôles. Les états danger/avertissement/succès gardent leur sens produit ; ils ne deviennent pas des accents décoratifs.

## Grille, rythme, typo

- Largeur utile maximale : 1320 px ; gouttières 48 px desktop, 32 px intermédiaire, 24 px mobile, 18 px à 320 px. À 1440 px, la largeur maximale donne 60 px de marge effective.
- Header : 96 px desktop, 72 px mobile. Filet inférieur continu aligné sur le contenu.
- Hero : grille 5fr/7fr, écart 32 px. Haut 80 px, bas 68 px ; mobile empilé avec haut 36 px, écart 30 px, bas 32 px. Seuil d’empilement du prototype : 760 px ; la production peut empiler plus tôt si une traduction l’exige.
- Titres : Space Grotesk, poids 600, H1 `clamp(48px, 5.3vw, 76px)`, interligne 1.04, approche de −3 à −4.6 px selon taille. Mobile 54 px / 1.02, 47 px sous 350 px. Ces césures sont éditoriales en FR ; adapter par langue, sans imposer trois lignes à toutes.
- H2 : 44 px / 1.12, poids 550, approche −2 px ; mobile 38 px. Paragraphes : Inter 17 px / 1.75 hero, 15–16 px sections ; mobile 14–16 px.
- Légendes et repères : 12 px desktop ; 11–12 px pour les très courts repères mobile. Les contrôles et informations importantes ne descendent pas à cette taille. Aucun tracking excessif sur des phrases.
- Échelle d’espacement : 4, 8, 12, 16, 24, 32, 48, 64, 96. Des ajustements optiques de composition sont admis dans le hero, pas une multiplication de variantes utilitaires.
- Actions : hauteur minimale 44 px (hero 49 px desktop / 46 px mobile), rayon 6 px ; focus extérieur 2 px, offset 5 px. Panneaux images 8 px, sous-panneaux 6 px. Une action primaire pleine, l’autre en lien texte.
- Filets : 1 px. Ombre image seulement, `0 24px 48px -32px #0006`. Les captures sont à plat et ne changent pas d’échelle au survol.

## Composition des preuves et sources

La séquence finale doit distinguer trois tâches. Chaque module a un numéro, un titre orienté travail, une capture et une légende qui expose le résultat. Éviter de répéter trois fois le même gabarit : première preuve large, deuxième détail du diff, troisième contexte et avertissement.

| Tâche | Action et résultat | Source existante | Niveau | Cadrage et alternative textuelle |
| --- | --- | --- | --- | --- |
| Hero : requête et résultats | Écrire une requête ; lire les résultats et le contexte de connexion | `public/images/showcase-v2/query-workspace.webp`, 1280×800 | Core pour l’éditeur et la grille montrés | Image cadrée : largeur CSS 1000 px desktop, 700 px mobile. Alt : éditeur SQL, résultats et connexion SQLite de démonstration. |
| Explorer et interroger | Parcourir une table ; lire ses colonnes et son contexte | `public/images/showcase-v2/table-workspace.webp`, 1280×800 | Core | Capture distincte du hero, largeur CSS 900 px desktop / 760 px mobile ; arborescence visible sur desktop et grille cadrée sur mobile. Alternative décrivant les projets et leurs colonnes. |
| Préparer une modification | Modifier localement ; inspecter les opérations en attente avant de générer le SQL | `public/images/features/sandbox.webp`, 2000×1310 | Pro | Conserver table et panneau des changements ; mobile : cadrer le panneau droit. Alt : « Bac à sable QoreDB avec cellules modifiées et panneau des opérations en attente. » |
| Travailler avec des garde-fous | Identifier une suppression de base en production ; consulter l’avertissement avant de confirmer | `public/images/features/query-safety.webp`, 2000×1310 | Core pour les protections intégrées ; règles personnalisées Pro | Conserver texte d’avertissement et décision visible. Alt : « Confirmation QoreDB avant suppression d’une base, avec avertissement de production et choix Annuler ou Continuer. » |

Les deux captures principales proviennent maintenant de QoreDB 0.1.39 : interface React inchangée, transport HTTP et vrai moteur SQLite, base synthétique isolée « Atelier / demo ». Le navigateur utilise le frontend partagé avec le desktop ; il ne valide pas les IPC Tauri. La [provenance et les commandes de reproduction](../scripts/showcase-media/README.md) distinguent la requête SELECT exécutée du brouillon UPDATE jamais exécuté.

Les images Sandbox et garde-fous restent les assets historiques du repo. Leur version et leur provenance de données ne sont pas certifiées ; ne pas leur attribuer la version courante. Le prototype HTML conserve les images de la première passe et reste une référence de composition historique.

Le prototype réemploie la source entière derrière un masque CSS pour garder la référence réversible. La production utilise une seule image responsive par figure et des dérivés générés. Le générateur conserve désormais l’extension source dans les noms de sorties pour éviter les collisions entre couples PNG/WebP de même nom ; des tests couvrent aussi les dimensions et l’idempotence. Ne pas retoucher le manifeste manuellement.

## Contrats éditoriaux et commerciaux

Vérification dans le code applicatif adjacent `QoreDB/src/lib/license.ts`, table `FEATURE_REQUIRED_TIER`, le 16 septembre 2026 : `er_diagram` vaut `core` ; `sandbox`, `visual_diff`, `ai`, `custom_safety_rules`, `column_masking` valent `pro`. Un badge Pro global dans une capture n’implique pas que toutes les actions visibles nécessitent Pro. Les preuves Core doivent nommer précisément la capacité montrée.

- Core gratuit et Apache-2.0 ; extensions Premium distinctes, licence BUSL-1.1. Ne pas qualifier l’ensemble de l’application d’Apache.
- Local-first décrit le fonctionnement principal ; l’IA optionnelle peut impliquer un fournisseur externe. Éviter « aucune donnée ne quitte jamais votre ordinateur ».
- Employer « moteurs et services » pour les compatibilités ; ne pas faire passer des services compatibles pour 34 implémentations indépendantes. Le bandeau privilégie PostgreSQL, MySQL, MongoDB, Redis et SQLite, puis mène au catalogue.
- Tarifs, checkout, Team et disponibilité conservent leurs sources actuelles. Le prototype ne crée aucun prix.
- Pas de témoignage ni chiffre d’adoption sans provenance datée. Tous les nouveaux contenus de production passent dans les sept fichiers de traduction.
- Conserver les ancres `#features`, `#preview`, `#mcp` lors de l’intégration.

## Mouvement et performance

Aucune animation décorative permanente ; aucun contenu caché en attente d’hydratation. Défilement natif. Transitions d’action 150 ms ; `prefers-reduced-motion` les supprime. Les sections éditoriales sont rendues serveur, les interactions restent des îlots client. Image du hero seule prioritaire ; images suivantes différées avec dimensions réservées.

Budgets de recette du plan maintenus : JS initial de route ≤300 Kio, JS démarrage desktop réduit d’au moins 25 %, logos initiaux ≤40 Kio, aucune régression de LCP médian >10 % au protocole local initial. Le prototype n’est pas une mesure de production et ne valide aucun de ces budgets.

## Contrôles de la référence

Captures Chrome en 1440×900 et 390×844, clair et sombre, dans `DESIGN-IS-2026-09-16/implementation/`. Vérifier absence de débordement horizontal, présence de la capture avant le pli mobile, polices chargées et lisibilité des détails au format natif. La composition doit ensuite être vérifiée sur les composants réels, toutes les langues et les contrôles accessibles.

La revue de compréhension avec 3–5 utilisateurs cibles et le test sur téléphone physique restent à organiser ; aucune préférence utilisateur n’est prétendue mesurée.


## Intégration des fondations

Le header de production garde une position fixe, hauteur 96 px à partir de 1024 px et 72 px en dessous ; les pages existantes conservent leur décalage de contenu. La navigation regroupe Produit, Docs, Tarifs et Ressources ; le menu mobile reste une divulgation non modale avec `aria-expanded`, fermeture Échap, retour du focus au déclencheur et défilement interne pour les petites hauteurs. Le menu Ressources natif fonctionne sans JavaScript. La bascule de thème utilise `resolvedTheme`, ce qui respecte la préférence système initiale ; le changement de langue conserve recherche et ancre URL.

Le lien d’évitement unique cible `#main-content` (élément focalisable `tabIndex=-1`). Les templates publics ont reçu cette cible ; les parcours remaniés placent leur header et leur footer hors du contenu principal. La liste des modifications mécaniques est conservée dans `implementation/skip-link-targets.json`.

Footer : liens de plugins corrigés vers `/plugins`, préchargement Next désactivé sur les groupes longs, abonnement mort retiré, lien e-mail natif, mention Core/Premium traduite dans les sept langues. Les pages newsletter et les parcours commerciaux restent accessibles.

## Recette de l’implémentation

La déclinaison est implémentée et vérifiée dans les sept langues. Les captures et mesures finales sont dans le [bilan de livraison](../DESIGN-IS-2026-09-16/implementation/REPORT.md). Les budgets de JavaScript, de logos et d’animations sont respectés ; le budget de non-régression LCP ne l’est pas, écart expliqué et chiffré dans ce bilan. La cible ambitieuse de 250 Kio de JavaScript initial n’est pas atteinte.


## Raffinement de signature et démonstration

La seconde passe conserve la grille et ajoute un emblème linéaire inspiré du cube QoreDB, des tracés orthogonaux derrière la capture et des coins de repérage violets. Ces détails restent statiques. Les cinq logos de moteurs retrouvent leur couleur et un nom adjacent ; les images sont décoratives pour les lecteurs d’écran.

Une vidéo muette de 22,72 secondes (libellé 00:23) suit la première preuve. Poster responsive, dimensions réservées 1280×800, aucun `src` vidéo avant activation, aucun autoplay ni boucle. L’îlot client gère lecture, erreur et réessai ; les contrôles restent natifs. Un lien direct fonctionne sans JavaScript et une transcription en sept langues décrit les actions. La vidéo montre le parcours Core et un brouillon SQL, sans prétendre démontrer Sandbox Pro.

Voir le [bilan du raffinement](../DESIGN-IS-2026-09-16/implementation/signature-v2/REPORT.md) pour les mesures de ce nouvel état. Le bilan précédent reste la preuve de la première passe.


## Ajustement éditorial après retour utilisateur

Les formules générales qui n’aident pas à comprendre le produit sont retirées ou remplacées par une action concrète. La maxime d’introduction des fonctionnalités et la seconde ligne de légende de la hero sont supprimées. Le titre de section reste disponible pour les technologies d’assistance sous le libellé « Fonctionnalités ». Les titres exploration, offres et téléchargement deviennent directs, dans les sept langues. La composition et les détails de signature visuelle sont conservés.


## Premier écran, moteurs et navigation documentaire

À la demande de l’utilisateur, la hero et le bandeau des cinq moteurs constituent désormais un seul premier écran, avec une hauteur minimale égale à la hauteur stable du viewport moins le header. La section des fonctionnalités commence ensuite. Sur mobile ou petite hauteur, le contenu conserve sa hauteur naturelle et peut dépasser le premier écran.

Le bandeau est l’unique exception à la règle initiale d’absence de boucle décorative : translation CSS linéaire sur 38 secondes, bords estompés, arrêt hors écran via IntersectionObserver, pause au survol et au focus, commande de pause/reprise traduite. En réduction du mouvement, tous les noms sont présentés sur une liste statique qui revient à la ligne. Sans JavaScript, la liste reste consultable par défilement horizontal. Aucun nouvel asset ni bibliothèque d’animation n’est ajouté. Les copies nécessaires à la boucle sont masquées aux technologies d’assistance.

Le fil d’Ariane documentaire pointe vers l’index de rubrique lorsqu’il existe, sinon vers son premier article selon l’ordre de navigation. Une rubrique vide reste un libellé sans lien ; aucune URL de dossier inexistant n’est fabriquée. Les liens conservent la langue demandée, et le JSON-LD utilise les mêmes destinations.

Téléchargement Windows : Microsoft Store, installeur EXE et MSI. Les URL des installeurs viennent des entrées `windows-x86_64-nsis` et `windows-x86_64-msi` du manifeste de publication ; un format absent reste indiqué comme indisponible.

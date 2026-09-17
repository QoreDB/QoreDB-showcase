# Showcase browser verification

Start the application first. Do not run production smoke tests while replacing `.next` with a build. Use the existing pnpm scripts with `--config.verify-deps-before-run=false` on installations where pnpm11 otherwise tries to reinstall dependencies before every command.

```bash
SHOWCASE_BASE_URL=http://127.0.0.1:3102 \
SHOWCASE_OUTPUT=/tmp/qore-showcase-smoke \
node scripts/smoke-showcase.mjs
```

Default URL is development port3102. Set3101 for a production server started on that port. `PUPPETEER_EXECUTABLE_PATH` overrides `/usr/bin/google-chrome-stable`. `SHOWCASE_TIMEOUT` sets individual waits in milliseconds (default15000). `SHOWCASE_SCENARIOS='docs|download'` filters scenario names with a regular expression. The browser is launched headlessly; no dependency is installed by this script.

The harness writes `report.json` and one viewport screenshot per scenario. It continues after individual assertion failures and exits nonzero if any scenario fails. A skipped test is reported separately and never counted as passed. Uncaught browser exceptions and unexpected console errors fail their scenario. Deliberately failed fixture requests and blocked third-party resources are excluded from console-error assertions; the latter therefore require a separate public-site smoke test.

Coverage: all seven home locales, legacy anchors, one main/h1, actual download links, missing translations, no-JS content, reduced motion, image visibility, no horizontal overflow at six widths and both themes, mobile menu/Escape, theme persistence, locale preserving page, FR/EN header/footer destinations. Documentation scenarios use a synthetic Pagefind module to exercise result/empty/loading/focus/close/error/retry and a real index when present. Download scenarios use synthetic release metadata for Windows, macOS Intel/ARM, Linux, unknown platforms, formats, missing AppImage and API failure/retry. Checkout scenarios intercept the POST before any server-side payment code and verify payload, waiting label/disabled state, success navigation and error recovery.

Every browser request other than GET/HEAD/OPTIONS is blocked unless explicitly mocked by its scenario. No real checkout, email, newsletter, or submission POST is allowed. External browser resources are blocked. Synthetic download and checkout destinations remain local and do not fetch installers or create payment sessions. Server-rendered price/content reads remain governed by the server's configuration.

Team availability is a server-rendered prop supplied by Stripe. The harness calls `scripts/pricing-ssr-fixture.mjs` to render the real pricing components with both a synthetic Team price and `null`. These fixtures verify the available-plan link, unavailable-plan waitlist, persistent Enterprise form, Pro supplied/fallback price, annual per-seat wording, and the Team annual total at its minimum seat count. Only the site shell and waitlist server mutation are stubbed; network access is forbidden. They do not exercise a real Stripe configuration, Team checkout, or a paid Team account. The fixtures can also run independently:

```bash
node scripts/pricing-ssr-fixture.mjs
```

Additional browser checks cover canonical URLs, seven language alternates and parseable JSON-LD on the FR/EN home pages; internal home proof and navigation destinations; the sitemap and legacy quick-start redirect; and mobile overflow/landmarks on FAQ, changelog, newsletter, legal, privacy, terms, OSS and unauthenticated Team pages. No form on those secondary pages is submitted. Actual Pagefind checks are skipped if no served index exists; run `build:search` after `build:next` for production verification. This harness is not a Web Vitals benchmark, contrast audit, screen-reader test, physical-phone test, or user study.

The first script validation is syntax-only. Integration acceptance must be reported from an actual `report.json` after all implementation owners finish; no scenario is predeclared passed based on source inspection.

## Validation du 16 septembre 2026

Vérification indépendante du code et des parcours de production sur `http://127.0.0.1:3101`, Chrome 152 via `/usr/bin/google-chrome-stable`.

**52 scénarios distincts validés, aucun ignoré**, dans le [rapport consolidé](../DESIGN-IS-2026-09-16/implementation/verification/report.json). Le premier passage complet donne 49 réussites et trois diagnostics ; leurs reprises ciblées donnent 3/3 après correction du harnais, sur le second build de production. Les rapports et captures des deux passages sont conservés, sans présenter cette consolidation comme un second passage complet.

```bash
SHOWCASE_BASE_URL=http://127.0.0.1:3101 \
SHOWCASE_OUTPUT=/tmp/qore-showcase-final-smoke \
node scripts/smoke-showcase.mjs

SHOWCASE_BASE_URL=http://127.0.0.1:3101 \
SHOWCASE_OUTPUT=/tmp/qore-showcase-final-recheck \
SHOWCASE_SCENARIOS='preferences-route|docs-real-index|secondary-changelog' \
node scripts/smoke-showcase.mjs
```

Les reprises corrigent trois conditions de vérification : attendre le document puis contrôler explicitement thème et changement de langue, au lieu d’attendre l’inactivité de toutes les prélectures réseau ; intercepter directement par CDP le vrai worker Pagefind, car le gestionnaire d’interception Puppeteer le bloquait ; distinguer la hiérarchie Markdown préexistante du changelog de ses critères de non-régression. La preuve Pagefind consigne les requêtes GET effectivement interceptées, notamment worker, WASM, index et fragments. Les requêtes de mutation restent bloquées et le moteur de recherche n’est ni remplacé ni forcé sans worker.

| Vérification | Commande ou preuve | Résultat |
| --- | --- | --- |
| TypeScript, commande normale | `git check-ignore tsconfig.tsbuildinfo`, suppression ciblée de ce seul cache ignoré, puis `pnpm --config.verify-deps-before-run=false run typecheck` | Réussite. Le cache incrémental ancien produisait des diagnostics Framer Motion absents après reconstruction. |
| Variantes d’images | `pnpm --config.verify-deps-before-run=false exec tsx --test scripts/image-variants.test.ts` | 3/3 : pixels et ratios des PNG/WebP homonymes, tailles des icônes sans agrandissement, manifeste vide et URL du loader préservées. |
| Branches commerciales SSR | `node scripts/pricing-ssr-fixture.mjs` | 3/3 : Team disponible/attente, prix Pro fourni/secours, total Team annuel à trois sièges. Prix entièrement synthétiques. |
| Biome sur fichiers suivis modifiés | `git diff --name-only --diff-filter=ACM -z \| xargs -0 pnpm --config.verify-deps-before-run=false exec biome check --diagnostic-level=error --max-diagnostics=100` | 60 fichiers analysés ; 6 erreurs préexistantes `noDangerouslySetInnerHtml` sur FAQ, legal, privacy, quick-start et terms. Aucun nouveau diagnostic après formatage ciblé. Ce contrôle global n’est donc pas déclaré vert. |
| Biome sur nouveaux modules d’images | `pnpm --config.verify-deps-before-run=false exec biome check scripts/image-variants.ts scripts/image-variants.test.ts --diagnostic-level=error` | Réussite, 2 fichiers. |
| Scripts de vérification | `node --check scripts/smoke-showcase.mjs` et `node --check scripts/pricing-ssr-fixture.mjs` | Syntaxe valide. Les `.mjs` sont exclus par la configuration Biome du repo ; leur formatage a utilisé une configuration temporaire, sans désactiver de règle du projet. |
| Cohérence des traductions | Comparaison des clés EN aux six autres locales pour `home`, `docs`, `nav`, `a11y`, `download`, `pricing_page` | Toutes les clés de référence sont présentes ; les sept pages d’accueil sont aussi contrôlées dans le navigateur. Ce contrôle ne certifie pas la qualité linguistique native. |
| Espaces et conflits de patch | `git diff --check` | Réussite. |

La revue source confirme que l’accueil est composé de sections rendues côté serveur, que le fournisseur de métadonnées de téléchargement est limité à ce parcours, et que les figures utilisent des captures existantes avec libellés Core/Pro précis. Le dialogue de recherche gère la fermeture, le retour du focus, les erreurs et les réponses devenues obsolètes ; ses extraits proviennent de l’index Pagefind local. Les flux de checkout gardent leurs modèles existants, paiement unique Pro et abonnement annuel Team par siège.

Les 28 vues de production de l’accueil, du téléchargement, des tarifs, de la documentation, des fonctionnalités, des plugins et du blog (390/1440 px, clair/sombre) ont été contrôlées par l’agent principal : zéro débordement horizontal et zéro exception navigateur. Voir [les mesures visuelles](../DESIGN-IS-2026-09-16/implementation/production/visual-review.json). Un passage distinct du blog et d’un article long autorise les images Sanity en lecture seule : quatre vues sans image cassée ni exception, [preuve CDN](../DESIGN-IS-2026-09-16/implementation/production/blog-cdn-review.json).

Limites conservées : les titres Markdown de certaines notes de version introduisent plusieurs `h1` sur le changelog ; le composant `components/changelog/release-card.tsx` est inchangé par rapport à HEAD. Le smoke vérifie les repères et l’absence de débordement de cette page, sans certifier sa hiérarchie éditoriale. Les tests ne réalisent aucun paiement, envoi de formulaire ni installation, et ne valident pas un compte Team authentifié. Les métriques terrain, technologies d’assistance et appareils physiques nécessitent une vérification séparée.

### Dernier build et mesures finales

Après le retrait de Framer Motion de la confirmation de `NewsletterCard` (formulaire et action serveur conservés), troisième build et index Pagefind réussis. Reprise ciblée `home-fr|docs-real-index` : **2/2 réussites**, [rapport du build 3](../DESIGN-IS-2026-09-16/implementation/verification/build-3/report.json). La commande normale `pnpm --config.verify-deps-before-run=false run typecheck` réussit sur cet état final.

Les mesures finales, leurs limites et les captures sont réunies dans le [bilan d’implémentation](../DESIGN-IS-2026-09-16/implementation/REPORT.md). Le JS initial baisse de 20,3 % et celui du démarrage desktop de 32,8 %. Le budget LCP de non-régression reste non atteint : médiane mobile simulée 2,132 s contre 1,264 s ; le nouvel élément LCP est la capture visible dès le premier écran. Ce résultat n’est pas assimilé à une mesure terrain.


### Raffinement : signature, captures et vidéo

Le [bilan de la seconde passe](../DESIGN-IS-2026-09-16/implementation/signature-v2/REPORT.md) conserve les nouvelles preuves séparément. Build de production et index Pagefind réussis ; TypeScript normal et Biome ciblé (13 fichiers) réussis.

**23/23 scénarios ciblés passent, aucun ignoré**, sur le nouveau build : sept langues, responsive et thèmes, absence de JavaScript, réduction du mouvement, préférences, puis lecture vidéo au clavier, erreur/réessai et fallback sans JavaScript. Le fichier MP4 réel est utilisé, avec aucune requête vidéo avant activation. Les requêtes de mutation restent bloquées.

```bash
SHOWCASE_BASE_URL=http://127.0.0.1:3101 \
SHOWCASE_OUTPUT=DESIGN-IS-2026-09-16/implementation/signature-v2/verification/smoke \
SHOWCASE_SCENARIOS='home-|layout-|demo-|preferences-route' \
node scripts/smoke-showcase.mjs
```

[Rapport navigateur](../DESIGN-IS-2026-09-16/implementation/signature-v2/verification/smoke/report.json) et [revue indépendante](../DESIGN-IS-2026-09-16/implementation/signature-v2/verification/INDEPENDENT_REVIEW.md). Les 52 scénarios précédents ne sont pas présentés comme rejoués sur cette passe. Le contrôle final des interactions utilise la production, car le serveur de développement déjà ouvert présentait une hydratation incomplète.

LCP mobile local médian : **1,284 s**, contre 2,132 s après la première passe et 1,264 s dans l’audit initial. Ressources compressées au démarrage mobile : −15,8 % par rapport à la première passe ; JS initial +1 101 octets pour le lecteur. CLS observé nul. Les [mesures brutes et leur protocole](../DESIGN-IS-2026-09-16/implementation/signature-v2/production/performance.json) restent distincts des résultats terrain.


### Allègement éditorial

Après suppression des phrases décoratives et simplification des titres dans les sept langues : TypeScript, Biome ciblé (9 fichiers TSX/JSON), build Next et `git diff --check` réussis. Reprise ciblée des sept accueils et de deux formats extrêmes : **9/9 scénarios réussis**, aucun ignoré ; [rapport](../DESIGN-IS-2026-09-16/implementation/copy-refinement/report.json). La maxime est absente du texte rendu, le titre accessible « Fonctionnalités » est conservé visuellement masqué. [Capture de la section](../DESIGN-IS-2026-09-16/implementation/copy-refinement/features-fr.png). Les performances de la passe précédente n’ont pas été remesurées pour ce changement éditorial.


### Hero, défilement des moteurs, fil d’Ariane et formats Windows

Le premier build passe **36/36 scénarios ciblés** : accueils localisés, responsive, absence de JavaScript et réduction du mouvement, séparation du premier écran, commandes du bandeau et arrêt hors écran, clics des fils d’Ariane FR/EN, plateformes de téléchargement et formats manquants. [Rapport](../DESIGN-IS-2026-09-16/implementation/final-tweaks/report.json).

Après ajout du fondu aux extrémités du bandeau et retrait des extensions répétées dans les libellés Windows, second build puis index Pagefind réussis. **10/10 reprises ciblées** passent sur cet état : [rapport final](../DESIGN-IS-2026-09-16/implementation/final-tweaks/final-build/report.json). Ces reprises ne sont pas présentées comme une seconde exécution des 36 scénarios.

Tests de régression : `pnpm --config.verify-deps-before-run=false exec tsx --test lib/docs/breadcrumbs.test.ts`, **5/5 réussites** (Introduction FR/EN, destinations de toutes les rubriques, absence de lien inventé pour une rubrique vide). TypeScript normal, Biome ciblé sur 14 fichiers et `git diff --check` réussis.

Quatre vues d’accueil inspectées sur le dernier build (390/1440 px, clair/sombre) : aucun débordement ; section suivante à 900 px sur viewport desktop 900 px, à 1078 px sur mobile 844 px ; CLS observé nul pendant ce bref échantillon local. Le manifeste réellement servi fournit les deux installateurs Windows 0.1.39 et le Store apparaît à côté ; captures FR desktop/mobile conservées. [Relevé visuel et URL observées](../DESIGN-IS-2026-09-16/implementation/final-tweaks/final-build/visual.json). Aucun installateur n’a été exécuté. Les mesures LCP/JS historiques ne sont pas déclarées remesurées ici.

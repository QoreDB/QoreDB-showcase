# Audit sourcé — QoreDB Showcase

## Méthode et limites

Audit du code, des documents de marque et du rendu local de production sur `http://localhost:3101`, build existant daté du 16 septembre à 17:43. Captures à 1440×1000 et 390×844, DPR 1 ; accueil FR clair/sombre, EN desktop, pages téléchargement/tarifs/fonctionnalités/docs/blog. Documents et inventaire de chaînes examinés par agents spécialisés ; synthèse et jugement par l’agent principal.

Le build n’a pas été régénéré pendant l’audit ; les observations visuelles sont celles de cet artefact existant, confrontées aux sources. Requêtes externes du navigateur bloquées : analytics, badges et images Sanity ne sont pas inclus dans les mesures. Les images de blog absentes des captures sont une conséquence de ce protocole, pas un bug démontré. Les API locales peuvent utiliser leurs sources serveur existantes. Aucun formulaire ni paiement soumis. Pas de mesure terrain, de test utilisateur, de lecteur d’écran, de revue complète des sept langues ni de benchmark concurrentiel.

Preuves brutes : [runtime.json](runtime.json), [throttled.json](throttled.json), [captures](screenshots/), [inventaire FR/EN](06-copy-inventory.md). `runtime.json` contient des données publiques du DOM et du réseau local, pas les configurations privées.

## E1 — Identité et composition

**À conserver.** Logo géométrique QoreDB, violet, neutres, clair/sombre, vraies captures et hiérarchie typographique. L’intention « calm, precise, fast, and trustworthy » et « professional instrument » est explicitée dans `doc/DESIGN_SYSTEM.md:24` et sa conclusion. La fondation décrit un accent rare et des ombres subtiles (`doc/VISUAL_FOUNDATION.md:33`). Ces documents viennent de l’application : leur échelle de texte n’est pas directement une prescription pour un site marketing.

**Observation visuelle.** Le hero est lisible et bien aligné, mais dominé par un titre centré, un traitement italique hachuré, un halo violet, un badge de release et des boutons brillants. Cette composition communique une landing page technologique générique plus qu’un instrument de travail particulier. C’est un jugement de design, pas un défaut fonctionnel ou une preuve de copie d’un concurrent.

- Capture produit : début à **825,7 px desktop**, **808,2 px mobile** ; à 390×844, seule sa bordure supérieure est visible avant défilement. Taille mobile : 358×236,5 ; la fenêtre entière ne peut pas y montrer lisiblement les détails de travail.
- Accueil : **10 201 px desktop**, **16 382 px mobile**. La longueur seule n’est pas un défaut ; ici elle s’ajoute à une hiérarchie très répétitive.
- Les trois démonstrations de workflows commencent vers **4462 px desktop**, après la compatibilité, le MCP et les 16 cartes.
- Sources : `components/landing/hero.tsx:25`, `:33`, `:66`, `:132` ; ordre `app/[locale]/page.tsx:189` ; géométrie dans `runtime.json`, entrée `home-desktop-light` et `home-mobile-light`.

Captures : [desktop clair](screenshots/home-desktop-light.png), [sombre](screenshots/home-desktop-dark.png), [mobile](screenshots/home-mobile-light.png), [page complète](screenshots/home-desktop-light-full.png). La position du header fixe dans la capture longue dépend du défilement utilisé pour révéler les sections.

## E2 — Architecture de l’information

- Accueil monté : Header, Hero, SocialProofBar, DatabaseStrip, McpSection, FeaturesSection, FeatureShowcase, InlineCTA, Testimonials, ComparisonTable, MiniFaq, PricingPreview, CTASection, Footer (`app/[locale]/page.tsx:189`). Les 14 composants sont des composants client ; la page est rendue côté serveur.
- **16 cartes identiques** portant du contenu statique, avec des changements d’icône, d’ombre et de bordure au survol ; aucune navigation de carte (`components/landing/features-section.tsx:24`, `:101`). Cela donne le même poids à des fonctions de valeur très différente.
- **34 moteurs/services** listés par familles, déjà assortis d’une note sur les différences de capacités (`lib/databases.ts:3`, `database-strip.tsx:18`). Conserver l’exhaustivité sur une surface dédiée, présenter une synthèse dans l’accueil.
- Téléchargement répété dans header, hero, preuve sociale, CTA intermédiaire et CTA final. La répétition en tête et fin sert le parcours ; le bloc intermédiaire apporte moins que la preuve produit. Header desktop donne un bouton visuellement distinct à Discord, téléchargement reste un lien texte (`header.tsx:141`).
- Deux entrées footer pointent `/marketplace` au lieu de `/plugins` (`lib/footer-links.ts:15`, `:26`). **HTTP 404 confirmé** pour `/fr/marketplace` : [résultat](footer-marketplace.json).
- Le blog possède déjà une amorce de composition éditoriale : titre aligné à gauche, colonne secondaire et filet (`app/[locale]/blog/page.tsx:124`). Référence interne utile, sans copier sa grille de cartes partout.
- Compte statique indicatif : 50 liens/commandes desktop, menus fermés, listes développées dans le calcul. Le compte DOM mesuré est consigné dans `runtime.json.initial.interactive` ; les conditions de visibilité diffèrent. Profondeur globale React non mesurée ; chaîne de navigation observée : Header → NavigationMenu → List → Item → Content → Link → Next Link (`header.tsx:83`). Aucun diagnostic de performance n’est déduit de cette profondeur.
- Code mort précisément repéré : états et handler d’ancien formulaire newsletter dans Footer, sans formulaire monté (`footer.tsx:29`). Pas d’inventaire global certifié des imports inutilisés.

## E3 — Système visuel et accessibilité

- Deux ensembles de tokens coexistent : mappings Qore dans `app/[locale]/globals.css:23`, autres mappings sémantiques dans `:192`. Rayons déclarés en 4/6/10/16 px (`:13`) puis redéfinis via `--radius` (`:184`). Certaines différences peuvent être intentionnelles ; leur source de vérité doit être explicite.
- Échelle rendue desktop : 11, 12, 14, 16, 18, 20, 30, 36, 48, 96 px. Le hero mobile est à 36 px. Espacements principalement issus de la base 4 ; sections souvent à 96 px de padding vertical, titres centrés et mêmes marges. L’enjeu est le rythme uniforme, pas une absence de système.
- Inventaire source limité à hero/header/features/showcase/pricing/download/button/background : 9 tokens couleur Qore, 2 hex supplémentaires (#5865F2, #6B5CFF), 4 nuances Tailwind supplémentaires et 11 références sémantiques. Ce n’est pas un compte de couleurs distinctes réellement perçues : aliases et transparences se recouvrent.
- Contraste calculé depuis les tokens, sans mesure pixel des gradients : `q-text-2` sur fond de carte clair **2,98:1**, sombre **3,45:1**. Ce rôle est utilisé pour de vraies descriptions à 14 px (`features-section.tsx:119`, `:131`). Blanc sur `q-accent-strong` sombre : **2,77:1**, risque pour les CTA. Les mesures exactes doivent inclure état hover, transparence et fond réel.
- Button partagé fournit focus-visible et disabled (`components/ui/button.tsx:8`) ; plusieurs CTA réimplémentent leur style. Header mobile possède déjà un libellé et `aria-expanded` (`header.tsx:127`) : préserver cette base.
- Le `<main>` englobe seulement le hero (`hero.tsx:25`, `:148`), pas les autres sections principales. Aucun skip link trouvé dans app/components.
- Recherche et navigation docs placées dans un `aside hidden lg:block` (`app/[locale]/docs/layout.tsx:41`). L’absence de ces commandes sur mobile est corroborée par [la capture](screenshots/docs-mobile.png) et [le DOM](docs-mobile.json). La page index reste navigable par ses cartes ; ne pas confondre avec une documentation entièrement inaccessible.

États : loading/error/disabled existent pour téléchargement et tarifs ; succès/erreur existent pour newsletter ; vide/loading existent pour recherche. Les lacunes portent sur les annonces accessibles, la récupération après erreur, le nom des contrôles et la gestion du focus. Sources : `download-section.tsx:147`, `:309`, `pricing-page-client.tsx:111`, `:385`, `newsletter-card.tsx:71`, `SearchDialog.tsx:115`. Audit clavier complet non effectué.

## E4 — Honnêteté et précision éditoriale

- « 34 drivers natifs » (`locales/fr/common.json:186`) inclut des services et variantes de protocoles ; le registre contient effectivement 34 entrées. Préférer « 34 moteurs et services pris en charge », avec capacités par famille. Référence croisée : `../QoreDB/doc/FEATURES.csv` et README applicatif ; aucun nouveau décompte de drivers indépendants prétendu.
- « Licence Apache 2.0 » global dans hero (`fr/common.json:199`) manque la portée Core ; le produit a une séparation Apache/BUSL documentée dans `../QoreDB/doc/development/LICENSING.md:3`. Le README vitrine se déclare propriétaire. Clarifier les textes sans changer de licence.
- FAQ tarifs « Aucune donnée ne quitte votre machine. Même l’IA fonctionne avec vos propres clés API » (`fr/common.json:784`) contredit la nuance déjà présente dans la mini-FAQ. BYOK ne signifie pas inférence locale. Décrire les connexions directes et les transmissions IA choisies, sans promesse absolue.
- Distinguer Pro individuel à achat unique et Team par siège/an dans les réponses parlant d’abonnement. Checkout Team utilise `mode: "subscription"` (`app/api/checkout/route.ts:36`). Les détails commerciaux sont conservés, pas redéfinis par la DA.
- Repères Core/Pro incomplets dans la grille ; contradiction documentaire sur le niveau du diagramme ER entre la page tarifs et README/guide de licence applicatif. **À trancher en vérifiant le gating effectif avant publication**, pas à résoudre par supposition.
- Comparatif de 15 lignes et 4 produits, sans date/version/source par cellule (`comparison-table.tsx:19`). Pas de vérification externe de ses assertions : on ne conclut pas que les concurrents sont mal décrits. Sortir ce tableau de l’accueil ; sa maintenance documentée serait un travail distinct.
- Statistiques du JSON datées du **18 juillet 2026** (`lib/data/social-stats.json:2`), téléchargements d’assets GitHub et non utilisateurs uniques. Les liens des témoignages ne permettent pas tous de retrouver les citations originales. Aucune preuve de fabrication ; conserver seulement les éléments dont la provenance peut être tenue à jour.
- Français : « Concu » (`fr/common.json:539`), « Sécurité & Privée », termes de fonctionnalités mêlant français/anglais. Réécrire autour du bénéfice, conserver SQL/MCP/SSH lorsqu’ils sont utiles au public cible.

## E5 — Poids, fluidité et résilience

Mesures de chargement sans interaction, cache navigateur neuf ; références brutes dans runtime. **Encoded = corps compressé**, hors en-têtes, et decoded = corps décompressé. Le type `initiatorType=script` seul oublie les JS préchargés par lien ; les sommes suivantes reconnaissent aussi les URL JS.

| Accueil FR | Desktop 1440 | Mobile 390 |
| --- | ---: | ---: |
| JS présents dans les script tags du HTML initial | 17 fichiers | 17 fichiers |
| Corps de ces JS, encodé / décodé | 350 774 / 1 212 354 octets | identique |
| Tous JS observés au démarrage, préchargements inclus | 500 007 / 1 685 999 octets | 358 434 / 1 233 317 octets |
| Ressources observées, hors document principal | 92 | 63 |
| Logos de bases chargés, corps encodé | 218 392 octets | 182 022 octets |
| Animations infinies encore actives | 2 | 2 |

La différence desktop/mobile comprend le préchargement des destinations visibles. Ne pas qualifier le total desktop de « bundle initial de la home », ni attribuer les dépendances Sanity/Stripe au navigateur sur la seule lecture de package.json.

- Le pipeline WebP responsive **existe déjà** (`scripts/generate-image-variants.ts:31`, `lib/sanity/imageLoader.ts:14`). Plusieurs logos affichés à 20 px utilisent une variante de 384 px, largeur minimale du générateur. Corriger ces petits assets sans remettre en cause le traitement des grandes captures.
- Hero : dimensions réservées, `sizes`, priorité d’image et entrée CSS déjà présents (`hero.tsx:135`). Le LCP observé dans le viewport est le titre, pas automatiquement la capture malgré le commentaire source.
- `DownloadProvider` global déclenche `/api/latest-release` (`app/[locale]/layout.tsx:122`, `contexts/DownloadProvider.tsx:97`) ; seul DownloadSection consomme `useDownload` dans app/components. Candidat clair pour limiter le provider à la page téléchargement.
- `next/dynamic` dans la page serveur n’est pas une preuve de report jusqu’au scroll. Vérifier le résultat réseau après conversion des sections statiques en serveur. [Documentation Next.js](https://nextjs.org/docs/app/guides/lazy-loading).
- Deux shimmers continuent même avec `prefers-reduced-motion: reduce`. Seul `q-fade-up` possède une exception CSS (`globals.css:178`). Le fond utilise une parallaxe JS déjà coalescée par rAF et un listener passif, mais sans garde reduced-motion (`hero-background-manager.tsx:16`). Son coût GPU n’a pas été mesuré.
- Sans JavaScript, plusieurs titres/sections gardent leur parent à `opacity:0` ; confirmé dans [home-mobile-nojs.json](home-mobile-nojs.json). Les boutons de navigation du hero utilisent des handlers JS. Remplacer les liens de navigation par de vrais liens et rendre le contenu visible par défaut.

Trois essais mobiles simulés : CPU ×4, débit descendant 200 000 octets/s, latence configurée 150 ms, viewport 390×844 DPR1, cache désactivé, serveur local chaud, externes bloqués. **LCP : 1288 / 1248 / 1264 ms, médiane 1264 ms.** Ce résultat local ne prédit pas le P75 en production. TTI et INP représentatif non mesurés ; ne pas remplacer ces valeurs par le temps de DOMContentLoaded. Le dossier contient les long tasks brutes, pas un audit Lighthouse complet.

## E6 — Contrôles effectués

- Pages locales listées : réponses 200 ; route footer marketplace : 404.
- Pas d’erreur JavaScript non capturée dans les dix navigations de runtime.json ; cela ne valide pas toutes les interactions.
- `pnpm typecheck` : **non exécuté jusqu’au compilateur**, pnpm tente une réinstallation puis refuse de retirer node_modules sans TTY. Aucune réinstallation forcée.
- Équivalent direct sur dépendances existantes : `node node_modules/typescript/bin/tsc --noEmit --incremental false` : **réussi**.
- Pas de nouveau build complet, Lighthouse, test E2E, paiement ou test d’intégration. Ce travail modifie uniquement le dossier d’audit et de plan.

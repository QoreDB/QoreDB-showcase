# Plan d’implémentation — une vitrine à la hauteur de QoreDB

Date : 16 septembre 2026. Repo : `/home/raphael/dev/perso/QoreDB-showcase`.
Statut : **plan proposé, site non modifié**. Analyse et mesures : [01-evidence.md](01-evidence.md).

## Décision de design

**Recomposer la vitrine autour de l’instrument de précision.** Faire ressentir la qualité du logiciel à travers la netteté de la composition, la lisibilité du produit et la précision des preuves.

L’existant est propre et lisible. Sa faiblesse est la hiérarchie : hero décoratif, catalogue de 34 compatibilités puis 16 fonctionnalités avant les workflows distinctifs. Les effets sont nombreux mais contribuent peu à une identité propre. Les fondations Next.js, les images responsive, le bilinguisme documentaire, les sept langues du site et les parcours commerciaux sont à conserver.

Hypothèse de cible : développeur produit, indépendant ou petite équipe, qui veut évaluer un client desktop SQL/NoSQL local-first. L’objectif principal est comprendre → vérifier sa base → télécharger ; l’offre Pro/Team est un parcours secondaire. Cette hypothèse est cohérente avec `doc/PROJECT.md`, mais ce document historique n’est pas une preuve des capacités actuelles.

### Les partis pris concrets

| Dimension | Décision proposée | Effet recherché |
| --- | --- | --- |
| Composition | Hero asymétrique, texte à gauche et produit à droite ; grille 12 colonnes, répartition 5/7 au grand format ; largeur utile 1240–1320 px | L’application et sa qualité deviennent immédiatement identifiables |
| Typographie | Conserver Inter et Space Grotesk ; titres droits, resserrés, poids assumé ; aucune seconde ligne hachurée/italique décorative | Une expression plus précise et moins dépendante des codes de landing page |
| Couleur | Neutres blancs/graphite et violet QoreDB ; accent réservé aux actions, focus et repères utiles | Autorité et cohérence avec l’application |
| Formes | Filets nets, tableaux/lignes de contenu ouverts ; rayons modérés ; cartes uniquement pour des unités réellement regroupées | Réduire l’effet catalogue de cartes arrondies |
| Image | Captures réelles à plat, cadrages choisis pour montrer une action ; détails conçus pour mobile | Faire comprendre le logiciel, même sur petit écran |
| Signature | Étapes numérotées, annotations sobres, repères de colonnes et états d’environnement tirés du produit | Une identité spécifique au travail sur les données |
| Mouvement | Micro-interactions brèves sur action, zéro animation décorative permanente ; défilement natif | Une expérience calme et fluide |
| Thèmes | Clair et sombre également dessinés ; préférence système et choix manuel conservés | Ne pas confondre caractère professionnel et fond noir systématique |

La prise de risque se situe dans une sélection éditoriale forte, le contraste d’échelle et le cadrage du produit. Pas de nouvelle bibliothèque d’animation, de police externe supplémentaire ou de scène 3D nécessaire à cette direction.

### Esquisse de premier écran

```text
DESKTOP ≥ 1200 px
┌────────────────────────────────────────────────────────────────────┐
│ QoreDB   Produit   Documentation   Tarifs   Ressources    Télécharger│
├──────────────────────────┬─────────────────────────────────────────┤
│ CLIENT DESKTOP SQL/NOSQL │                                         │
│                          │ Capture réelle : éditeur + résultat,    │
│ Vos bases.               │ avec un contexte d’environnement       │
│ Un espace de travail.    │ clairement visible.                     │
│                          │                                         │
│ Une promesse concrète,   │ Un repère discret explique ce que       │
│ deux lignes maximum.    │ l’on voit, sans fausse interaction.      │
│                          │                                         │
│ [Télécharger QoreDB]      │                                         │
│ Voir le produit ↓        │                                         │
│ macOS · Windows · Linux  │                                         │
└──────────────────────────┴─────────────────────────────────────────┘
  PostgreSQL · MySQL · MongoDB · Redis · SQLite · …  Voir les 34 →

MOBILE 390 px
Logo + menu → titre → proposition courte → téléchargement
→ capture recadrée montrant une action lisible → compatibilités
→ premières preuves de travail
```

Le texte est une piste éditoriale, pas une promesse finale validée. « Voir le produit » mène à la première démonstration, sans ouvrir une fausse application interactive. Sur mobile, montrer un recadrage lisible d’au moins 200 px de haut dans le premier écran de 844 px ; ne pas simplement réduire une fenêtre de 2782 px.

## Architecture de contenu proposée

| Ordre | Bloc | Contenu et décision sur l’existant |
| --- | --- | --- |
| 1 | Hero + produit | Une proposition précise, un CTA principal, une action secondaire, capture immédiatement visible ; badge release ramené à une information discrète |
| 2 | Compatibilités | Cinq à six marques représentatives et un lien vers la liste complète ; conserver les 34 entrées dans les pages de détail/docs |
| 3 | Trois preuves de travail | Explorer et interroger ; préparer et vérifier des modifications ; travailler avec des garde-fous. Une image et une explication concrète pour chaque preuve, niveau Core/Pro exact |
| 4 | Automatisation et confiance | MCP en module compact avec opt-in/lecture seule ; local-first et Core open source expliqués sans absolus contradictoires |
| 5 | Choisir son offre | Résumé Core/Pro/Team fidèle aux tarifs ; prix et conditions depuis les sources existantes ; lien vers comparaison complète des offres |
| 6 | Dernières questions + téléchargement | Trois objections utiles, puis conclusion courte et CTA. Une citation vérifiable ou un chiffre daté peut soutenir une preuve précédente |
| 7 | Footer | Navigation fiable, ressources, communauté, juridique ; densité maîtrisée |

L’accueil n’affiche plus la grille exhaustive de 16 cartes ni la matrice concurrentielle de 60 cellules. La richesse du produit reste accessible dans `/features`, ses pages de détail et `/docs`. Pas de nouvelle route concurrentielle nécessaire dans ce chantier : une éventuelle comparaison sourcée serait un lot éditorial distinct. Conserver les ancres `#features`, `#preview` et `#mcp` sur les nouveaux blocs correspondants pour les liens existants.

## Phase 0 — Références et état initial

**Déjà réalisé dans cet audit :** lecture du repo, captures, inventaire des routes/contrats, mesures réseau locales, trois essais mobiles ralentis et compilation TypeScript directe. Pas de rebuild ni de test réel du paiement. Avant implémentation, relire les instructions applicables et `git status --short`, car le repo peut avoir changé.

### Patterns et API autorisés

| Besoin | Exemple local à lire et reprendre | Limite à respecter |
| --- | --- | --- |
| Traductions serveur | `app/[locale]/i18n.ts:30` : `useTranslation(locale, "common")` retourne `t` ; usage dans `app/[locale]/page.tsx:109` | Passer des chaînes/objets sérialisables aux îlots client, pas la fonction `t` |
| Metadata et locales | `buildPageMetadata` dans `lib/seo.ts`, usage page.tsx:88 ; `lib/locale.ts:3` | Préserver canonical, alternates, OpenGraph, routes et sept langues |
| Navigation | `components/ui/button.tsx:39` : Button `asChild` + Next Link ; `language-switcher.tsx` | Un changement de page est un lien, pas un bouton dépendant d’un handler JS |
| Thème | `app/[locale]/layout.tsx:116`, `components/theme-toggle.tsx` | Garder class/system et persistance, éviter flash et mismatch d’hydratation |
| Images | `lib/sanity/imageLoader.ts:14`, `scripts/generate-image-variants.ts:31`, `hero.tsx:135` | Conserver variantes statiques et tailles réservées ; ne pas éditer le manifeste généré à la main |
| Offres et paiement | `app/[locale]/pricing/page.tsx:42`, `components/pricing/pricing-page-client.tsx:132` | Garder prix/fallback, disponibilité Team, erreurs et flux existants ; ne pas dupliquer la logique commerciale |
| Téléchargement | `contexts/DownloadProvider.tsx:39`, `components/download/download-section.tsx:67` | Préserver Windows Store, macOS Intel/ARM, Linux et sélection des formats |
| Documentation | `app/[locale]/docs/layout.tsx:23`, `components/docs/SearchDialog.tsx:51` | Garder import Pagefind à l’ouverture, contenus EN/FR, fallback et ancres |
| Blog | `app/[locale]/blog/page.tsx:54`, `components/blog/FeaturedArticle.tsx` | Garder rendu serveur, filtres/pagination par URL, Sanity et fallback linguistique |

Documentation officielle consultée : [frontières serveur/client Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components), [chargement différé Next.js](https://nextjs.org/docs/app/guides/lazy-loading), [réduction des mouvements Motion](https://motion.dev/docs/react-use-reduced-motion), [Web Vitals](https://web.dev/articles/vitals). Les docs Next actuelles peuvent être plus récentes que 16.2.10 installé : vérifier les signatures locales avant toute nouvelle option. Ne pas copier l’import `motion/react` sans vérifier le package installé ; le repo utilise `framer-motion`.

**Validation :** baseline de production reproductible pour home et download, inventaire des anciens liens/ancres, capture desktop et mobile de chaque écran touché. Ne pas mesurer le bundle de développement ni inclure Sanity Studio dans le poids de l’accueil par simple addition des dépendances.

## Phase 1 — Direction artistique et preuves éditoriales · P0

**À produire :** une planche de tokens et des compositions haute fidélité du hero + première preuve, en 1440×900 et 390×844, clair et sombre. Il s’agit d’un livrable de design vérifiable avant d’étendre le style au site entier.

- Reprendre la marque de `doc/DESIGN_SYSTEM.md` et les rôles de `doc/VISUAL_FOUNDATION.md`, puis écrire leur déclinaison marketing dans `doc/SHOWCASE_DESIGN_SYSTEM.md`.
- Préparer les trois scénarios avec des captures existantes ou de nouvelles captures de l’application, données de démonstration uniquement. Indiquer source, version, niveau de licence, cadrage desktop/mobile et texte alternatif.
- Donner à chaque preuve une structure « tâche → action visible → résultat ». Exemple : préparer une modification, inspecter le diff, décider de son application. Ne pas montrer une capacité non livrée ni qualifier une maquette de capture réelle.
- Relire `locales/fr/common.json` et `locales/en/common.json`, notamment hero, grille, FAQ et prix. Résoudre les contradictions de niveau de fonctionnalité par le code produit effectif. Dire « moteurs et services » plutôt que promettre 34 implémentations indépendantes.
- Rendre explicitement distincts Core Apache, fonctionnalités Premium et traitement IA optionnel. Dater les chiffres ; n’utiliser que les témoignages dont la provenance est retrouvable.

**Spécification initiale à tester :** H1 fluide 40–80 px, H2 32–48 px, corps 16–18 px, petites annotations 12–13 px seulement si leur lisibilité est suffisante ; base d’espacement 4/8/12/16/24/32/48/64/96 ; boutons 6–8 px de rayon, panneaux 8–12 px ; trois surfaces neutres. Deux rôles de violet possibles : texte/lien et fond de bouton, afin de conserver un contraste fiable en sombre.

**Acceptation :** à 1440×900, titre, CTA et une portion substantielle de l’application sont visibles ensemble ; à 390×844, un détail utile du produit apparaît avant défilement. Pas de CTA concurrent de même poids. En revue de cinq secondes avec 3–5 personnes cibles si disponibles, elles identifient « client desktop de bases de données », l’action de téléchargement et au moins une différence concrète ; cette validation utilisateur reste à organiser, elle n’a pas été effectuée.

**Garde-fous :** ne pas confondre plus affirmé avec davantage d’ornements ; ne pas agrandir artificiellement la capture au point de rendre le texte produit illisible. Aucun changement de prix, de licence ou de périmètre fonctionnel.

## Phase 2 — Tokens, navigation et composants communs · P0

**Fichiers :** `app/[locale]/globals.css`, `components/ui/button.tsx`, `components/landing/header.tsx`, `footer.tsx`, `lib/footer-links.ts`, `theme-toggle.tsx`, `language-switcher.tsx`, locales.

- Reprendre Button et les composants Radix existants ; unifier les rôles couleur/rayon plutôt qu’ajouter une troisième couche de tokens. Préserver les couleurs sémantiques de données et d’environnement.
- Appliquer la nouvelle hiérarchie : Produit, Documentation, Tarifs, Ressources ; Plugins/Blog/Changelog accessibles dans Ressources et footer. Télécharger devient le CTA de l’en-tête. Les dix destinations produit restent accessibles depuis l’index ou le menu, sans toutes remplir le panneau mobile.
- Menu mobile défilable si nécessaire, fermeture Escape, ordre clavier cohérent, libellés traduits ; traiter comme un disclosure de navigation sauf choix explicite de modal.
- Un seul main pour tout le contenu principal de chaque page, skip link, focus visible commun ; vraies ancres pour navigation.
- Corriger les deux liens `/marketplace` vers `/plugins`. Enlever l’ancien handler newsletter non rendu du footer lors de sa retouche, sans nettoyage plus large.

**Acceptation :** toutes les destinations du menu/footer répondent dans FR/EN ; choix de langue conserve le chemin ; clair/sombre restent persistants ; ouverture/fermeture menu utilisable au clavier à 320/390/768 px ; aucun débordement horizontal. Contraste du texte courant ≥4,5:1, grands textes ≥3:1, contrôles/focus distinguables dans leurs états ; contrôle des vrais fonds, pas uniquement des valeurs hex.

**Garde-fous :** changements globaux de tokens vérifiés sur tarifs, docs, plugin et formulaires ; ne pas imposer des arrondis/tailles marketing à tous les composants de documentation. Garder les licences de fichier existantes lors d’une extraction.

## Phase 3 — Nouvelle composition de l’accueil · P0

**Fichiers :** `app/[locale]/page.tsx`, `components/landing/hero.tsx`, `database-strip.tsx`, `feature-showcase.tsx`, `mcp-section.tsx`, `pricing-preview.tsx`, `mini-faq.tsx`, `cta-section.tsx`, fichiers de sections retirées et traductions associées ; assets sous `public/images/`.

- Construire la séquence décrite plus haut. Reprendre les captures et données de `feature-showcase.tsx:8` et `lib/databases.ts`, en sélectionnant ce qui sert chaque preuve.
- Remplacer la longue grille et le comparatif par des liens vers les ressources déjà disponibles. Préserver les ancres existantes sur les nouvelles sections ; vérifier qu’aucun autre écran ne dépend d’un composant avant de le supprimer.
- Hero 5/7 sur grand écran ; empilement pensé pour mobile. Capture à plat avec cadrage distinct selon viewport, via image responsive maîtrisée ; éviter de télécharger les deux variantes desktop/mobile simplement masquées par CSS.
- Trois preuves avec rythmes distincts : vue large du travail, détail annoté, explication courte des garde-fous. Les niveaux payants apparaissent dans la légende et le texte utile, sans parsemer toutes les lignes de badges.
- Placer MCP dans l’automatisation après la compréhension du produit. Ne pas le supprimer : c’est un différenciateur réel et documenté.
- Reprendre la lecture de prix existante si des montants apparaissent dans l’aperçu ; extraction partagée minimale seulement si nécessaire. Core/Pro/Team et leur disponibilité restent fidèles à la page tarifs.
- Décliner les nouvelles chaînes dans les sept locales. Les textes de navigation et alt utiles passent par i18n ; les noms de marque restent inchangés.

**Acceptation :** récit complet sans JS, toutes les sections visibles sans hydratation, téléchargement accessible par lien. Aucun effet de carte cliquable sur un contenu statique. Captures réalistes et lisibles à 390 et 1440 px ; aucun saut de mise en page à leur chargement. Test de repérage : compatibilité d’une base accessible en une navigation depuis l’accueil ; prix détaillés également.

**Garde-fous :** pas de scène lourde, de scroll forcé, de carrousel automatique ni de contenu principal initialement caché par `opacity:0`. Les critères de lisibilité priment sur un objectif arbitraire de longueur de page.

## Phase 4 — Réduction du travail navigateur · P1, intégrée dès la phase 3

**Fichiers :** page/layout, composants landing, `components/TranslationsProvider.tsx`, `contexts/DownloadProvider.tsx`, page download, background manager, CSS, génération/loader d’images.

- Copier le pattern de traduction serveur de la page pour les sections purement éditoriales. Garder des îlots client pour thème, langue, menus, sélection plateforme, recherche et paiement. Le passage de Server Components comme children d’un provider reste valide ; ne pas transformer toute l’arborescence en client pour conserver ce provider.
- Déplacer DownloadProvider au plus près de DownloadSection, après vérification de tous ses consommateurs ; supprimer le provider de traduction doublonné de la page download si sa suppression préserve exactement les ressources nécessaires.
- Retirer HeroBackgroundManager si le nouveau fond est statique ; supprimer shimmer et le traitement hachuré du hero. Garder uniquement des transitions utiles sur interaction, typiquement 120–180 ms ; éventuelle transition explicative ≤300 ms. Toutes les variantes respectent reduced-motion.
- Générer des tailles 24/40/64 px pour les petits logos, ou employer des fichiers déjà adaptés ; conserver le pipeline WebP pour les captures et le traitement CDN de Sanity. Vérifier DPR1 et DPR2 ainsi que les octets réellement téléchargés.
- Réserver la priorité réseau à l’image réellement nécessaire au premier écran. Dimensionner les captures et différer celles du bas de page. Le nouveau hero peut changer l’élément LCP : le mesurer à nouveau.
- Auditer le préchargement Next Link : garder celui des destinations probables, limiter celui des longues listes/footer/docs si le profil le justifie. Les imports `dynamic` seuls ne prouvent aucun gain. Mesurer après chaque modification significative, sans retirer globalement le prefetch par principe.
- Vérifier les ressources i18n réellement envoyées ; réduire aux namespaces nécessaires seulement si le gain mesuré justifie la complexité. Ne pas supposer que les sept langues sont toutes téléchargées au premier chargement.

**Budgets proposés, à ratifier sur le prototype :**

| Mesure | Point de départ | Cible de recette |
| --- | --- | --- |
| JS de route initial, corps encodé hors préchargement de destinations | 350 774 octets ≈343 Kio | ≤300 Kio ; cible ambitieuse ≤250 Kio |
| JS observé au démarrage desktop, préchargements inclus, même protocole | 500 007 octets ≈488 Kio | Réduction d’au moins 25 % |
| Animations décoratives permanentes | 2, y compris mouvement réduit | 0 ; aucun rAF décoratif au repos |
| Logos de bases chargés initialement desktop | 218 392 octets ≈213 Kio | ≤40 Kio avec sélection courte et assets adaptés |
| LCP mobile simulé, médiane trois essais | 1,264 s, serveur local et externes bloqués | Aucune régression >10 % à protocole identique ; compléter par test public |
| Web Vitals terrain après publication | Non disponibles dans cet audit | P75 LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1, séparés mobile/desktop |

Ces budgets ne sont pas une promesse de gain avant implémentation. Les seuils terrain viennent des [Web Vitals](https://web.dev/articles/vitals) ; les autres sont des budgets de projet proposés. Ne pas annoncer un INP ou un TTI à partir du seul chargement. Si l’on ajoute de la mesure terrain, elle doit respecter la configuration analytics existante et ne collecter aucune donnée de connexion ou de paiement.

**Vérification :** build production, waterfall JS/images/prefetch, travail du thread principal pendant chargement/scroll/interactions, comparaison réduit/non réduit, visibilité de l’onglet et arrêt hors écran. Comparer même navigateur, viewport, DPR, compression, profil réseau/CPU, nombre d’essais et état des services externes. Un score Lighthouse isolé ne remplace pas cette comparaison.

## Phase 5 — Déclinaison aux parcours secondaires · P1

**Téléchargement** — `download-section.tsx`, `next-steps.tsx` : aligner typographie et surfaces, rendre les plateformes/architectures explicites et corrigeables, conserver formats et destinations. Loading avec texte et statut accessible ; en erreur, proposer réessayer et accès aux releases même sans réponse API. Tester Windows, mac Intel/ARM, Linux, plateforme inconnue, URL absente et panne API par mocks.

**Tarifs** — `pricing-page-client.tsx`, `pricing-comparison.tsx`, `team-plan-client.tsx` : rendre la différence de modèle économique immédiatement lisible, compacter les listes avant le CTA, aligner les repères Core/Pro/Team. Garder Stripe/fallback et toutes les branches actuelles. Erreur annoncée, libellé de bouton conservé pendant attente, FAQ avec expansion accessible. Tester checkout mocké réussi/échoué et Team actif/indisponible ; aucun achat réel en recette.

**Fonctionnalités et plugins** — index et détails existants : même grille, titres, légendes et niveaux. Le catalogue complet a ici une raison d’être. Préserver slugs, métadonnées, compatibilités et formulaires de soumission.

**Documentation** — `app/[locale]/docs/layout.tsx`, `SearchDialog.tsx`, `DocsSidebar.tsx` : accès recherche et sommaire sur mobile, dialogue nommé avec focus géré, chargement/échec/vide distincts. Reprendre les structures UI accessibles disponibles ; le mécanisme de modal doit être choisi explicitement si aucun composant local adapté n’existe. Pagefind reste chargé sur demande. Préserver ancres, liens précédent/suivant, fallback EN et index généré après build.

**Blog et pages restantes** — reprendre la composition éditoriale déjà présente et aligner tokens/contrastes, sans refonte du CMS. Vérifier article long, filtres, pagination, images Sanity et états vides. Vérifier aussi FAQ, changelog, contact/newsletter, formulaires OSS, pages licence/Team et pages légales affectées par les composants communs ; pas de refonte fonctionnelle de l’admin ou du Studio.

**Acceptation :** mêmes parcours et destinations avant/après ; pas de contrôle caché indispensable en mobile ; styles cohérents sans appauvrir la lecture des docs/articles. Les erreurs et confirmations ont un texte accessible et une issue claire. Les services indisponibles ne rendent pas les pages silencieuses ou vides.

## Phase 6 — Recette et bascule · P0 avant publication

- Vérifier que l’implémentation suit la déclinaison documentée et les contrats locaux, sans API inventée ni nouvelle bibliothèque non nécessaire.
- `pnpm typecheck` ; si l’environnement pnpm tente de réinstaller node_modules comme pendant l’audit, résoudre sa configuration sans purge implicite ou utiliser explicitement le compilateur local pour le diagnostic. Ne pas appeler cette solution de repli une exécution réussie de pnpm.
- `pnpm exec biome check` sur les fichiers changés. Éviter le formatage global du repo.
- Build complet (`pnpm build`) dans un environnement de recette configuré. Pour isoler le frontend : images → typecheck → `build:next` → `build:search`, en documentant que les statistiques n’ont pas été rafraîchies. Le build peut dépendre des services ; une erreur externe n’est pas un succès de validation.
- Smoke tests navigateur avec Puppeteer déjà disponible, scripts explicites à ajouter sous `scripts/` : liens/ancres FR/EN, menu mobile, thème/langue, docs search mobile, téléchargement/erreurs et checkout mocké. Garder un petit nombre de tests liés aux risques observés ; pas de tests qui recopient la structure des composants.
- Captures 320, 390, 768, 1024, 1440 et 1920 px ; FR/EN clair/sombre, titres longs DE, rendu JA/ZH, zoom 200 %, clavier et reduced-motion. Contrôle des sept locales : absence de clés brutes, routes et boutons non tronqués.
- Mesures production reproductibles, puis audit public intégrant CDN/fonts/analytics et un essai sur téléphone réel. Observer header au scroll et transitions de route, pas seulement le score de chargement.
- Régression SEO : URLs, redirections, canonical/hreflang, titres/h1, JSON-LD et sitemap. Les changements de contenu doivent rester cohérents avec les données structurées.
- Actualiser documentation de DA et protocole de performance. Fournir captures avant/après et tableau des mesures. Ne pas modifier le catalogue de fonctionnalités de l’application pour une simple refonte de sa vitrine.

**Condition de bascule :** aucune route interne cassée dans les surfaces touchées ; CTA principaux et états d’erreur validés ; contraste et clavier vérifiés ; budgets respectés ou écart explicitement motivé ; toutes les traductions présentes. Déployer un ensemble cohérent de composants/pages ; conserver l’artefact de déploiement précédent pour retour arrière, sans maintenir deux designs concurrents dans le code. La publication ne fait pas partie de la présente demande de plan.

## Découpage de livraison

1. **Lot A — langage visuel et hero de référence :** phase 1, puis tokens/navigation de phase 2. Permet d’évaluer concrètement la DA avant généralisation.
2. **Lot B — accueil :** nouvelle hiérarchie, contenus et architecture serveur/client ; phases 3 et 4 ensemble.
3. **Lot C — parcours :** téléchargement, tarifs, mobile docs et cohérence des autres pages.
4. **Lot D — recette :** vérifications, mesures finales, captures et documentation.

Priorité si le temps doit être limité : terminer A+B avec les défauts de navigation/accessibilité déjà identifiés et les parcours télécharger/tarifs cohérents ; la nouvelle mise en page des archives de blog peut attendre. Aucune limite de délai n’a été donnée : le plan complet reste la cible.

## Points à trancher avec des preuves pendant l’exécution

- Niveau commercial effectif de certaines fonctions, notamment ER : vérifier le code de gating applicatif, pas seulement README ou anciennes pages.
- Disponibilité de captures actuelles et de citations publiables : les assets existants permettent de démarrer, leur fraîcheur doit être vérifiée.
- Gains CPU/GPU des effets supprimés : hypothèse raisonnable, non quantifiée par cet audit.
- Préchargement des destinations docs : choisir le compromis avec des traces et des essais de navigation.
- Résultats de compréhension et préférence visuelle : une composition experte reste une proposition tant qu’elle n’a pas été confrontée à des personnes cibles.

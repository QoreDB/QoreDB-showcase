# Plan : intégration de la documentation QoreDB au site showcase

> Document de planification pour la mise en place d'une vraie documentation utilisateur de QoreDB, intégrée directement au site showcase Next.js.

## Contexte et décision

### Constat de départ

QoreDB dispose d'une documentation interne riche (~36 fichiers `.md` dans `QoreDB/doc/`) mais **aucune documentation destinée aux utilisateurs finaux**. Tout est orienté contributeurs, audits, RFC et roadmap. Il manque les fondamentaux : Getting Started, guides par driver, référence des raccourcis, FAQ produit, guides sécurité accessibles.

Le site showcase actuel (Next.js 16 + Sanity + i18n 7 langues + Tailwind) est mature et constitue déjà un investissement design et technique conséquent.

### Choix : Next.js plutôt que Docusaurus

La doc sera **intégrée au showcase**, pas hébergée sur un outil séparé.

Raisons :

- **Cohérence de marque** : marketing, blog et docs sous le même design system, sur `qoredb.com/docs`. C'est ce que font Linear, Stripe, Vercel, Tailwind.
- **i18n déjà fait** : 7 langues configurées via `next-i18n-router`. Docusaurus aurait son propre système, dupliquant l'effort.
- **SEO unifié** : un seul domaine, pas de sous-domaine `docs.qoredb.com` à gérer en reverse-proxy.
- **Liberté de design** : démos interactives, screenshots animés, composants custom (CodeTabs PG/MySQL/Mongo, KeyboardShortcut, etc.) sans se battre avec un thème Docusaurus.
- **Un seul stack** à maintenir et déployer.

Coût accepté : ~2-3 semaines de dev pour la Phase 1 (foundations) vs 3-4 jours pour Docusaurus.

### Choix produits validés

| Sujet              | Décision                                                                   |
| ------------------ | -------------------------------------------------------------------------- |
| Public visé        | Onboarding **et** devs existants (sidebar : tutoriel en haut, ref en bas)  |
| Langues v1         | EN + FR uniquement                                                         |
| Versioning         | Pas de versioning. Juste un "Mis à jour le …" extrait du git log par page  |
| Recherche          | **Pagefind**, gratuit, statique, scale long-terme, zéro service externe    |
| `/quick-start`     | Fusionné dans `/docs/getting-started`, redirect 301                        |
| Source du contenu  | Fichiers MDX dans le repo showcase (pas Sanity, qui reste pour le blog)    |

## Stack technique

Pipeline modulaire, sans framework lourd type Contentlayer (abandonné).

| Brique                                | Rôle                                              |
| ------------------------------------- | ------------------------------------------------- |
| `next-mdx-remote`                     | Compilation MDX server-side                       |
| `gray-matter`                         | Parsing frontmatter YAML                          |
| `rehype-pretty-code` (Shiki)          | Coloration syntaxique premium                     |
| `rehype-slug`                         | Génère des `id` sur les headings                  |
| `rehype-autolink-headings`            | Ancres cliquables sur les `h2`/`h3`               |
| `remark-gfm`                          | Tables, strikethrough, task lists                 |
| `pagefind`                            | Indexe le HTML après build, fournit la recherche  |

Pourquoi ce choix : zéro dépendance lourde, zéro service tiers, tout reste statique, gratuit à perpétuité, et facile à remplacer brique par brique si besoin.

## Architecture des fichiers

```
QoreDB-showcase/
├── content/docs/                          # Source de vérité MDX
│   ├── en/
│   │   ├── _meta.json                     # Ordre + libellés sidebar
│   │   ├── introduction/
│   │   │   ├── what-is-qoredb.mdx
│   │   │   └── open-core-model.mdx
│   │   ├── getting-started/
│   │   ├── connections/
│   │   ├── querying/
│   │   ├── schema/
│   │   ├── diff-and-migrations/
│   │   ├── ai-features/
│   │   ├── security/
│   │   ├── reference/
│   │   └── resources/
│   └── fr/                                # Même arborescence, traduite
│
├── app/[locale]/docs/
│   ├── layout.tsx                         # Sidebar + TOC + breadcrumbs
│   ├── page.tsx                           # Landing /docs
│   └── [...slug]/page.tsx                 # Rendu MDX dynamique
│
├── components/docs/
│   ├── DocsSidebar.tsx
│   ├── TableOfContents.tsx
│   ├── Breadcrumbs.tsx
│   ├── LastUpdated.tsx
│   ├── EditOnGithub.tsx
│   ├── PrevNextNav.tsx
│   ├── SearchDialog.tsx                   # Cmd+K, branché sur Pagefind
│   ├── PremiumBadge.tsx
│   ├── mdx/
│   │   ├── Callout.tsx                    # info / warning / tip / danger
│   │   ├── CodeTabs.tsx                   # PG / MySQL / Mongo / SQLite
│   │   ├── KeyboardShortcut.tsx
│   │   ├── Steps.tsx                      # Tutoriel numéroté
│   │   └── index.ts                       # Map MDX components
│   └── ...
│
├── lib/docs/
│   ├── mdx.ts                             # Compile MDX, extrait headings
│   ├── tree.ts                            # Construit l'arbre depuis fs
│   ├── meta.ts                            # Lit les _meta.json
│   ├── git.ts                             # `git log -1` pour last-updated
│   └── search-index.ts                    # Hooks Pagefind côté client
│
└── scripts/
    └── build-search-index.ts              # Lance pagefind après next build
```

### Pourquoi MDX en fichiers vs Sanity

| Critère                   | MDX en fichiers                 | Sanity                           |
| ------------------------- | ------------------------------- | -------------------------------- |
| Versioning                | Git natif (PR, blame, history)  | Manuel                           |
| Code blocks               | Excellent (Shiki, line numbers) | Limité                           |
| Composants custom         | Trivial (`<CodeTabs>` etc.)     | Complexe                         |
| Contributions externes    | PR GitHub                       | Accès Sanity Studio nécessaire   |
| Recherche                 | Pagefind sur HTML statique      | À coder                          |
| Coût                      | 0                               | Quota Sanity                     |

Sanity reste le bon choix pour le **blog** (édition non-technique, planning éditorial).

## URLs et redirects

```
qoredb.com/en/docs                          Landing docs EN
qoredb.com/fr/docs                          Landing docs FR
qoredb.com/en/docs/getting-started/installation
qoredb.com/fr/docs/getting-started/installation
qoredb.com/en/quick-start                   → 301 vers /en/docs/getting-started
qoredb.com/fr/quick-start                   → 301 vers /fr/docs/getting-started
```

Le `Changelog` et la `Roadmap` peuvent rester sur leurs URLs actuelles **et** être référencés depuis `/docs/resources/...`. Pas de duplication de contenu : juste un lien depuis la sidebar des docs.

## Arborescence de contenu (sidebar)

Ordre pensé pour les deux publics : tutoriel d'abord (onboarding), reference en bas (devs existants).

```
1. Introduction
   - What is QoreDB
   - Open Core model

2. Getting Started                           [ex /quick-start fusionné]
   - Installation (macOS / Windows / Linux)
   - First connection
   - Interface tour

3. Connections
   - PostgreSQL
   - MySQL
   - MongoDB
   - SQLite
   - SSH tunneling
   - Vault & profiles

4. Querying
   - Editor & autocomplete
   - Running queries
   - Results & exports
   - Query history
   - Saved queries

5. Schema
   - Browser
   - ER diagram                              [Premium]

6. Diff & Migrations                         [Premium - tout le dossier]
   - Schema diff
   - Migration generation

7. AI features                               [à dériver de doc/todo/ia.md]

8. Security
   - Vault encryption
   - Sandbox mode
   - SQL safety validation
   - Best practices

9. Reference
   - Keyboard shortcuts
   - Connection URLs                         [rapatrié de doc/internals/]
   - Driver limitations                      [rapatrié de doc/tests/]
   - Configuration

10. Resources
    - Changelog                              [lien vers /changelog existant]
    - Roadmap                                [lien vers /roadmap existant]
    - Contributing
    - License (Open Core)
```

### Sources existantes à recycler

Plusieurs docs internes sont presque utilisables tel quel pour la doc utilisateur, après réécriture/traduction :

| Doc interne (QoreDB/doc/)                   | Cible dans la doc utilisateur            |
| ------------------------------------------- | ---------------------------------------- |
| `internals/connection-url-instructions.md`  | `reference/connection-urls`              |
| `tests/DRIVER_LIMITATIONS.md`               | `reference/driver-limitations`           |
| `rules/DATABASES.md`                        | `connections/*` (par driver)             |
| `security/THREAT_MODEL.md` (extraits)       | `security/best-practices`                |
| `tests/TESTING_SSH.md`                      | `connections/ssh-tunneling`              |

## Plan d'exécution par phases

### Phase 1 : Foundations (3-5 jours)

Objectif : faire fonctionner une page de démo en EN+FR avec sidebar, TOC, recherche, last-updated. Aucun contenu réel encore.

- [ ] Installer les deps : `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, `shiki`, `rehype-slug`, `rehype-autolink-headings`, `remark-gfm`, `pagefind`
- [ ] Créer la structure `content/docs/{en,fr}/` avec un fichier `getting-started/installation.mdx` de démo
- [ ] Implémenter `lib/docs/mdx.ts` : lit un fichier, extrait frontmatter, compile MDX, retourne `{content, frontmatter, headings}`
- [ ] Implémenter `lib/docs/tree.ts` + `lib/docs/meta.ts` : construit l'arbre de navigation depuis le filesystem
- [ ] Créer la route `app/[locale]/docs/[[...slug]]/page.tsx`
- [ ] Créer le layout `app/[locale]/docs/layout.tsx` avec sidebar + TOC
- [ ] Composants MDX : `<Callout>`, `<CodeTabs>`, `<KeyboardShortcut>`, `<Steps>`, `<PremiumBadge>`
- [ ] Composant `<LastUpdated>` qui lit `git log -1` au build
- [ ] Composant `<EditOnGithub>` qui pointe vers le fichier source
- [ ] Composant `<PrevNextNav>` (page précédente / suivante dans la sidebar)
- [ ] Script `build-search-index.ts` qui lance Pagefind après `next build`
- [ ] Composant `<SearchDialog>` (Cmd+K) branché sur Pagefind
- [ ] SEO : metadata dynamique par page (title, description, OG image), sitemap `/docs/sitemap.xml`
- [ ] Style : harmoniser avec le design system existant du showcase (Tailwind 4, mêmes radius, mêmes couleurs)
- [ ] Validation : `pnpm build` doit passer, la page de démo doit s'afficher en EN et FR, la recherche doit fonctionner

### Phase 2 : Migration de `/quick-start` (1 jour)

- [ ] Convertir le contenu actuel de `/quick-start` en MDX dans `content/docs/{en,fr}/getting-started/`
- [ ] Découper en pages atomiques (installation, first-connection, interface-tour)
- [ ] Ajouter les redirects 301 dans `next.config.ts`
- [ ] Mettre à jour la nav globale : remplacer le lien "Quick Start" par "Docs"
- [ ] Vérifier qu'aucun lien interne du showcase ne pointe encore vers `/quick-start`

### Phase 3 : Contenu EN core (1-2 semaines)

Priorité aux pages à plus fort impact. Ordre suggéré :

- [ ] `introduction/what-is-qoredb`
- [ ] `getting-started/installation` (macOS, Windows, Linux)
- [ ] `getting-started/first-connection`
- [ ] `getting-started/interface-tour` (avec screenshots)
- [ ] `connections/postgresql`
- [ ] `connections/mysql`
- [ ] `connections/mongodb`
- [ ] `connections/sqlite`
- [ ] `connections/ssh-tunneling`
- [ ] `connections/vault-and-profiles`
- [ ] `querying/editor`
- [ ] `querying/running-queries`
- [ ] `querying/results-and-exports`
- [ ] `reference/keyboard-shortcuts`
- [ ] `reference/connection-urls`
- [ ] `reference/driver-limitations`
- [ ] `security/vault-encryption`
- [ ] `security/sandbox-mode`
- [ ] `security/best-practices`

Les sections `schema/`, `diff-and-migrations/`, `ai-features/` peuvent attendre une v2 de la doc.

### Phase 4 : Traduction FR (en parallèle de la Phase 3)

- [ ] Traduire en priorité : Getting Started complet, Connections (PG + MySQL), Reference (raccourcis + URLs)
- [ ] Le reste peut afficher un fallback vers la version EN avec un bandeau "Pas encore traduit"

### Phase 5 : Polish

- [ ] OG images générées dynamiquement par page (titre + section)
- [ ] Bouton "Améliorer cette page" (lien GitHub edit) en fin de chaque page
- [ ] Analytics : tracker les recherches sans résultat pour identifier les manques
- [ ] Bandeau "Cette page t'a aidé ?" (oui/non, anonyme)
- [ ] Dark mode (si pas déjà aligné avec le showcase)
- [ ] Performance : Lighthouse > 95 sur les pages de doc

## Composants MDX : détails

### `<Callout>`

```mdx
<Callout type="warning">
Ne jamais committer les credentials du vault.
</Callout>
```

Variantes : `info`, `tip`, `warning`, `danger`. Utilise les tokens couleur du design system existant.

### `<CodeTabs>`

```mdx
<CodeTabs>
  <Tab label="PostgreSQL">
    ```sql
    SELECT * FROM users LIMIT 10;
    ```
  </Tab>
  <Tab label="MongoDB">
    ```js
    db.users.find().limit(10)
    ```
  </Tab>
</CodeTabs>
```

Critique pour la section Connections où on montre la même opération sur les 4 drivers.

### `<KeyboardShortcut>`

```mdx
Press <KeyboardShortcut keys={["Cmd", "Enter"]} /> to run the query.
```

Détecte automatiquement macOS vs Windows/Linux pour afficher `Cmd` ou `Ctrl`.

### `<Steps>`

```mdx
<Steps>
  1. Click **New connection**.
  2. Select **PostgreSQL**.
  3. Paste your connection string.
</Steps>
```

Numérotation visuelle pour les tutoriels.

### `<PremiumBadge>`

Affiché sur les pages des modules sous BSL (Diff, ER diagram, Profiling). Lien vers `/pricing`.

## Frontmatter convention

Chaque fichier MDX commence par :

```yaml
---
title: First connection
description: Connect QoreDB to your first database in under a minute.
order: 2                   # Optionnel, override l'ordre du _meta.json
premium: false             # true affiche le badge Premium
---
```

Le `description` sert pour `<meta>`, OG, et l'extrait dans les résultats de recherche.

## Convention `_meta.json`

Un par dossier, contrôle l'ordre et les libellés affichés dans la sidebar :

```json
{
  "label": "Getting Started",
  "order": 2,
  "items": ["installation", "first-connection", "interface-tour"]
}
```

Permet de garder un nom de fichier en kebab-case et un libellé sidebar plus humain.

## Décisions ouvertes (à trancher plus tard)

- **Versioning futur** : si QoreDB sort une v1.0 stable avec breaking changes, faut-il revoir la stratégie ? La structure actuelle permet d'ajouter du versioning par dossier (`content/docs/v1/en/...`) sans réécrire le pipeline.
- **Doc API/CLI** : si une CLI QoreDB sort, prévoir une section `cli/` séparée. Pas de blocage technique.
- **Live demos** : à terme, intégrer des iframes `iframe-resizer` qui montrent QoreDB tournant dans un browser (ex via WebContainers). Hors scope v1.
- **Algolia DocSearch** : Pagefind tient probablement jusqu'à plusieurs milliers de pages. Si le volume explose, switch possible vers Algolia (gratuit pour les projets open-source via le programme DocSearch).

## Définition de "fini" pour la v1

La v1 est livrable quand :

1. `qoredb.com/en/docs` et `qoredb.com/fr/docs` existent et sont indexés
2. Les sections **Getting Started**, **Connections** (4 drivers + SSH + Vault), **Querying** (3 pages min), **Reference** (raccourcis + URLs + limitations) sont rédigées en EN
3. Au minimum **Getting Started + Connections PG/MySQL** sont traduits en FR
4. La recherche Pagefind fonctionne sur les deux locales
5. `/quick-start` redirige correctement
6. La doc est accessible depuis le header global du site
7. Lighthouse > 90 sur les pages de doc

## Estimation totale

| Phase                              | Effort estimé        |
| ---------------------------------- | -------------------- |
| 1. Foundations                     | 3-5 jours dev        |
| 2. Migration `/quick-start`        | 1 jour               |
| 3. Contenu EN core (~18 pages)     | 1-2 semaines rédac   |
| 4. Traduction FR (pages clés)      | 3-5 jours            |
| 5. Polish                          | 2-3 jours            |
| **Total**                          | **~3-4 semaines**    |

## Prochaine étape

Une fois ce plan validé : attaquer la **Phase 1 : Foundations** dans une branche dédiée `feat/docs-site`.

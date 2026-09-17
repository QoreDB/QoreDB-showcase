# Refonte vitrine — ce qui reste à faire

État au 17 septembre 2026, branche `codex/showcase-precision`. **Rien n'est commité.**

Tout ce qui pouvait être fait sans toi l'a été (liste en bas de page). Il ne reste que ce qui demande tes yeux, ton app, ou un déploiement.

## 1. À faire avant de commiter

- [ ] Parcourir le site dans le navigateur : accueil, `/features`, `/docs`, `/pricing`, `/download`, en clair et en sombre.
- [ ] Faire relire le japonais et le chinois par quelqu'un qui les lit. J'ai écrit ces textes sans relecture native : déroulé de la vidéo (`home.demo.steps`), exemple MCP (`home.mcp.example.*`), titre du mur de moteurs (`home.compatibility.heading`), texte alternatif du garde-fou (`home.workflows.safety.alt`), bouton copier (`docs.copy_code`, `docs.copied`). Le chinois n'a même pas pu être contrôlé visuellement ici : cette machine n'a pas de police chinoise.
- [ ] `git status` montre `articles-tracker.json` et un fichier `linkedin-posts/` modifiés. Ce n'est pas cette passe, à traiter à part.
- [ ] Test de fumée (`scripts/smoke-showcase.mjs`) : adapté à la nouvelle page mais **jamais relancé**, à ta demande. Si tu le relances un jour, il attend un build de production sur le port 3102.

## 2. Bug possible dans l'app (pas dans le site)

- [ ] En bac à sable, une cellule modifiée passe en ambre mais **affiche toujours l'ancienne valeur** (saisi « Sofia Moreau », la grille affiche « Sofia Haddad », alors que l'`UPDATE` est bien dans le panneau). Constaté dans le runtime web de la 0.1.39 ; à vérifier dans l'app desktop. Une fois corrigé : `MEDIA_ONLY=sandbox-changes node scripts/showcase-media/capture.mjs` pour refaire la capture.

## 3. Après déploiement

- [ ] Mesurer le LCP réel. L'audit notait déjà une régression en simulé (1,26 s → 2,13 s) et l'image du hero est plus lourde qu'avant (variante 2048 px sur écran Retina, ~110 Ko).

## 4. Choix laissés ouverts, volontairement

- **Images non référencées** dans `public/images/features/` et `public/images/screenshots/` (anciennes captures `*-screen`, `landing.webp`, plusieurs `.png`). Je ne les ai pas supprimées : elles peuvent être liées depuis des articles Sanity ou des liens externes que je ne vois pas d'ici.
- **Onglets de configuration par client MCP** dans `docs/automation/mcp-server` : pas faits. L'app génère elle-même la configuration exacte ; je n'ai pas voulu inventer des fichiers de config que je ne peux pas vérifier.
- **Hero** : toujours la capture sombre, même sur page claire. Une seule image prioritaire, donc meilleur LCP. Les captures claires existent si tu changes d'avis.
- **Blog, changelog, plugins** : passés en revue, laissés tels quels. Ils sont sobres et cohérents ; le changelog affiche des versions, c'est son rôle. Même chose pour la version affichée sur `/download`.
- **Film** : la scène échoue si elle tourne après les autres dans la même passe (timeout, cause non identifiée). Contournement en place : elle passe en premier.
- **Captures Pro supplémentaires** (diff visuel, fédération, Time-Travel, masquage) : inutiles finalement, `public/images/features/` contient déjà de vraies captures desktop en 2000 px, maintenant utilisées sur `/features`.

---

## Fait dans cette passe

**Médias** — captures 2880 px clair + sombre (requête, table, diagramme ER, bac à sable, garde-fou production), film 1920 px avec curseur, jeu de données fictif de 6 tables. Pipeline documenté dans `scripts/showcase-media/README.md`.

**Accueil** — hero refait (capture entière qui déborde à droite, fond travaillé, ornements supprimés), signature « cellule sélectionnée » (`.q-cell`), preuve sociale GitHub réelle (étoiles, téléchargements, licence), mur des 34 moteurs cliquables, figures recadrées par point focal, rangée « Fonctionnalités phares », section MCP sombre avec échange d'agent simulé, offres et FAQ en cartes, CTA centré. Plus aucun filet décoratif, numérotation ou `FIG.`.

**Textes** — sous-points et légendes supprimés, 27 clés mortes retirées × 7 langues, phrase creuse de Team remplacée, mentions « v0.1.39 » retirées de 58 pages de doc et des 7 fichiers de langue.

**Autres pages** — `/features` en cartes illustrées, image pleine largeur sur les pages de détail, FAQ de `/pricing` et étapes de `/download` en cartes.

**Doc** — sidebar en groupes repliables avec page active ramenée dans la vue, index en cartes, bouton copier sur les blocs de code, grille de logos sur « Bases de données prises en charge » (même source que l'accueil : `lib/databases.ts`), code inline sans bordure, fil d'Ariane sans soulignement, chevrons du menu mobile corrigés.

**Ménage** — 13 composants morts supprimés, carrousel de bases et son JS supprimés, affiche de la vidéo sans faux curseur.

**Vérifié** — TypeScript passe ; rendu contrôlé en français (clair, sombre, mobile) et hero contrôlé en anglais, allemand, espagnol, italien, japonais ; aucun débordement horizontal. Les erreurs Biome restantes sont dans des fichiers non touchés (`components/ui/*`, `app/[locale]/i18n.ts`, pages légales, 3 composants de doc).

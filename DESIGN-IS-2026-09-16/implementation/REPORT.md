# Refonte QoreDB Showcase — livraison locale

16 septembre 2026 · Branche `codex/showcase-precision` · Implémentation du plan approuvé, sans publication.

## Résultat

La vitrine adopte la direction « instrument de précision » : hero asymétrique, titres plus affirmés, grille et filets nets, violet réservé aux actions et repères, captures réelles avec cadrages et légendes dédiés. Le récit de l’accueil privilégie trois situations de travail, puis MCP, les offres et les questions essentielles. La capture mobile est lisible dès le premier écran : 265 px visibles à 390 × 844.

La déclinaison couvre les thèmes clair/sombre, la navigation, le footer, les sept langues, le téléchargement, les tarifs, la documentation mobile, les fonctionnalités, les plugins et l’alignement du blog. Les sections éditoriales de l’accueil sont rendues côté serveur et restent visibles sans JavaScript. Les captures existantes ne sont pas présentées comme celles de la dernière version du logiciel.

Les modèles commerciaux et destinations existants sont conservés : Pro en achat unique, Team annuel par siège, Windows Store, macOS Intel/ARM et formats Linux. Recherche documentaire : clavier, focus, reprise après erreur, URLs normalisées et repli anglais fonctionnel. Les écarts de licence et de confidentialité ont été vérifiés contre les capacités du logiciel.

## Aperçus

- [Accueil desktop clair](production/home-light-1440.png), [sombre](production/home-dark-1440.png).
- [Accueil mobile clair](production/home-light-390.png), [sombre](production/home-dark-390.png).
- [Accueil complet](production/home-light-1440-full.png).
- [Téléchargement mobile](production/download-dark-390.png), [tarifs mobile](production/pricing-light-390.png), [documentation desktop](production/docs-light-1440.png).
- [Blog avec images CDN](production/blog-index-cdn-1440.png), [article long mobile](production/blog-article-cdn-390.png).

Les captures de production montrent le rendu final ; les fichiers de prototype et les captures de développement dans le dossier parent restent des références intermédiaires.

## Performances mesurées

Même Chrome 152 et protocole local que l’audit initial : serveur de production local chaud, cache navigateur désactivé, nouveau contexte par essai, requêtes tierces bloquées, mesure au chargement + 3 secondes. Pour les trois essais mobiles : 390 × 844, DPR 1, CPU ×4, débit descendant 200 000 octets/s, montant 93 750 octets/s, latence configurée 150 ms. Les mesures ne décrivent pas les performances terrain du site public.

| Mesure | Avant | Après | Bilan |
| --- | ---: | ---: | --- |
| JavaScript initial, corps encodé des scripts du HTML initial | 350 774 octets | 279 729 octets | −20,3 % ; budget ≤300 Kio respecté, cible ambitieuse 250 Kio non atteinte |
| JavaScript au démarrage desktop, préchargements compris | 500 007 octets | 336 107 octets | −32,8 % ; budget −25 % respecté |
| JavaScript au démarrage mobile | 358 434 octets | 299 688 octets | −16,4 % |
| Ressources initiales hors document, desktop / mobile | 92 / 63 | 55 / 34 | Moins de requêtes |
| Logos de bases au démarrage desktop | 218 392 octets | 0 | Bandeau typographique, liste complète accessible en documentation |
| Animations décoratives permanentes sur l’accueil | 2 | 0 | Y compris préférence de mouvement réduit |
| LCP mobile simulé, médiane de trois essais | 1,264 s | 2,132 s | Régression de 68,7 % ; budget de non-régression non atteint |
| Décalages de mise en page au chargement mobile simulé | 0 | 0 | Aucun décalage observé dans cette fenêtre de mesure |

**Le LCP n’a pas été amélioré.** Dans l’ancien écran il correspondait au titre ; la grande capture désormais visible devient l’élément LCP. Les trois valeurs finales sont 2,136 / 2,104 / 2,132 s. La capture est découverte tôt et prioritaire ; les preuves suivantes ont une priorité basse. Réduire artificiellement sa taille déclarée aurait flouté le texte recadré. Le compromis de lisibilité est conservé et cet écart est explicite, malgré les gains de JavaScript et de requêtes. Une mesure publique après déploiement reste nécessaire avant toute conclusion sur les Web Vitals terrain.

Les gains proviennent du rendu serveur de l’accueil, du retrait des effets, du fournisseur de téléchargement limité à sa page, de préchargements ciblés et du retrait de Framer Motion de la seule confirmation de newsletter. Les variantes d’images distinguent aussi correctement les sources PNG/WebP homonymes et produisent des tailles adaptées aux petites icônes.

[Mesures brutes finales](production/performance.json) · [Mesures initiales](../runtime.json) · [Protocole initial ralenti](../throttled.json).

Pour reproduire après un build et démarrage sur le port 3101, sans autre test lourd en parallèle :

```bash
REVIEW_MEASURE_ONLY=1 node DESIGN-IS-2026-09-16/implementation/measure-production.cjs
```

Le script utilise les fichiers du projet, bloque les mutations et les requêtes tierces, conserve le même navigateur et écrit les mesures dans `implementation/production/`. Le JavaScript initial est identifié depuis le HTML de la réponse, car le DOM inspecté après chargement contient aussi les scripts des destinations préchargées.

## Vérification

- **52 scénarios distincts validés, aucun ignoré** : sept langues, responsive, navigation, thèmes, SEO ciblé, absence de JavaScript, mouvement réduit, téléchargement, recherche réelle et simulée, checkout simulé et fixtures commerciales. Le rapport précise les reprises, sans les présenter comme un second passage complet.
- **Dernier build : 2/2 reprises ciblées accueil FR et Pagefind réel**, après le retrait final de l’animation de newsletter ; commande normale TypeScript également réussie.
- **3/3 tests du générateur d’images** et **3/3 fixtures SSR Team** réussis.
- **28 vues** sur sept parcours, mobile/desktop, clair/sombre : aucun débordement horizontal ni exception navigateur. Passage supplémentaire blog/article avec CDN Sanity autorisé : quatre vues sans image cassée.
- Images → TypeScript → `build:next` → `build:search` réussis. La dernière compilation produit 405 pages statiques. `build:stats` n’a pas été exécuté : les statistiques GitHub n’ont pas été rafraîchies.
- Biome ciblé sur les composants et modules nouveaux réussit. Le contrôle agrégé reste en erreur sur **six diagnostics HTML préexistants**, documentés dans le rapport ; aucun nouveau diagnostic n’a été laissé. `git diff --check` réussit.

[Rapport détaillé et commandes](../../doc/SHOWCASE_VERIFICATION.md) · [52 résultats consolidés](verification/report.json) · [Reprises du dernier build](verification/build-3/report.json).

## Limites

L’environnement local n’a pas les identifiants de prix Stripe : le build emploie les fallbacks existants. Les succès/erreurs checkout et branches Team sont validés avec des données synthétiques ; aucun paiement, inscription, téléchargement d’installeur ou envoi de formulaire réel n’a été effectué. Les avertissements de build sur le traçage de fichiers du sitemap et le `localStorage` expérimental de Node sont conservés.

Les titres Markdown de certaines notes de version produisent plusieurs `h1` sur le changelog, défaut préexistant conservé et signalé. Le travail ne certifie ni le rendu avec lecteur d’écran, ni un téléphone physique, ni la qualité native des sept traductions, ni les métriques P75/INP terrain. Les parcours Team authentifiés et les services de paiement réels n’ont pas été validés.

Le site n’a pas été déployé. Les modifications et preuves restent locales et révisables.

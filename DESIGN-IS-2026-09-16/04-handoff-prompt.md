```text
/make-plan Recomposer QoreDB Showcase sur la base d’un audit Dieter Rams de 13/30, avec lacunes de hiérarchie, précision éditoriale et soin du détail.

Verdict :
> REDESIGN — recomposer le récit et la direction artistique de la vitrine autour de QoreDB comme instrument de précision, en conservant la marque et les fondations techniques existantes.

Pourquoi : total inférieur à 20/30 ; les preuves spécifiques au produit sont placées après un catalogue très long, et des promesses globales sont contredites ailleurs. Une retouche de couleurs conserverait ces problèmes.

Utilisateur principal : développeur produit indépendant ou petite équipe.
Objectif : comprendre le client desktop SQL/NoSQL, vérifier sa base et télécharger ; évaluer Pro/Team ensuite.
Repo : /home/raphael/dev/perso/QoreDB-showcase.
Contraintes : conserver Next.js 16.2.10, React, Tailwind, i18n sept locales, thèmes, SEO et parcours de téléchargement/paiement ; aucune modification commerciale ou de licence implicite.

À préserver : logo et violet QoreDB (doc/VISUAL_FOUNDATION.md), captures authentiques (components/landing/hero.tsx:135), loader WebP/CDN (lib/sanity/imageLoader.ts:14), metadata et locales (app/[locale]/layout.tsx, lib/locale.ts), prix et plateformes depuis leurs sources existantes.
À remplacer : hero principalement centré/décoratif (hero.tsx:25), grille exhaustive de 16 cartes avant les preuves (features-section.tsx:101, page.tsx:189), animations permanentes (hero.tsx:66), navigation footer /marketplace cassée (lib/footer-links.ts:15).

Mouvements prioritaires :
1. **Utilité et compréhension (#2/#4)** — Montrer une tâche réelle dans le premier écran, puis trois preuves de travail avant le catalogue. Preuve : E1/E2, hero à y826 desktop et y808 mobile.
2. **Esthétique et discrétion (#3/#5)** — Construire une composition éditoriale asymétrique, une typographie franche et un accent rare ; retirer halos, hachures et brillance permanente. Preuve : E1/E3, hero et tokens concurrents.
3. **Honnêteté (#6)** — Aligner capacités, niveaux Core/Pro/Team, confidentialité et provenance des chiffres avant de réécrire les promesses. Preuve : E4, contradictions de textes et snapshot daté.
4. **Sobriété des ressources (#9)** — Réserver le JavaScript aux interactions utiles, adapter les petits assets et supprimer les mouvements au repos. Preuve : E5, 350 774 octets JS initial encodés et deux shimmers persistants.
5. **Soin du détail (#8)** — Uniformiser contrastes, focus et états de récupération ; réparer les liens et l’accès mobile à la documentation. Preuve : E2/E3/E6, 404 confirmée et recherche masquée.

Direction : instrument de précision, grille asymétrique 5/7, titres droits, violet rare, filets nets, captures lisibles et annotées ; zéro mouvement décoratif au repos. Récit : hero/produit → compatibilités compactes → trois tâches réelles → automatisation/confiance → offres → questions et téléchargement.

Livrer : architecture de contenu, wireframes desktop/mobile, tokens et états, phases avec fichiers et patterns locaux, critères d’acceptation et budgets réseau. Démarrer par la composition haute fidélité du hero/première preuve, clair/sombre et desktop/mobile. Conserver les ancres #features, #preview, #mcp, les URL et les parcours existants ; prévoir recette et retour arrière par artefact de déploiement.

Mesures de départ : produit à y826 desktop/y808 mobile ; 350774 octets de JS initial encodé, 1212354 décodé ; 2 shimmers permanents même avec reduced-motion. LCP médian local simulé 1,264 s, pas une mesure terrain. Cibles proposées : JS de route ≤300 Kio encodés, zéro animation permanente, preuve utile avant le premier scroll, P75 terrain LCP≤2,5 s / INP≤200 ms / CLS≤0,1.

Ne pas conserver l’ancien catalogue sous une nouvelle couche de style. Ne pas inventer de benchmark, témoignage, niveau Core/Pro ni capacité. Ne pas confondre import dynamic et chargement reporté au scroll. Le présent audit et le plan demandé n’autorisent pas une publication.
```

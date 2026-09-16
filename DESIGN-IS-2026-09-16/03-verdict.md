# Verdict

**REDESIGN — recomposer le récit et la direction artistique de la vitrine autour de QoreDB comme instrument de précision, en conservant la marque et les fondations techniques existantes.**

L’audit heuristique atteint 13/30. Ajouter une couche de finition à la composition actuelle conserverait la priorité donnée au catalogue et aux ornements. Le changement doit porter sur la place de la preuve produit, la hiérarchie des messages et le système visuel. L’accueil reste fonctionnel, lisible et correctement construit : ce verdict ne signifie pas que le site est « raté ».

À préserver : logo et accent QoreDB ; modes clair/sombre/système ; vraies captures ; routes, traductions et SEO ; compatibilités et distinctions commerciales vérifiées ; loader responsive et distribution existante. Sources : `doc/DESIGN_SYSTEM.md`, `app/[locale]/layout.tsx`, `lib/sanity/imageLoader.ts`, `lib/locale.ts`.

À remplacer : hero principalement centré et décoratif (`hero.tsx:25`), séquence catalogue avant preuve (`page.tsx:189`), cartes uniformes avec survol sans action (`features-section.tsx:101`), empilement d’effets permanents (`hero.tsx:66`). Ces structures expliquent les scores faibles en esthétique, discrétion et économie de moyens.

Les cinq mouvements prioritaires, repris dans le plan :

1. **Utilité et compréhension (#2/#4)** — Montrer une tâche réelle dans le premier écran, puis trois preuves de travail avant le catalogue. Preuve : E1/E2, hero à y826 desktop et y808 mobile.
2. **Esthétique et discrétion (#3/#5)** — Construire une composition éditoriale asymétrique, une typographie franche et un accent rare ; retirer halos, hachures et brillance permanente. Preuve : E1/E3, hero et tokens concurrents.
3. **Honnêteté (#6)** — Aligner capacités, niveaux Core/Pro/Team, confidentialité et provenance des chiffres avant de réécrire les promesses. Preuve : E4, contradictions de textes et snapshot daté.
4. **Sobriété des ressources (#9)** — Réserver le JavaScript aux interactions utiles, adapter les petits assets et supprimer les mouvements au repos. Preuve : E5, 350 774 octets JS initial encodés et deux shimmers persistants.
5. **Soin du détail (#8)** — Uniformiser contrastes, focus et états de récupération ; réparer les liens et l’accès mobile à la documentation. Preuve : E2/E3/E6, 404 confirmée et recherche masquée.

Direction retenue : **l’instrument de précision**. La singularité vient de la grille, du cadrage de l’application et de détails utiles tirés du produit : numérotation des étapes, annotations, colonnes alignées, séparateurs nets. Le mouvement ponctuel accompagne une action ou explique une transition ; il n’est pas le support de l’identité.

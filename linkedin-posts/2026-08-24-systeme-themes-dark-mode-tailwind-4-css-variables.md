# Post LinkedIn

Le système de thèmes de QoreDB tient sur trois briques.

Un hook React qui expose une préférence (light / dark / auto) et un thème effectivement résolu, distincts pour éviter les ambiguïtés.

Deux blocs CSS qui déclinent une palette complète de variables préfixées --q-* (fonds, textes, accents, sémantiques, environnements Dev/Staging/Prod).

Un pont déclaratif vers Tailwind 4 via @theme et @custom-variant dark, pour que bg-background et text-foreground fassent le bon rendu dans les deux modes sans code additionnel.

La synchronisation entre fenêtres passe par un CustomEvent qoredb:theme-changed et l'événement storage standard. Zéro polling, zéro reload, un changement dans les réglages se propage instantanément.

Pas de theme editor, pas de palette personnalisable : deux palettes calibrées à la main, pour une cohérence prévisible sur des heures d'usage quotidien.

#QoreDB #OpenSource #Tailwind #React #Rust #DarkMode

---

# Commentaire

L'article complet, avec l'implémentation détaillée du hook useTheme et l'intégration Tailwind 4 :

https://www.qoredb.com/fr/blog/systeme-themes-dark-mode-tailwind-4-css-variables

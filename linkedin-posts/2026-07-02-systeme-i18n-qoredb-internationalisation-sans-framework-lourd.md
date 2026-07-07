# Post LinkedIn

QoreDB est disponible dans neuf langues d'interface, sans backend de traduction ni framework maison.

Le dispositif tient dans un module de 60 lignes : i18next, react-i18next, un détecteur de langue, et neuf fichiers JSON embarqués au build. Rien de plus.

La détection suit une chaîne explicite : querystring `?lang=fr`, puis localStorage, puis navigator, avec fallback sur l'anglais. Le changement de langue en cours de session passe par un simple `i18n.changeLanguage()`, sans rechargement.

Pas de génération de types depuis les JSON, pas d'ICU MessageFormat, pas de service de traduction managé. Le vocabulaire d'un client de BDD est spécialisé mais fini, et ouvrir un JSON reste la manière la plus accessible de contribuer une traduction.

C'est cohérent avec le reste : préférer une pile éprouvée à une abstraction ambitieuse qui coûterait à maintenir.

#QoreDB #OpenSource #i18n #React #Tauri #DevTools

---

# Commentaire

L'article complet, avec le détail de la configuration i18next et la structure des fichiers de traduction :
https://www.qoredb.com/fr/blog/systeme-i18n-qoredb-internationalisation-sans-framework-lourd

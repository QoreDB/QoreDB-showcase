# Revue indépendante — signature visuelle et démonstration

Revue du 16 septembre 2026. Le relecteur a produit les médias mais n'a pas
implémenté les composants frontend examinés. Périmètre : hero, bandeau des
bases, styles home, première preuve produit, lecteur de démonstration,
styles du lecteur et chaînes `home.demo` dans les sept langues.

## Lecture du code et fidélité au produit

Aucun problème bloquant identifié dans le code examiné.

- La hero utilise une vraie capture QoreDB 0.1.39. Les sept textes alternatifs
  indiquent correctement SQLite. Le recadrage conserve la requête et les
  résultats ; le lien adjacent donne accès à l'image complète.
- Les cinq logos de bases sont accompagnés de leurs noms visibles. Leur
  texte alternatif vide évite la répétition pour les lecteurs d'écran.
- Le label `00:23` correspond à la durée mesurée de 22,72 secondes.
- Le déroulé traduit décrit exactement la connexion, la requête SELECT,
  Atlas (128), Forma (96), Prism (84), Tempo (72), puis le brouillon UPDATE.
  Il ne présente pas ce brouillon comme une démonstration de Sandbox Pro.
- L'UPDATE n'a pas été exécuté pendant l'enregistrement : la base synthétique
  conserve Orbit avec le statut `review`. Les anciennes captures Sandbox
  et sécurité restent des médias distincts, sans nouvelle attribution de version.
- Le HTML initial du lecteur ne comporte pas de source vidéo. La source est
  attachée dans le geste d'activation, avec `preload="none"`, puis les
  contrôles natifs deviennent visibles. L'affiche est une image différée.
- L'activation possède un vrai lien MP4 ; le déroulé est un `details` natif.
  Ces alternatives restent disponibles sans JavaScript.
- Le lecteur transfère le focus, annonce chargement et erreur, fournit une
  nouvelle tentative et conserve l'accès direct au fichier. Les anciennes
  promesses `play()` sont ignorées lorsqu'une nouvelle tentative existe.
- Les ornements sont des SVG/CSS statiques masqués aux technologies
  d'assistance ; aucune boucle décorative n'a été ajoutée.

## Vérification navigateur

**23 scénarios réussis, 0 échec, 0 ignoré**, sur le serveur de production
reconstruit `http://127.0.0.1:3101`, après la fin du benchmark de performance.
Rapport détaillé : [smoke/report.json](smoke/report.json).

Commande exécutée depuis le dépôt showcase :

```bash
SHOWCASE_BASE_URL=http://127.0.0.1:3101 \
SHOWCASE_OUTPUT=DESIGN-IS-2026-09-16/implementation/signature-v2/verification/smoke \
SHOWCASE_SCENARIOS='home-|layout-|demo-|preferences-route' \
node scripts/smoke-showcase.mjs
```

Couverture effective :

- Accueil dans les sept langues : un seul `main`, un seul `h1`, ancres et
  téléchargement conservés, pas de clé brute ni section invisible. À
  390 × 844, 265 px de capture produit sont visibles dans les sept langues.
- Dix configurations de mise en page : 320, 768, 1024, 1440 et 1920 px,
  en clair et sombre, sans débordement horizontal.
- Accueil sans JavaScript et préférence de réduction des mouvements :
  contenu visible, zéro animation infinie.
- Préférences : langue et thème conservés lors de la navigation.
- Vidéo réellement hydratée : aucune requête vidéo avant activation,
  même après défilement jusqu'au lecteur ; Entrée déclenche la lecture,
  le focus passe au lecteur natif, Espace suspend puis reprend la lecture.
  Durée lue : 22,72 s. Fin sans boucle, contrôles natifs et `playsInline` actifs.
- Une réponse MP4 503 simulée déclenche le message d'erreur ; Réessayer
  charge ensuite le vrai MP4 local et la lecture reprend.
- Sans JavaScript : lien MP4 disponible (réponse 200, type `video/mp4`) et
  déroulé textuel ouvrable avec le composant `details` natif.

Le smoke n'a relevé aucune erreur navigateur inattendue. La capture finale
[demo-playback-keyboard.png](smoke/demo-playback-keyboard.png) a été inspectée :
le lecteur intégré et le déroulé sont bien affichés dans la page du site,
et non dans le lecteur de fichier autonome du navigateur.

## Limites

Chrome Linux automatisé est le navigateur disponible pour cette vérification.
Safari/iOS réels, lecteur d'écran et données terrain ne sont pas couverts.
Les parcours checkout et paiement n'ont pas changé dans cette phase et ne
font pas partie de cette nouvelle passe ciblée.

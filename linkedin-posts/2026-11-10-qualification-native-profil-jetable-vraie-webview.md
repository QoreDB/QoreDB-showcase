# Post LinkedIn

Nos tests navigateur montent les vrais composants de QoreDB dans Playwright. Ils ne prouvent rien sur la WebView native.

Sur Linux, QoreDB tourne dans WebKitGTK, pas dans Chromium. Les credentials passent par le keyring du système. Le driver SQLite ouvre un vrai fichier. Entre la fixture et le binaire installé, il reste un écart.

J'ai donc ajouté une qualification native : un script Python génère un profil utilisateur jetable complet (répertoires XDG, SQLite de fixture, connexions, carnet, journal Time Travel), au format d'une version antérieure pour tester la migration. Le lanceur bash n'isole pas l'application, il isole sa session : bus D-Bus dédié, keyring dédié, répertoires XDG redirigés. Le secret est donc lu par le vrai chemin de production, pas par une map en mémoire derrière un flag de test.

Le pilotage passe par l'inspecteur WebKitGTK publié sur la loopback. Un client WebSocket de 60 lignes évalue du JavaScript dans la vraie WebView, et chaque scénario commence par refuser de tourner ailleurs : hash du fixture vérifié, chemin du workspace vérifié, connexion non-fixture rejetée.

Le scénario de grille sème 100 000 lignes, scrolle, puis enchaîne 30 éditions en place en vérifiant à chaque passe que la position de scroll, le nombre de lignes chargées et la sélection n'ont pas bougé. Ce genre de défaut, aucun test unitaire ne le voit.

#QoreDB #OpenSource #Rust #Tauri #Testing #WebKit

---

# Commentaire

J'ai détaillé le profil jetable, l'isolation de session et le client inspecteur dans l'article, avec le code des scripts.

https://www.qoredb.com/fr/blog/qualification-native-profil-jetable-vraie-webview

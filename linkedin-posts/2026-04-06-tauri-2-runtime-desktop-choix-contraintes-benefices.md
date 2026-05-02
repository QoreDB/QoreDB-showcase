# Post LinkedIn

Quand on construit un client de base de données desktop, il faut choisir un runtime.

J'ai choisi Tauri 2 plutôt qu'Electron. Le binaire QoreDB fait quelques mégaoctets. Un équivalent Electron pèse facilement 150-200 MB - parce qu'Electron embarque Chromium et Node.js entiers dans chaque distribution.

Tauri délègue le rendu à la WebView native du système : WKWebView sur macOS, WebView2 sur Windows, WebKitGTK sur Linux. Rien de bundlé, rien de superflu.

La communication entre le frontend React et le backend Rust passe uniquement par l'IPC de Tauri. Chaque commande Rust est annotée `#[tauri::command]`, listée explicitement dans le builder, sérialisée via Serde. Côté TypeScript, c'est une fonction typée avec sa signature complète. Vérification statique de bout en bout.

Côté sécurité, aucun port HTTP n'est ouvert. Le backend n'est pas accessible depuis le réseau, uniquement via le canal `ipc://` interne. Le CSP de la WebView bloque les scripts et connexions non déclarés. Les mises à jour sont vérifiées avec une signature `minisign` avant application.

C'est un runtime adapté à un outil local-first : léger, sans surface d'attaque réseau, et cohérent avec l'objectif de ne pas envoyer de données quelque part.

L'article détaille l'architecture concrète : IPC, managed state partagé via `Arc<Mutex<AppState>>`, plugins, et quelques adaptations de plateforme (notamment un bug WebKitGTK sur AMD/Linux qu'il a fallu contourner).

#QoreDB #OpenSource #Rust #Tauri #DesktopApp

---

# Commentaire

Article complet sur l'architecture Tauri 2 dans QoreDB :
https://www.qoredb.com/fr/blog/tauri-2-runtime-desktop-choix-contraintes-benefices

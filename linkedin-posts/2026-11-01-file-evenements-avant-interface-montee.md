# Post LinkedIn

Dans QoreDB, plusieurs tâches de fond démarrent avant que l'interface existe : l'hôte de plugins, le watcher de workspace, l'interceptor de requêtes, le Query Replay Lab.

Elles émettent toutes des événements vers le webview. Le souci, c'est qu'un événement qui arrive pendant la création ou le rechargement du webview peut faire paniquer tauri-runtime-wry sur un emprunt réentrant (issue tauri-apps/tauri#8177). Crash au démarrage, non déterministe, surtout visible sur machine lente.

J'ai écarté l'idée de forker la couche runtime de Tauri : un patch comme celui-là suit la cadence de Tauri, pas la mienne.

À la place, cent lignes de Rust. Un gate qui tamponne les événements dans une VecDeque bornée à 512 entrées tant que le frontend n'a pas signalé qu'il était monté, puis les draine dans l'ordre. Le test du drapeau et la mise en tampon se font sous une seule prise de mutex, sinon un drainage concurrent peut laisser un événement dans une file que plus personne ne vide.

Côté React, un hook qui signale true au montage et false sur beforeunload, ce qui couvre aussi le hot reload.

Résultat : une condition de course remplacée par une règle lisible. Rien ne part vers le webview avant que le webview l'ait demandé.

#QoreDB #OpenSource #Rust #Tauri #Concurrency #DesktopApp

---

# Commentaire

Le détail du mécanisme est expliqué ici, avec la discipline de verrou et le choix d'émettre vers une fenêtre nommée plutôt que de diffuser :

https://www.qoredb.com/fr/blog/file-evenements-avant-interface-montee

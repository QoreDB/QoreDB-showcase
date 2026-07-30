# Post LinkedIn

Un client de base de données desktop, ce n'est pas juste une jolie interface au-dessus d'un pilote SQL.

C'est un processus qui garde plusieurs pools de connexions ouverts, qui streame des résultats de plusieurs moteurs à la fois, qui manipule des tampons volumineux, et qui doit rester réactif quand l'utilisateur annule un COUNT(*) sur cent millions de lignes.

C'est du code système. Pour QoreDB, j'ai choisi Rust avec Tauri 2, et j'ai pris le temps d'expliquer pourquoi dans un article:

- sécurité mémoire sans GC, donc pas de pauses imprévisibles pendant un stream ou un export
- async natif via tokio, avec sqlx, mongodb, tiberius et redis nativement async
- FFI stable pour intégrer DuckDB, keyring OS et autres libs C sans coller un runtime managé
- intégration directe avec Tauri, sans sous-processus ni RPC intermédiaire

Le prix, c'est une courbe d'apprentissage plus raide. Sur un logiciel qu'on va lire et modifier pendant des années, ça se rembourse vite.

#QoreDB #OpenSource #Rust #Tauri #DatabaseTools #SoftwareArchitecture

---

# Commentaire

Article complet ici, avec les choix de crates (sqlx, tokio, mimalloc, arrow) et la découpe du workspace Cargo:

https://www.qoredb.com/fr/blog/pourquoi-rust-backend-client-base-donnees

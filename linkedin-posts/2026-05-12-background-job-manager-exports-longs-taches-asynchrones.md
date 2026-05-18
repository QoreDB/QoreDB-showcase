# Post LinkedIn

Quand on lance un export Parquet de plusieurs gigaoctets ou un pg_dump complet depuis un client desktop, deux choses doivent rester vraies : l'interface ne doit pas geler, et l'utilisateur doit pouvoir annuler à tout moment sans corrompre l'état.

Dans QoreDB, j'ai construit un Background Job Manager simple mais rigoureux autour de tokio.

Chaque job est isolé via tokio::spawn, possède son propre CancellationToken, et émet un flux d'événements de progression via Window::emit. Les exports utilisent un canal mpsc avec throttling à 250 ms. Les sauvegardes pilotent un binaire externe (pg_dump, mysqldump) en relayant stdout et stderr ligne par ligne.

L'annulation est coopérative : token déclenché, driver.cancel envoyé au moteur, flush et finalisation du writer, désinscription du registre. Le fichier partiel reste exploitable.

Pas de queue distribuée, pas de persistance disque, pas de reprise après crash. C'est un design pensé pour le desktop mono-utilisateur, et cette simplicité est ce qui rend l'annulation fiable et le feedback instantané.

#QoreDB #OpenSource #Rust #Tauri #AsyncProgramming #DatabaseTools

---

# Commentaire

L'article complet, avec les détails d'implémentation (CancellationToken, ActiveBackups, throttling de progression) :

https://www.qoredb.com/fr/blog/background-job-manager-exports-longs-taches-asynchrones

# Post LinkedIn

J'ai écrit aujourd'hui sur le Sandbox Mode de QoreDB.

L'idée : quand on travaille sur une base existante et qu'on veut corriger des données ou en restructurer une partie, on est souvent coincé entre deux modes. Soit on édite à la main dans la grille (rapide, mais on touche la base direct). Soit on écrit un script SQL à part (propre, mais déconnecté de l'exploration).

Le sandbox comble ce trou. On active le mode, on modifie comme d'habitude dans le data grid, mais rien ne part au serveur. Les changements (insert/update/delete) s'accumulent localement dans un store frontend. À la fin, on prévisualise le SQL généré (spécifique au driver actif), on l'inspecte, et on applique tout en une transaction.

Côté backend Rust, deux commandes Tauri : generate_migration_sql et apply_sandbox_changes. Si une opération échoue à l'apply, rollback automatique et le sandbox reste intact pour itérer. Indicateur visuel coloré selon l'environnement (bleu/orange/rouge) pour ne jamais confondre une modif de dev avec une modif de prod.

Pas un remplaçant des migrations versionnées, mais un atelier de préparation entre l'édition cellule par cellule et le script SQL séparé.

#QoreDB #OpenSource #Rust #Tauri #DevTools #DatabaseTooling

---

# Commentaire

Article complet ici, avec les détails sur la génération du script multi-driver et la gestion transactionnelle :

https://www.qoredb.com/fr/blog/sandbox-mode-tester-modifications-sans-toucher-base

# Post LinkedIn

J'ai intégré SQL Server dans QoreDB sans passer par ODBC ni par un binding C.

Le stack complet est Rust :
- Tiberius pour le protocole TDS, en pur Rust
- bb8 + bb8_tiberius pour le pool de connexions async
- OFFSET / FETCH NEXT pour la pagination (pas de réécriture en TOP ou ROW_NUMBER)
- KILL <spid> pour l'annulation, avec un suivi QueryId vers SPID

Trois modes d'auth : SQL password, Windows NTLM (Windows only, vérifié à la compilation), Windows Integrated. Le binaire Tauri reste portable sans dépendre d'un driver manager côté OS.

C'est la même logique que pour PostgreSQL et MySQL : on respecte la grammaire native du moteur au lieu d'inventer une couche d'émulation par-dessus.

#QoreDB #OpenSource #Rust #SQLServer #DatabaseTools #Tauri

---

# Commentaire

L'article détaille les choix techniques, le pattern de pool, la gestion des transactions et l'annulation comparée à PG/MySQL/MongoDB.

https://www.qoredb.com/fr/blog/driver-sql-server-tiberius-pool-pagination

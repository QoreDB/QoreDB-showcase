# Post LinkedIn

SQL Server n'est plus un univers Windows-only depuis longtemps, mais se connecter à une instance depuis macOS ou Linux reste un sujet où chacun a sa recette.

J'ai écrit un tour d'horizon des options disponibles en 2026 :

- sqlcmd via Docker pour le terminal
- Azure Data Studio pour qui vit dans l'écosystème Microsoft (SQL auth, NTLM, Kerberos, AAD)
- DBeaver et DataGrip via le driver mssql-jdbc (uniformité multi-bases, mais JVM)
- QoreDB avec Tiberius en pur Rust, sans JVM ni ODBC

Côté authentification, je détaille SQL Auth, Windows NTLM (DOMAIN\user), Windows Integrated via Kerberos (kinit + krb5.conf) et Azure Active Directory. Et bien sûr le scénario qui tombe toujours : l'instance derrière un bastion SSH.

L'angle technique : pourquoi un driver TDS natif Rust simplifie la vie quand on jongle entre SQL Server, PostgreSQL et MongoDB sur un même poste.

#QoreDB #OpenSource #SQLServer #Rust #DevTools #Database

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/connecter-sql-server-macos-linux-2026

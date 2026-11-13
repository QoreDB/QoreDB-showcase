# Post LinkedIn

Quand QoreDB ouvre un tunnel SSH vers une base derrière un bastion, il y a deux façons de s'authentifier : lire le fichier de clé privée, ou ne jamais y toucher et laisser un agent signer.

J'ai ajouté le second mode, et ce qui est intéressant c'est ce qu'il retire du code plutôt que ce qu'il ajoute.

La variante d'énumération correspondante n'a aucun champ. Pas de chemin, pas de passphrase. Donc rien à écrire dans le vault, rien à sérialiser vers le frontend, rien à masquer dans les logs.

Deux détails qui comptent en pratique :

- les identités d'un agent ne sont proposées que si IdentitiesOnly est désactivé et qu'aucun -i ne restreint les candidats. L'absence d'argument est le comportement voulu, et un test le verrouille.

- une app desktop lancée depuis une icône n'hérite pas forcément de SSH_AUTH_SOCK. QoreDB vérifie la variable avant de spawn ssh, pour échouer sur une cause locale lisible au lieu d'un refus distant générique. Sous Windows le contrôle est passant : OpenSSH y retrouve l'agent par son pipe nommé.

Résultat : pour une clé protégée par passphrase, un ssh-add au login suffit. L'application ne voit jamais le fichier.

#QoreDB #OpenSource #SSH #Rust #Security #DevTools

---

# Commentaire

L'article détaille la construction de la ligne de commande OpenSSH, la vérification de l'agent et le filtrage du stderr remonté.

https://www.qoredb.com/fr/blog/authentification-agent-ssh-cle-privee-jamais-detenue

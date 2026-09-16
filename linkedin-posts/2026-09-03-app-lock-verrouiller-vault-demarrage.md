# Post LinkedIn

Le keychain de l'OS protège très bien un disque éteint. Beaucoup moins une session déjà ouverte.

C'est le trou que le App Lock de QoreDB vient boucher : un mot de passe maître, hashé en Argon2id avec le profil OWASP 2024 (m=64 MiB, t=3, p=1), stocké sous forme de chaîne PHC. Le mot de passe lui-même n'est écrit nulle part.

Le point de design qui compte : le verrou vit dans l'état Rust, pas dans un booléen React. Chaque commande Tauri qui touche à un secret consulte is_locked() avant de faire quoi que ce soit. Un écran de saisie se contourne en appelant la commande directement, une garde d'état ne se contourne pas.

Deux détails que j'aime bien :
- back-off exponentiel sur unlock, 250 ms qui doublent à chaque échec, plafonné à 30 s. Rendre le brute force inutile sans bannir quelqu'un qui hésite sur sa casse.
- séparation entre "vault ouvert" et "authentification récente". Lister des tables ne redemande rien. Lire un mot de passe de connexion en clair exige un déverrouillage de moins de 5 minutes.

Le format PHC permet aussi de durcir les paramètres Argon2 sans casser les hashes existants, puisque la vérification lit les params encodés dans le hash stocké.

#QoreDB #OpenSource #Rust #Security #Argon2 #Tauri

---

# Commentaire

J'ai détaillé le fonctionnement complet dans un article : mot de passe maître, back-off, fenêtre de ré-authentification et provider keychain.

https://www.qoredb.com/fr/blog/app-lock-verrouiller-vault-demarrage

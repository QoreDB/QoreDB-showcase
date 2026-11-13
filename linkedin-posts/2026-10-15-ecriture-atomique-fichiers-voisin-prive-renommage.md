# Post LinkedIn

Un client de base de données desktop écrit beaucoup de fichiers locaux : coffre de connexions, bibliothèque de requêtes, notebooks, exports. Aucun n'a de réplique ailleurs.

J'ai donc supprimé toute écriture directe dans QoreDB. Chaque sauvegarde crée un fichier voisin privé au nom UUID, ouvert en mode 0600 dès sa création, écrit les octets, synchronise, puis publie par un seul renommage.

Le détail qui compte : le commit ne supprime jamais la destination avant le renommage. Si le remplacement échoue, l'ancien contenu est toujours là, octet pour octet. Et un Drop nettoie le temporaire quand l'écriture est abandonnée.

Le plus dur n'était pas d'écrire ce mécanisme, mais de le prouver. Impossible de remplir un disque de façon déterministe, alors j'injecte les pannes IO en compilation de test à trois points : écriture partielle, synchronisation, juste avant publication. Un test de régression échoue sur l'ancienne implémentation à suffixe fixe, ce qui est la seule preuve qu'il mesure le bon bug.

#QoreDB #OpenSource #Rust #Tauri #DataIntegrity #SystemsProgramming

---

# Commentaire

J'ai détaillé le mécanisme complet dans un article : PendingOutput, rename vs hard_link, la commande Tauri qui réutilise les scopes de fs:write_text_file, et les tests par injection de pannes.

https://www.qoredb.com/fr/blog/ecriture-atomique-fichiers-voisin-prive-renommage

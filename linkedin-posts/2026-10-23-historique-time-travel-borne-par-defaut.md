# Post LinkedIn

Time Travel, dans QoreDB, écrit un journal local : un enregistrement JSONL par ligne modifiée, avec l'image avant et après.

Ce fichier ne se stabilise pas tout seul. Il grossit à chaque UPDATE, et ce qu'il contient, ce sont des données réelles de production sur le disque du développeur.

J'ai donc choisi de le borner par défaut, avec trois limites qui ne mesurent pas la même chose : 30 jours d'âge, 50 000 entrées, 500 Mio de volume. L'âge borne l'utilité, le nombre borne le coût de lecture, le volume borne l'empreinte disque. Mettre 0 partout reste possible, mais c'est une décision explicite.

Deux détails qui comptent plus qu'ils n'y paraissent :

Quand une limite est dépassée, la purge ne revient pas à la limite mais à 75 % de celle-ci. Sinon la capture suivante repasse au-dessus et on réécrit le fichier entier à chaque mutation.

Et la purge garde toujours un suffixe contigu du journal. Écarter un gros événement récent pour garder des états plus anciens ferait passer un état périmé pour le dernier état connu. Je préfère un journal vide à un journal qui ment.

Le tout est appliqué par une tâche qui tourne toutes les quinze minutes, même capture désactivée : un journal laissé tranquille un mois doit quand même se vider.

#QoreDB #OpenSource #Rust #DataPrivacy #LocalFirst #Databases

---

# Commentaire

Le détail du mécanisme est dans l'article : les trois bornes, la cible à 75 %, la réécriture atomique et ce qui se passe quand la config est illisible.

https://www.qoredb.com/fr/blog/historique-time-travel-borne-par-defaut

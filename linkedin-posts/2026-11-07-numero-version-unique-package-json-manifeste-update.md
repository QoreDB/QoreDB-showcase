# Post LinkedIn

Dans QoreDB, le numéro de version est écrit à neuf endroits : package.json, trois manifestes Cargo, Cargo.lock, la config Tauri, un manifeste MSIX, un PKGBUILD pour l'AUR, le tag Git et le manifeste d'update.

Une divergence entre ces endroits ne casse pas la compilation. Elle casse l'auto-update en production : l'updater compare les versions, et si l'une ment, la mise à jour devient invisible ou se propose en boucle.

J'ai donc traité la version comme une donnée dérivée d'une seule source. package.json est canonique, un script propage vers les manifestes Cargo en ne touchant que la ligne version de la section [package], et tauri.conf.json référence directement le fichier plutôt que d'en copier la valeur.

Le reste, c'est de l'échec bruyant au bon endroit : exit 1 si un manifeste Cargo a été restructuré, exception si le tag Git ne correspond pas à la version du paquet, erreur si la matrice de plateformes du manifeste d'update est incomplète.

Quelques centaines de lignes de Node et de Bash, aucun outil d'orchestration de release. Le vrai risque sur un desktop multi-plateformes n'est pas de manquer de features de release, c'est qu'un numéro diverge sans que personne le voie avant les premiers rapports utilisateurs.

#QoreDB #OpenSource #Rust #Tauri #DevOps #ReleaseEngineering

---

# Commentaire

J'explique la chaîne complète dans l'article, du bump au manifeste d'update, avec les invariants vérifiés à chaque étape.

https://www.qoredb.com/fr/blog/numero-version-unique-package-json-manifeste-update

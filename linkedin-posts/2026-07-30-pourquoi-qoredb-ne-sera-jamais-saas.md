# Post LinkedIn

Beaucoup de clients de base de données glissent vers le SaaS. QoreDB fait volontairement l'inverse.

Un client de BDD, ça manipule des credentials sensibles et des données que l'utilisateur n'a souvent pas le droit de faire transiter par un tiers. Dans un modèle SaaS, tout ce trafic passe par les serveurs de l'éditeur, ou par un proxy qu'il contrôle. La frontière de confiance se déplace, et l'utilisateur doit assumer un intermédiaire pour ses mots de passe, ses requêtes et ses résultats.

QoreDB reste desktop, local-first. Les credentials sont stockés dans le keychain système. Les drivers parlent directement à Postgres, MySQL, MongoDB, SQL Server, Redis, sans étage réseau intermédiaire. Aucun compte à créer, aucune activation en ligne. La collaboration passe par des exports HTML self-contained, Git ou du self-hosting, jamais par un plan de contrôle central.

Le SaaS n'est pas juste un mode de livraison, c'est une structure qui conditionne l'architecture, la sécurité et le modèle économique. Ce choix ne sera pas rejoué.

#QoreDB #OpenSource #LocalFirst #Database #Rust #Desktop

---

# Commentaire

L'article complet est ici :
https://www.qoredb.com/fr/blog/pourquoi-qoredb-ne-sera-jamais-saas

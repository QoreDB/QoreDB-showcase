# Post LinkedIn

Quand QoreDB plante, rien ne part de la machine.

Un client de base de données manipule des chaînes de connexion, des jetons, des chemins de clés privées. Un message de panic transporte le contexte de l'appel qui a échoué, donc potentiellement tout ça. Brancher un SDK de crash reporting là-dessus, je ne pouvais pas.

Du coup j'ai écrit le mécanisme à la main. Deux signaux : un hook de panic Rust qui chaîne le hook précédent pour ne pas changer la façon dont le processus meurt, et un marqueur de session supprimé à la sortie propre, qui permet de détecter au lancement suivant un kill forcé, un OOM ou une coupure de courant.

Le nettoyage des secrets se fait sur le chemin de lecture, pas à l'envoi. Identifiants dans les URI, affectations password / token / api_key, jetons Bearer, et la valeur de HOME remplacée par un tilde. Si le scrubbing était attaché à l'envoi, la prochaine sortie ajoutée serait celle qui oublie de l'appeler.

L'envoi, justement : un bouton qui ouvre une issue GitHub préremplie. L'utilisateur lit, complète, valide. Ou ferme l'onglet. C'est lui qui décide, parce qu'un rapport issu d'une base interne peut contenir des noms de tables qu'aucune regex ne saura classer comme sensibles.

#QoreDB #OpenSource #Rust #Observability #Privacy #LocalFirst

---

# Commentaire

Le détail du mécanisme est dans l'article : hook de panic, marqueur de session, scrubbing et bornes de rétention.

https://www.qoredb.com/fr/blog/crash-reporting-local-rapport-jamais-envoye

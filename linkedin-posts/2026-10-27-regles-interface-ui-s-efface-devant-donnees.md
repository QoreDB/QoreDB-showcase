# Post LinkedIn

Les règles d'interface de QoreDB sont écrites et versionnées dans le dépôt, à côté du code. Pas par goût de la doc, mais parce qu'un client de base de données s'utilise pendant des heures, souvent avec une connexion de prod ouverte.

Trois décisions structurent tout.

Une seule couleur d'accent, et le reste de la palette strictement sémantique. Quand quelque chose devient rouge dans la grille, ça veut dire quelque chose. Les trois environnements Dev, Staging et Prod ont leurs propres tokens, consommés depuis une table unique côté frontend, sans aucune valeur hexadécimale en dur.

Les tokens CSS sont la seule source de vérité. C'est ce qui rend le mode sombre tenable : les neutres, l'accent et les états sont redéfinis une fois à la racine, et un composant n'a rien à savoir du thème actif.

Le clavier d'abord, et remappable. Treize raccourcis dans un seul catalogue, un modificateur virtuel qui se résout en Cmd ou Ctrl selon la plateforme, détection des collisions par signature d'accord, et refus des accords qui captureraient un raccourci système comme Alt+F4 ou les bascules de TTY.

La règle de décision, écrite à la fin du document de design : est-ce qu'un développeur ferait confiance à cette interface pour sa base de production à deux heures du matin ?

#QoreDB #OpenSource #DesignSystem #Rust #Tauri #DeveloperTools

---

# Commentaire

L'article détaille les règles, les tokens et le système de raccourcis, avec le code correspondant.

https://www.qoredb.com/fr/blog/regles-interface-ui-s-efface-devant-donnees

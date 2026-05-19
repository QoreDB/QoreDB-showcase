import { useState } from "react";
import { DocumentActionComponent, DocumentActionProps } from "sanity";

export const translateAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const [isTranslating, setIsTranslating] = useState(false);

  // The document-internationalization plugin stores the language in the "language" field.
  // We only want to show this button on the default language (fr).
  const docLanguage = props.draft?.language || props.published?.language;
  
  if (docLanguage !== "fr") {
    return null; // Don't show the button if it's already a translated document
  }

  return {
    label: isTranslating ? "Traduction en cours..." : "Traduire en 6 langues (Gratuit)",
    onHandle: async () => {
      setIsTranslating(true);
      try {
        const response = await fetch(`/api/translate-post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: props.id }),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la traduction");
        }
        
        alert("Traduction terminée avec succès ! Les brouillons ont été créés.");
        props.onComplete();
      } catch (err) {
        console.error(err);
        alert("La traduction a échoué. Vérifiez la console.");
      } finally {
        setIsTranslating(false);
      }
    },
  };
};

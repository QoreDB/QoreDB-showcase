import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Configure a client with a write token
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const TARGET_LANGUAGES = ["en", "es", "it", "de", "zh", "ja"];

// 100% Free Translation Function using GROQ API (Llama 3)
// Requires GROQ_API_KEY in .env.local
async function translateBatch(texts: string[], targetLang: string) {
  if (!texts.length) return texts;
  
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    console.warn("GROQ_API_KEY is missing. Returning original text.");
    return texts;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Modèle ultra-rapide et gratuit
        messages: [
          {
            role: "system",
            content: `You are an expert translator. Translate the strings inside the JSON object into ${targetLang}. Preserve any specific formatting. RETURN ONLY A VALID JSON OBJECT strictly following this structure: {"translations": ["traduction 1", "traduction 2"]}. Do NOT include markdown blocks like \`\`\`json.`,
          },
          {
            role: "user",
            content: JSON.stringify({ translations: texts }),
          },
        ],
        temperature: 0.1, // Faible température pour éviter les hallucinations
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("Groq API Error:", await response.text());
      return texts;
    }

    const data = await response.json();
    const resultContent = JSON.parse(data.choices[0].message.content);
    
    if (resultContent.translations && Array.isArray(resultContent.translations)) {
        return resultContent.translations;
    }
    
    return texts;
  } catch (error) {
    console.error("Translation error:", error);
    return texts;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    if (!documentId) return NextResponse.json({ error: "No documentId" }, { status: 400 });

    const originalPost = await writeClient.getDocument(documentId);
    if (!originalPost) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Loop through each language
    for (const lang of TARGET_LANGUAGES) {
      console.log(`Translating post ${originalPost._id} to ${lang}...`);

      // 1. Extraire tous les textes à traduire pour ne faire qu'UN SEUL appel API par langue
      const textsToTranslate: string[] = [];
      const textPaths: { blockIndex: number, childIndex: number }[] = [];

      // Ajouter le titre en premier (index 0)
      textsToTranslate.push((originalPost.title as string) || "");

      // Parcourir le Portable Text pour extraire les enfants 'text'
      const translatedBody = JSON.parse(JSON.stringify(originalPost.body || [])); // Clone
      
      for (let i = 0; i < translatedBody.length; i++) {
        const block = translatedBody[i];
        if (block._type === "block" && Array.isArray(block.children)) {
          for (let j = 0; j < block.children.length; j++) {
            const child = block.children[j];
            if (child._type === "span" && child.text && child.text.trim() !== "") {
              textsToTranslate.push(child.text);
              textPaths.push({ blockIndex: i, childIndex: j });
            }
          }
        }
      }

      // 2. Envoyer le batch complet à traduire
      const translatedTexts = await translateBatch(textsToTranslate, lang);

      // 3. Réinjecter les traductions dans le document
      const translatedTitle = translatedTexts[0] || originalPost.title;
      
      for (let k = 0; k < textPaths.length; k++) {
        const path = textPaths[k];
        // L'index dans translatedTexts est k + 1 (car l'index 0 est le titre)
        translatedBody[path.blockIndex].children[path.childIndex].text = translatedTexts[k + 1] || textsToTranslate[k + 1];
      }

      // 4. Créer le document traduit dans Sanity
      const translatedDoc = {
        ...originalPost,
        _id: `drafts.${originalPost._id.replace("drafts.", "")}-${lang}`,
        language: lang,
        title: translatedTitle,
        body: translatedBody,
        slug: originalPost.slug 
          ? { ...originalPost.slug, current: `${originalPost.slug.current}-${lang}` }
          : undefined,
        _createdAt: undefined,
        _updatedAt: undefined,
        _rev: undefined,
      };

      await writeClient.createOrReplace(translatedDoc);
      console.log(`Successfully created translation for ${lang}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


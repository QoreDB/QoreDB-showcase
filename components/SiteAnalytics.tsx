import Script from "next/script";

/**
 * Umami analytics — remplace @vercel/analytics + @vercel/speed-insights.
 *
 * Auto-hébergé, RGPD-friendly (pas de cookies → pas de bandeau de consentement),
 * données 100 % chez toi sur le VPS.
 *
 * Configuré via deux variables publiques (inlinées au build) :
 *   NEXT_PUBLIC_UMAMI_SRC        → ex. https://analytics.qoredb.com/script.js
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID → l'UUID du site créé dans Umami
 *
 * Si l'une des deux manque (ex. en local), le composant ne rend rien.
 */
export function SiteAnalytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!src || !websiteId) {
    return null;
  }

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
      // Décommente pour n'enregistrer que le trafic du domaine de prod
      // (utile si tu testes d'abord sur un sous-domaine temporaire) :
      // data-domains="qoredb.com,www.qoredb.com"
    />
  );
}

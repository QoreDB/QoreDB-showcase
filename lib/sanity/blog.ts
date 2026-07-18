import { client } from "./client";

const HAS_OWN_POSTS_QUERY = `count(*[_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language)]) > 0`;

export async function resolveBlogLocale(locale: string): Promise<string> {
  if (locale === "en" || locale === "fr") return locale;
  const hasOwnContent = await client.fetch<boolean>(HAS_OWN_POSTS_QUERY, {
    language: locale,
  });
  return hasOwnContent ? locale : "en";
}

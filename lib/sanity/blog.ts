import { type AppLocale, isSupportedLocale } from "@/lib/locale";
import { client } from "./client";

const HAS_OWN_POSTS_QUERY = `count(*[_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language)]) > 0`;

const POST_LANGUAGES_QUERY = `array::unique(*[_type == "post" && defined(slug.current)].language)`;

export async function getLocalesWithOwnPosts(): Promise<AppLocale[]> {
  const languages = await client.fetch<Array<string | null>>(
    POST_LANGUAGES_QUERY,
    {},
    { next: { revalidate: 3600 } },
  );

  const normalized = languages.map((language) => language ?? "fr");

  return [...new Set(normalized.filter(isSupportedLocale))];
}

export async function resolveBlogLocale(locale: string): Promise<string> {
  if (locale === "en" || locale === "fr") return locale;
  const hasOwnContent = await client.fetch<boolean>(HAS_OWN_POSTS_QUERY, {
    language: locale,
  });
  return hasOwnContent ? locale : "en";
}

import { defineQuery } from "next-sanity";

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  _updatedAt,
  mainImage,
  "plainText": pt::text(body),
  "author": author->{name, image},
  "categories": categories[]->{title}
}`);

export const LATEST_POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language)] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  _updatedAt,
  mainImage,
  "plainText": pt::text(body),
  "author": author->{name, image},
  "categories": categories[]->{title}
}`);

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug && (!defined(language) && $language == 'fr' || language == $language)][0] {
  _id,
  title,
  slug,
  publishedAt,
  _updatedAt,
  mainImage,
  body,
  "plainText": pt::text(body),
  "author": author->{name, image, bio},
  "categories": categories[]->{title},
  "related": related[]->{
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "plainText": pt::text(body),
    "categories": categories[]->{title},
  }
}`);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category"] | order(title asc) { _id, title }`,
);

export const SITEMAP_POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  "language": coalesce(language, "fr"),
  publishedAt,
  _updatedAt,
  "hasImage": defined(mainImage),
  "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[]{
    "language": coalesce(value->language, "fr"),
    "slug": value->slug.current
  }
}`);

export const POST_TRANSLATIONS_QUERY =
  defineQuery(`*[_type == "translation.metadata" && count(translations[value->slug.current == $slug]) > 0][0].translations[]{
  "language": coalesce(value->language, "fr"),
  "slug": value->slug.current
}`);

export const getFilteredPostsQuery = (sort?: string) => {
  let order = "publishedAt desc";
  if (sort === "date-asc") order = "publishedAt asc";
  else if (sort === "title-asc") order = "title asc";
  else if (sort === "title-desc") order = "title desc";
  else if (sort === "relevance") order = "_score desc, publishedAt desc";

  const filter = `_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language)
    && (!defined($searchQuery) || $searchQuery == "" || title match $searchQuery || pt::text(body) match $searchQuery)
    && (!defined($category) || $category == "" || $category in categories[]->title || $category == "all")`;

  return defineQuery(`
    {
      "posts": *[${filter}]
        | score(boost(title match $searchQuery, 4), pt::text(body) match $searchQuery)
        | order(${order})[$start...$end] {
        _id,
        title,
        slug,
        publishedAt,
        _updatedAt,
        mainImage,
        "plainText": pt::text(body),
        "author": author->{name, image},
        "categories": categories[]->{title}
      },
      "total": count(*[${filter}])
    }
  `);
};

export const ADJACENT_POSTS_QUERY = defineQuery(`{
  "previous": *[
    _type == "post" && defined(slug.current) && publishedAt < $publishedAt &&
    (!defined(language) && $language == 'fr' || language == $language)
  ] | order(publishedAt desc)[0] { _id, title, slug },
  "next": *[
    _type == "post" && defined(slug.current) && publishedAt > $publishedAt &&
    (!defined(language) && $language == 'fr' || language == $language)
  ] | order(publishedAt asc)[0] { _id, title, slug }
}`);

import { defineQuery } from "next-sanity";

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  "author": author->{name, image},
  "categories": categories[]->{title}
}`);

export const LATEST_POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language)] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  "author": author->{name, image},
  "categories": categories[]->{title}
}`);

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug && (!defined(language) && $language == 'fr' || language == $language)][0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  body,
  "author": author->{name, image, bio},
  "categories": categories[]->{title},
  "related": related[]->{
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
  }
}`);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category"] | order(title asc) { _id, title }`
);

export const getFilteredPostsQuery = (sort?: string) => {
  let order = "publishedAt desc";
  if (sort === "date-asc") order = "publishedAt asc";
  else if (sort === "title-asc") order = "title asc";
  else if (sort === "title-desc") order = "title desc";

  const filter = `_type == "post" && defined(slug.current) && (!defined(language) && $language == 'fr' || language == $language) 
    && (!defined($searchQuery) || $searchQuery == "" || title match $searchQuery || pt::text(body) match $searchQuery)
    && (!defined($category) || $category == "" || $category in categories[]->title || $category == "all")`;

  return defineQuery(`
    {
      "posts": *[${filter}] | order(${order})[$start...$end] {
        _id,
        title,
        slug,
        publishedAt,
        mainImage,
        "author": author->{name, image},
        "categories": categories[]->{title}
      },
      "total": count(*[${filter}])
    }
  `);
};



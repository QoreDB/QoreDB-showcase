export interface SanityReference {
  _type: "reference";
  _ref: string;
}

export interface SanitySlug {
  _type?: "slug";
  current: string;
}

export interface SanityImage {
  _type?: "image";
  asset?: SanityReference;
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
}

export interface PortableTextSpan {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
}

export interface PortableTextLinkMark {
  _key: string;
  _type: "link";
  href: string;
}

export interface PortableTextBlock {
  _type: "block";
  _key?: string;
  style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children?: PortableTextSpan[];
  markDefs?: PortableTextLinkMark[];
}

export interface PortableTextImage {
  _type: "image";
  _key?: string;
  asset?: SanityReference;
  alt?: string;
  caption?: string;
}

export interface PortableTextCodeBlock {
  _type: "codeBlock";
  _key?: string;
  code?: string;
  language?: string;
  filename?: string;
}

export interface PortableTextCallout {
  _type: "callout";
  _key?: string;
  type?: "info" | "warning" | "success" | "tip";
  text?: string;
}

export interface PortableTextYoutube {
  _type: "youtube";
  _key?: string;
  url?: string;
}

export interface PortableTextDivider {
  _type: "divider";
  _key?: string;
}

export type PortableText = Array<
  | PortableTextBlock
  | PortableTextImage
  | PortableTextCodeBlock
  | PortableTextCallout
  | PortableTextYoutube
  | PortableTextDivider
>;

export interface AuthorDocument {
  _type: "author";
  _id?: string;
  name?: string;
  slug?: SanitySlug;
  image?: SanityImage;
  bio?: PortableTextBlock[];
}

export interface CategoryDocument {
  _type: "category";
  _id?: string;
  title?: string;
  description?: string;
}

export type AuthorRef = SanityReference | AuthorDocument;
export type CategoryRef = SanityReference | CategoryDocument;

export interface PostTranslation {
  language: string;
  slug: string | null;
}

export interface SitemapPost {
  slug: string;
  language: string;
  publishedAt?: string | null;
  _updatedAt?: string;
  hasImage?: boolean;
  translations?: PostTranslation[] | null;
}

export interface PostDocument {
  _type: "post";
  _id?: string;
  _updatedAt?: string;
  title?: string;
  slug: SanitySlug;
  author?: AuthorRef;
  mainImage?: SanityImage;
  categories?: CategoryRef[];
  publishedAt?: string | null;
  body?: PortableText;
  plainText?: string;
  related?: Array<SanityReference | PostDocument>;
}

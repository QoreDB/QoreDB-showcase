import type { PortableText, PostDocument } from "@/types/posts";

const WORDS_PER_MINUTE = 220;

export type ArticleHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

export function portableTextToPlainText(content?: PortableText) {
  return (content ?? [])
    .filter((block) => block._type === "block")
    .flatMap((block) => block.children?.map((child) => child.text) ?? [])
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPostPlainText(post: PostDocument) {
  return (
    post.plainText?.replace(/\s+/g, " ").trim() ||
    portableTextToPlainText(post.body)
  );
}

export function getPostExcerpt(post: PostDocument, maxLength = 190) {
  const text = getPostPlainText(post);
  if (text.length <= maxLength) return text;

  const shortened = text.slice(0, maxLength + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > maxLength * 0.7 ? lastSpace : maxLength).trim()}…`;
}

export function getReadingTimeFromText(text?: string) {
  const words = text?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function getPostReadingTime(post: PostDocument) {
  return getReadingTimeFromText(getPostPlainText(post));
}

export function formatReadingTime(minutes: number, locale?: string) {
  switch (locale) {
    case "fr":
      return `${minutes} min de lecture`;
    case "es":
      return `${minutes} min de lectura`;
    case "it":
      return `${minutes} min di lettura`;
    case "de":
      return `${minutes} Min. Lesezeit`;
    case "zh":
      return `${minutes} 分钟阅读`;
    case "ja":
      return `${minutes}分で読めます`;
    default:
      return `${minutes} min read`;
  }
}

export function getHeadingId(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getArticleHeadings(content?: PortableText): ArticleHeading[] {
  return (content ?? []).flatMap((block) => {
    if (
      block._type !== "block" ||
      (block.style !== "h2" && block.style !== "h3")
    ) {
      return [];
    }

    const text =
      block.children
        ?.map((child) => child.text)
        .join("")
        .trim() ?? "";
    if (!text) return [];

    return [
      {
        id: getHeadingId(text),
        level: block.style === "h2" ? 2 : 3,
        text,
      },
    ];
  });
}

import type { Metadata } from "next";
import {
  type AppLocale,
  DEFAULT_LOCALE,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from "@/lib/locale";

export const SITE_NAME = "QoreDB";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.qoredb.com"
).replace(/\/$/, "");

export const DEFAULT_OG_IMAGE_PATH = "/images/screenshots/query-screen.png";
export const DEFAULT_OG_IMAGE_ALT = "QoreDB SQL Editor";
export const DEFAULT_OG_IMAGE_WIDTH = 1604;
export const DEFAULT_OG_IMAGE_HEIGHT = 1004;

const OPEN_GRAPH_LOCALE_MAP: Record<AppLocale, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
  it: "it_IT",
  de: "de_DE",
  zh: "zh_CN",
  ja: "ja_JP",
};

export const INDEXABLE_PATHS = [
  "/",
  "/download",
  "/pricing",
  "/roadmap",
  "/faq",
  "/docs",
  "/blog",
  "/changelog",
  "/links",
  "/privacy",
  "/legal",
  "/terms",
] as const;

function normalizeRoutePath(pathname: string) {
  if (!pathname || pathname === "/") {
    return "";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getAbsoluteUrl(pathname: string = "/") {
  return new URL(pathname, SITE_URL).toString();
}

export function getLocalizedPath(locale: string, pathname: string = "/") {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedPathname = normalizeRoutePath(pathname);

  return `/${normalizedLocale}${normalizedPathname}`;
}

export function getLocalizedUrl(locale: string, pathname: string = "/") {
  return getAbsoluteUrl(getLocalizedPath(locale, pathname));
}

export function getLanguageAlternates(
  pathname: string = "/",
): Record<string, string> {
  const normalizedPathname = normalizeRoutePath(pathname);
  const alternates = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      getLocalizedUrl(locale, normalizedPathname || "/"),
    ]),
  ) as Record<string, string>;

  return {
    ...alternates,
    "x-default": getLocalizedUrl(DEFAULT_LOCALE, normalizedPathname || "/"),
  };
}

export function ensureSiteName(title: string) {
  return /qoredb/i.test(title) ? title : `${title} | ${SITE_NAME}`;
}

export function localizeInternalHref(href: string, locale: string) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  ) {
    return href;
  }

  const normalizedLocale = normalizeLocale(locale);
  if (
    SUPPORTED_LOCALES.some(
      (supportedLocale) =>
        href === `/${supportedLocale}` ||
        href.startsWith(`/${supportedLocale}/`),
    )
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const queryIndex = href.indexOf("?");
  const splitIndex =
    hashIndex === -1
      ? queryIndex
      : queryIndex === -1
        ? hashIndex
        : Math.min(hashIndex, queryIndex);

  const pathname = splitIndex === -1 ? href : href.slice(0, splitIndex);
  const suffix = splitIndex === -1 ? "" : href.slice(splitIndex);
  const normalizedPathname =
    pathname === "/"
      ? ""
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;

  return `/${normalizedLocale}${normalizedPathname}${suffix}`;
}

type BuildPageMetadataOptions = {
  locale: string;
  pathname?: string;
  title: string;
  description: string;
  imagePath?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function buildPageMetadata({
  locale,
  pathname = "/",
  title,
  description,
  imagePath = DEFAULT_OG_IMAGE_PATH,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: BuildPageMetadataOptions): Metadata {
  const normalizedLocale = normalizeLocale(locale);
  const canonical = getLocalizedUrl(normalizedLocale, pathname);
  const titleWithSiteName = ensureSiteName(title);
  const imageUrl = getAbsoluteUrl(imagePath);

  return {
    title: titleWithSiteName,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      title: titleWithSiteName,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALE_MAP[normalizedLocale],
      alternateLocale: SUPPORTED_LOCALES.filter(
        (supportedLocale) => supportedLocale !== normalizedLocale,
      ).map((supportedLocale) => OPEN_GRAPH_LOCALE_MAP[supportedLocale]),
      type,
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: imageAlt,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titleWithSiteName,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Agentation } from "agentation";
import { dir } from "i18next";
import { ThemeProvider } from "next-themes";
import { useTranslation as initTranslations } from "@/app/[locale]/i18n";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import TranslationsProvider from "@/components/TranslationsProvider";
import { DownloadProvider } from "@/contexts/DownloadProvider";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import {
  DEFAULT_OG_IMAGE_PATH,
  ensureSiteName,
  getAbsoluteUrl,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await initTranslations(locale, "common");
  const title = t("metadata.site_title");
  const description = t("metadata.site_description");

  return {
    metadataBase: new URL(SITE_URL),
    title: ensureSiteName(title),
    description,
    applicationName: SITE_NAME,
    keywords: [
      "database",
      "client",
      "SQL",
      "NoSQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "developer tools",
    ],
    authors: [{ name: "Raphaël Plassart" }],
    creator: "Raphaël Plassart",
    publisher: SITE_NAME,
    category: "technology",
    classification: "DeveloperApplication",
    openGraph: {
      title: ensureSiteName(title),
      description,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: getAbsoluteUrl(DEFAULT_OG_IMAGE_PATH),
          alt: "QoreDB SQL Editor",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ensureSiteName(title),
      description,
      images: [getAbsoluteUrl(DEFAULT_OG_IMAGE_PATH)],
    },
    robots: {
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, "common");

  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <TranslationsProvider
          namespaces={["common"]}
          locale={locale}
          resources={resources}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DownloadProvider>{children}</DownloadProvider>
            <SiteAnalytics />
          </ThemeProvider>
        </TranslationsProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}

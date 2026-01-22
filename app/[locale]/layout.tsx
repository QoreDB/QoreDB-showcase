import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useTranslation as initTranslations } from "@/app/[locale]/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import { ThemeProvider } from "next-themes";
import { i18nConfig } from "@/i18nConfig";
import { dir } from "i18next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QoreDB — Le client de bases de données moderne",
  description: "Un client de bases de données moderne, rapide et sécurisé pour les développeurs. SQL + NoSQL unifié, vault sécurisé, local-first.",
  keywords: ["database", "client", "SQL", "NoSQL", "PostgreSQL", "MySQL", "MongoDB", "developer tools"],
  authors: [{ name: "Raphaël Plassart" }],
  openGraph: {
    title: "QoreDB — Le client de bases de données moderne",
    description: "Un client de bases de données moderne, rapide et sécurisé pour les développeurs.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, 'common');

  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationsProvider
          namespaces={['common']}
          locale={locale}
          resources={resources}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}

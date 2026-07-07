"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FEATURE_PAGES } from "@/lib/features";
import { LanguageSwitcher } from "../language-switcher";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (pathname === `/${locale}`) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { href: `/${locale}/docs`, label: t("nav.docs") },
    { href: `/${locale}/plugins`, label: t("nav.marketplace") },
    { href: `/${locale}/pricing`, label: t("nav.pricing") },
    { href: `/${locale}/blog`, label: t("nav.blog") },
    { href: `/${locale}/download`, label: t("nav.download") },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-2 md:py-4 lg:px-12 transition-all duration-300 ${
        scrolled
          ? "bg-(--q-bg-0)/80 backdrop-blur-xl border-b border-(--q-border)/50 shadow-sm"
          : "bg-transparent backdrop-blur-none"
      }`}
    >
      <Link
        href={`/${locale}`}
        className="flex items-center gap-1"
        onClick={handleLogoClick}
      >
        <Image
          src="/logo.webp"
          alt="QoreDB Logo"
          width={48}
          height={48}
          className="w-6 sm:w-8 dark:hidden"
        />
        <Image
          src="/logo-white.webp"
          alt="QoreDB Logo"
          width={48}
          height={48}
          className="w-6 sm:w-8 hidden dark:block"
        />
        <span className="text-(--q-text-0) font-semibold text-lg">QoreDB</span>
      </Link>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors data-[state=open]:text-(--q-text-0)">
              {t("nav.features")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {FEATURE_PAGES.map((feature) => (
                <NavigationMenuLink key={feature.slug} asChild>
                  <Link
                    href={`/${locale}/features/${feature.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-(--q-text-1) hover:bg-(--q-bg-2) hover:text-(--q-text-0)"
                  >
                    {t(`features_pages.${feature.slug}.title`)}
                  </Link>
                </NavigationMenuLink>
              ))}
              <div className="my-1 h-px bg-(--q-border)" />
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/features`}
                  className="block rounded-md px-3 py-2 text-sm text-(--q-text-2) hover:bg-(--q-bg-2) hover:text-(--q-text-0)"
                >
                  {t("features_common.back_to_index")}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={link.href}
                  className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <button
        type="button"
        className={`md:hidden text-(--q-text-0) p-2 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "rotate-90" : "rotate-0"}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      <div className="hidden md:flex items-center space-x-4">
        <div className="hidden md:flex items-center gap-2 mr-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <Button
          variant="outline"
          className="hidden md:flex group gap-2 border-[#5865F2]/40 text-[#5865F2] hover:text-[#5865F2] hover:border-[#5865F2] hover:bg-[#5865F2]/10"
          onClick={() => window.open("https://discord.gg/Yr6P3wuZDt", "_blank")}
        >
          <MessageCircle className="w-4 h-4" />
          {t("hero.cta.community")}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-(--q-bg-0)/95 backdrop-blur-xl border-b border-(--q-border) z-20">
          <nav className="flex flex-col space-y-4 px-6 py-6">
            <div className="flex flex-col gap-3">
              <Link
                href={`/${locale}/features`}
                className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.features")}
              </Link>
              <div className="flex flex-col gap-2 pl-3 border-l border-(--q-border)">
                {FEATURE_PAGES.map((feature) => (
                  <Link
                    key={feature.slug}
                    href={`/${locale}/features/${feature.slug}`}
                    className="text-sm text-(--q-text-2) hover:text-(--q-accent) transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(`features_pages.${feature.slug}.title`)}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-4 py-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../language-switcher";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const resourcesMenu = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || "fr";
  const { t } = useTranslation();
  const primaryLinks = [
    { href: `/${locale}/features`, label: t("nav.product") },
    { href: `/${locale}/docs`, label: t("nav.docs") },
    { href: `/${locale}/pricing`, label: t("nav.pricing") },
  ];
  const resourceLinks = [
    { href: `/${locale}/plugins`, label: t("nav.marketplace") },
    { href: `/${locale}/blog`, label: t("nav.blog") },
    { href: `/${locale}/changelog`, label: t("nav.changelog") },
    { href: `/${locale}/roadmap`, label: t("nav.roadmap") },
    { href: `/${locale}/faq`, label: t("nav.faq") },
  ];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButton.current?.focus();
      }
      if (resourcesMenu.current?.open) {
        resourcesMenu.current.open = false;
        resourcesMenu.current.querySelector("summary")?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const menu = resourcesMenu.current;
      if (menu?.open && !menu.contains(event.target as Node)) menu.open = false;
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <a href="#main-content" className="q-skip-link">
        {t("a11y.skip_content")}
      </a>
      <header className="q-site-header">
        <div className="q-container q-header-inner">
          <Link
            href={`/${locale}`}
            className="q-brand"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/logo.webp"
              alt=""
              width={32}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/logo-white.webp"
              alt=""
              width={32}
              height={32}
              className="hidden dark:block"
            />
            <span>QoreDB</span>
          </Link>
          <nav
            className="q-desktop-nav"
            aria-label={t("a11y.primary_navigation")}
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <details className="q-resources-menu" ref={resourcesMenu}>
              <summary>
                {t("nav.resources")}
                <ChevronDown size={14} aria-hidden="true" />
              </summary>
              <div className="q-resources-panel">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    onClick={() => {
                      if (resourcesMenu.current)
                        resourcesMenu.current.open = false;
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
          </nav>
          <div className="q-header-actions">
            <div className="q-desktop-preferences">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <Button asChild className="q-header-download">
              <Link href={`/${locale}/download`}>
                {t("nav.download")}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </Button>
            <button
              ref={menuButton}
              type="button"
              className="q-menu-toggle"
              aria-controls="mobile-navigation"
              aria-label={t(
                mobileMenuOpen ? "nav.close_menu" : "nav.open_menu",
              )}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            className="q-mobile-nav"
            aria-label={t("a11y.primary_navigation")}
          >
            <div className="q-container">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              ))}
              <p className="q-mobile-nav-label">{t("nav.resources")}</p>
              <div className="q-mobile-resources">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="q-mobile-preferences">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

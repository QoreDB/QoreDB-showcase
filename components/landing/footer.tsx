"use client";

import {
  ArrowRight,
  Check,
  ExternalLink,
  Github,
  Linkedin,
  Loader2,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { subscribeNewsletter } from "@/actions/subscribe-newsletter";
import { getContactMailtoHref } from "@/lib/contact";
import { getFooterLinks } from "@/lib/footer-links";
import { localizeInternalHref } from "@/lib/seo";

export function Footer() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "fr";

  const footerLinks = getFooterLinks(t);

  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await subscribeNewsletter(
        { email, address: honeypot, source: "footer" },
        locale,
      );
      if (res.success) {
        setSubmitted(true);
        setEmail("");
      }
    });
  };

  return (
    <footer className="relative z-10 border-t border-(--q-border) bg-(--q-bg-0)">
      {/* Newsletter band */}
      <div className="border-b border-(--q-border)">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-16 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
          <div className="lg:flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-(--q-accent-soft) px-3 py-1 text-xs font-semibold text-(--q-accent-strong)">
              <Mail className="w-3.5 h-3.5" />
              Newsletter
            </div>
            <h3 className="font-heading text-(--q-text-0) text-2xl sm:text-3xl font-bold">
              {t("newsletter_page.title")}
            </h3>
            <p className="text-(--q-text-2) text-sm sm:text-base leading-relaxed max-w-xl">
              {t("newsletter_page.subtitle")}
            </p>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[24rem]">
            {submitted ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-emerald-500">
                <Check className="h-4 w-4 shrink-0" />
                <span>{t("newsletter_page.success")}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter_page.placeholder")}
                  className="flex-1 rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3 text-sm text-(--q-text-0) placeholder:text-(--q-text-2) focus:border-(--q-accent) focus:outline-none transition-colors"
                />
                {/* Honeypot */}
                <input
                  type="text"
                  name="address"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--q-text-0) text-(--q-bg-0) px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t("newsletter_page.cta")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href={localizeInternalHref("/", locale)}
              className="flex items-center gap-1 mb-4"
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
              <span className="text-(--q-text-0) font-bold text-xl">
                QoreDB
              </span>
            </Link>
            <p className="text-(--q-text-2) text-sm leading-relaxed mb-6">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/QoreDB/QoreDB"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/qoredb/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
                aria-label="Linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  window.location.href = getContactMailtoHref();
                }}
                className="bg-transparent text-(--q-text-2) hover:text-(--q-text-0) transition-colors cursor-pointer"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex flex-col items-start gap-3">
              <a
                href="https://www.producthunt.com/products/qoredb?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-qoredb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1197632&theme=light&t=1784298260312"
                  alt="QoreDB - The local-first, AI-native database client, in Rust | Product Hunt"
                  width={250}
                  height={54}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-heading text-(--q-text-0) font-semibold text-sm mb-4">
              {t("footer.product")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={localizeInternalHref(link.href, locale)}
                    className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="font-heading text-(--q-text-0) font-semibold text-sm mb-4">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={localizeInternalHref(link.href, locale)}
                    className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors text-sm inline-flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community links */}
          <div>
            <h3 className="font-heading text-(--q-text-0) font-semibold text-sm mb-4">
              {t("footer.community")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors text-sm inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-heading text-(--q-text-0) font-semibold text-sm mb-4">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={localizeInternalHref(link.href, locale)}
                    className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-(--q-border)">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-(--q-text-2)">
            © {new Date().getFullYear()} QoreDB. Open Source under Apache 2.0
            license.
          </p>
          <div className="flex items-center gap-2 text-sm text-(--q-text-2)">
            <span>
              {t("footer.made_with_love", { heart: "" }).trim()}{" "}
              <span className="text-(--q-accent)">♥</span>{" "}
            </span>
            <a
              href="https://github.com/raphplt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--q-text-0) hover:text-(--q-accent) transition-colors font-medium"
            >
              Raphaël Plassart
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
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
              <a
                href="https://www.producthunt.com/products/qoredb/reviews/new?utm_source=badge-product_review&utm_medium=badge"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1190478&theme=light"
                  alt="QoreDB - The local-first, AI-native database client, in Rust | Product Hunt"
                  width={250}
                  height={54}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </a>
              <a
                href="https://www.producthunt.com/products/qoredb?utm_source=badge-follow&utm_medium=badge"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1190478&theme=light&size=small"
                  alt="QoreDB - The local-first, AI-native database client, in Rust | Product Hunt"
                  width={86}
                  height={32}
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

          {/* Newsletter subscription form */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-(--q-text-0) font-semibold text-sm mb-4">
              Newsletter
            </h3>
            <p className="text-xs text-(--q-text-2) leading-relaxed mb-4">
              {locale === "fr"
                ? "Recevez les nouveautés et tutoriels de QoreDB."
                : "Get the latest QoreDB news and guides."}
            </p>
            {submitted ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs font-medium text-emerald-500">
                <Check className="h-3.5 w-3.5" />
                <span>{t("newsletter_page.success_title") || "Merci !"}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter_page.placeholder") || "Email"}
                    className="w-full rounded-lg border border-(--q-border) bg-(--q-bg-0) pl-3 pr-8 py-2 text-xs text-(--q-text-0) placeholder:text-(--q-text-2) focus:border-(--q-accent) focus:outline-none transition-colors"
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-(--q-text-1) hover:text-(--q-accent) transition-colors p-1"
                    aria-label={t("newsletter_page.cta")}
                  >
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </form>
            )}
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

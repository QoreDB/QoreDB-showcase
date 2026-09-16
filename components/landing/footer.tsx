"use client";

import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getContactMailtoHref } from "@/lib/contact";
import { getFooterLinks } from "@/lib/footer-links";
import { localizeInternalHref } from "@/lib/seo";

export function Footer() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "fr";
  const footerLinks = getFooterLinks(t);

  return (
    <footer className="q-site-footer">
      <div className="q-container">
        <div className="q-footer-grid">
          <div className="q-footer-brand">
            <Link
              href={localizeInternalHref("/", locale)}
              prefetch={false}
              className="q-brand"
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
            <p>{t("footer.description")}</p>
            <div className="q-footer-social">
              <a
                href="https://github.com/QoreDB/QoreDB"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/qoredb/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={getContactMailtoHref()}
                aria-label={t("a11y.contact_email")}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h2>{t(`footer.${group}`)}</h2>
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={localizeInternalHref(link.href, locale)}
                        prefetch={false}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="q-footer-bottom">
          <p>
            © {new Date().getFullYear()} QoreDB. {t("footer.license_summary")}
          </p>
          <p>
            {t("footer.made_with_love", { heart: "♥" }).trim()}{" "}
            <a
              href="https://github.com/raphplt"
              target="_blank"
              rel="noopener noreferrer"
            >
              Raphaël Plassart
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, Twitter, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";



export function Footer() {
	const { t } = useTranslation();

	const footerLinks = {
		product: [
			{ label: t("footer.features"), href: "/#features" },
			{ label: t("footer.preview"), href: "/#preview" },
			{ label: "Roadmap", href: "/roadmap" },
			{ label: t("footer.changelog"), href: "/blog" },
		],
		resources: [
			{ label: t("footer.documentation"), href: "#", external: false },
			{ label: "Blog", href: "/blog" },
			{ label: "FAQ", href: "/faq" },
			{ label: t("footer.guide"), href: "#", external: false },
		],
		community: [
			{
				label: "GitHub",
				href: "https://github.com/raphplt/QoreDB",
				external: true,
			},
			{ label: "Discord", href: "#", external: true },
			{ label: "Twitter", href: "#", external: true },
		],
		legal: [
			{ label: t("footer.privacy"), href: "/privacy" },
			{ label: t("footer.terms"), href: "#" },
			{ label: t("footer.license"), href: "#" },
		],
	};

	return (
		<footer className="relative z-10 border-t border-(--q-border) bg-(--q-bg-0)">
			{/* Main footer content */}
			<div className="max-w-6xl mx-auto px-6 py-16">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
					{/* Brand column */}
					<div className="col-span-2 md:col-span-1">
						<Link href="/" className="flex items-center gap-3 mb-4">
							<Image src="/logo.png" alt="QoreDB" width={40} height={40} />
							<span className="font-heading text-(--q-text-0) font-bold text-xl">
								QoreDB
							</span>
						</Link>
						<p className="text-(--q-text-2) text-sm leading-relaxed mb-6">
							{t("footer.description")}
						</p>
						<div className="flex items-center gap-4">
							<a
								href="https://github.com/raphplt/QoreDB"
								target="_blank"
								rel="noopener noreferrer"
								className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
								aria-label="GitHub"
							>
								<Github className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
								aria-label="Twitter"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="mailto:qoredb@gmail.com"
								className="text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
								aria-label="Email"
							>
								<Mail className="w-5 h-5" />
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
										href={link.href}
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
										href={link.href}
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
										href={link.href}
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
						© {new Date().getFullYear()} QoreDB. Open Source under Apache 2.0 license.
					</p>
					<div className="flex items-center gap-2 text-sm text-(--q-text-2)">
						<span>
							Fait avec <span className="text-(--q-accent)">♥</span> par
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

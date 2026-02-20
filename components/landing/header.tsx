"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Menu, X } from "lucide-react";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LanguageSwitcher } from "../language-switcher";
import { ThemeToggle } from "../theme-toggle";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button"

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const params = useParams();
	const locale = params.locale as string;
	const { t } = useTranslation();

	const handleLogoClick = (e: React.MouseEvent) => {
		setMobileMenuOpen(false);
		if (pathname === `/${locale}`) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-2 md:py-4 lg:px-12 backdrop-blur-md bg-transparent transition-all duration-300">
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

			<nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
				<Link
					href={`/${locale}/#features`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.features")}
				</Link>
				<Link
					href={`/${locale}/#preview`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.preview")}
				</Link>
				<Link
					href={`/${locale}/pricing`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.pricing")}
				</Link>
				<Link
					href={`/${locale}/blog`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.blog")}
				</Link>
				<Link
					href={`/${locale}/roadmap`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.roadmap")}
				</Link>
				<Link
					href={`/${locale}/faq`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.faq")}
				</Link>
				<Link
					href={`/${locale}/changelog`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.changelog")}
				</Link>
				<Link
					href={`/${locale}/download`}
					className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm"
				>
					{t("nav.download")}
				</Link>
			</nav>

			<button
				className={`md:hidden text-(--q-text-0) p-2 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "rotate-90" : "rotate-0"}`}
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
			>
				{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
			</button>

			<div className="hidden md:flex items-center space-x-4">
				<div className="hidden md:flex items-center gap-2 mr-2">
					<ThemeToggle />
					<LanguageSwitcher />
				</div>

				<Button
					variant="outline"
					className="hidden md:flex"
					onClick={() => window.open("https://github.com/QoreDB/QoreDB", "_blank")}
				>
					{t("hero.cta.participate")}
					<ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
				</Button>
			</div>
			{mobileMenuOpen && (
				<div className="md:hidden absolute top-16 left-0 right-0 bg-(--q-bg-0)/95 backdrop-blur-sm border-b border-(--q-border) z-20">
					<nav className="flex flex-col space-y-4 px-6 py-6">
						<Link
							href={`/${locale}/#features`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.features")}
						</Link>
						<Link
							href={`/${locale}/#preview`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.preview")}
						</Link>
						<Link
							href={`/${locale}/#pricing`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.pricing")}
						</Link>
						<Link
							href={`/${locale}/blog`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.blog")}
						</Link>
						<Link
							href={`/${locale}/roadmap`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.roadmap")}
						</Link>
						<Link
							href={`/${locale}/faq`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors flex items-center gap-1"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.faq")}
						</Link>
						<Link
							href={`/${locale}/changelog`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors flex items-center gap-1"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.changelog")}
						</Link>
						<Link
							href={`/${locale}/download`}
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors flex items-center gap-1"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.download")}
						</Link>

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

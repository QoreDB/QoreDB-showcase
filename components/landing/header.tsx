"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Github, Menu, X } from "lucide-react";
import { ShimmerButton } from "@/components/shimmer-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "../language-switcher";
import { ThemeToggle } from "../theme-toggle";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button"

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const { t } = useTranslation();

	const handleLogoClick = (e: React.MouseEvent) => {
		setMobileMenuOpen(false);
		if (pathname === "/") {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<>
			<header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 lg:px-12 backdrop-blur-md bg-transparent transition-all duration-300">
				<Link
					href="/"
					className="flex items-center space-x-2 pl-3 sm:pl-6 lg:pl-12"
					onClick={handleLogoClick}
				>
					<Image
						src="/icon.png"
						alt="QoreDB Logo"
						width={48}
						height={48}
						className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
					/>
					<span className="text-(--q-text-0) font-semibold text-lg sm:text-xl">
						QoreDB
					</span>
				</Link>

				<nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
					<Link
						href="/#features"
						className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm lg:text-base"
					>
						{t("nav.features")}
					</Link>
					<Link
						href="/#preview"
						className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm lg:text-base"
					>
						{t("nav.preview")}
					</Link>
					<Link
						href="/blog"
						className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm lg:text-base"
					>
						{t("nav.blog")}
					</Link>
					<Link
						href="/roadmap"
						className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm lg:text-base"
					>
						{t("nav.roadmap")}
					</Link>
					<Link
						href="/faq"
						className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors text-sm lg:text-base flex items-center gap-1"
					>
						{t("nav.faq")}
					</Link>
				</nav>

				{/* Mobile menu button */}
				<button
					className="md:hidden text-(--q-text-0) p-2"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				>
					{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
				</button>

				<div className="flex items-center space-x-4">
					<div className="hidden md:flex items-center gap-2 mr-2">
						<ThemeToggle />
						<LanguageSwitcher />
					</div>
					{/* <Link
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors flex items-center gap-1"
					>
						<Github className="w-5 h-5" />
					</Link> */}

								<Button
					className="bg-(--q-accent)"
					
				>
					{t("hero.cta.participate")}
					<Github className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
				</Button>
				</div>
			</header>

			{mobileMenuOpen && (
				<div className="md:hidden absolute top-16 left-0 right-0 bg-(--q-bg-0)/95 backdrop-blur-sm border-b border-(--q-border) z-20">
					<nav className="flex flex-col space-y-4 px-6 py-6">
						<Link
							href="/#features"
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.features")}
						</Link>
						<Link
							href="/#preview"
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.preview")}
						</Link>
						<Link
							href="/blog"
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.blog")}
						</Link>
						<Link
							href="/roadmap"
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.roadmap")}
						</Link>

						<Link
							href="/faq"
							className="text-(--q-text-1) hover:text-(--q-text-0) transition-colors flex items-center gap-1"
						>
							{t("nav.faq")}
						</Link>
						
						<div className="flex items-center gap-4 py-2">
							<ThemeToggle />
							<LanguageSwitcher />
						</div>

						<ShimmerButton className="bg-(--q-accent) hover:bg-(--q-accent-strong) text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg w-fit">
							{t("nav.join_beta")}
						</ShimmerButton>
					</nav>
				</div>
			)}
		</>
	);
}

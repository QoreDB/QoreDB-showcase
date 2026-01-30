"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
	ExternalLink,
	Globe,
	Github,
	Linkedin,
	MessageCircle,
	MoveUpRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import {
	getFooterLinks,
	footerContactLinks,
	footerCreditLink,
} from "@/lib/footer-links";
import type { FooterLink } from "@/lib/footer-links";

const isMailLink = (href: string) => href.startsWith("mailto:");
const isExternalLink = (link: FooterLink) =>
	link.external || link.href.startsWith("http");

type FeaturedLink = FooterLink & {
	description: string;
	icon: typeof Globe;
	accent: string;
};

type FeaturedCtaLabels = {
	explore: string;
	write: string;
};

function LinkItem({ link }: { link: FooterLink }) {
	const external = isExternalLink(link);
	const isMail = isMailLink(link.href);
	const className =
		"group flex items-center justify-between gap-3 rounded-xl border border-(--q-border) bg-(--q-bg-0)/60 px-4 py-3 text-sm text-(--q-text-1) transition-all hover:border-(--q-accent)/40 hover:bg-(--q-bg-1) hover:text-(--q-text-0)";

	if (external || isMail || link.href.startsWith("#")) {
		return (
			<a
				href={link.href}
				className={className}
				target={external ? "_blank" : undefined}
				rel={external ? "noopener noreferrer" : undefined}
			>
				<span>{link.label}</span>
				{external && (
					<ExternalLink className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				)}
			</a>
		);
	}

	return (
		<Link href={link.href} className={className}>
			<span>{link.label}</span>
			{external && (
				<ExternalLink className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
			)}
		</Link>
	);
}

function FeaturedCard({
	description,
	icon: Icon,
	accent,
	cta,
	...link
}: FeaturedLink & { cta: FeaturedCtaLabels }) {
	const external = isExternalLink(link);
	const isMail = isMailLink(link.href);
	const className =
		"group relative flex h-full flex-col overflow-hidden rounded-3xl border border-(--q-border) bg-(--q-bg-1)/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--q-accent)/40 hover:bg-(--q-bg-1) shadow-[0_20px_60px_rgba(15,23,42,0.08)]";

	const content = (
		<div className="relative z-10 flex h-full flex-col gap-5">
			<div className="flex items-start gap-4">
				<div
					className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${accent} text-white shadow-lg shadow-(--q-bg-0)/20`}
				>
					<Icon className="h-6 w-6" />
				</div>
				<div>
					<p className="text-xl font-semibold text-(--q-text-0)">{link.label}</p>
					<p className="text-sm text-(--q-text-2) leading-relaxed mt-2">
						{description}
					</p>
				</div>
			</div>
			<div className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-(--q-border) bg-(--q-bg-0) px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--q-text-0) transition group-hover:border-(--q-accent)/40 group-hover:bg-(--q-bg-1)">
				<span>{isMail ? cta.write : cta.explore}</span>
				<MoveUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
			</div>
			<div
				className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30 bg-linear-to-br ${accent} blur-3xl`}
			/>
		</div>
	);

	if (external || isMail || link.href.startsWith("#")) {
		return (
			<a
				href={link.href}
				className={className}
				target={external ? "_blank" : undefined}
				rel={external ? "noopener noreferrer" : undefined}
			>
				{content}
			</a>
		);
	}

	return (
		<Link href={link.href} className={className}>
			{content}
		</Link>
	);
}

export default function LinksPage() {
	const { t } = useTranslation();
	const params = useParams();
	const locale = params.locale as string;
	const footerLinks = getFooterLinks(t);
	const ctaLabels = {
		explore: t("links_page.cta.explore"),
		write: t("links_page.cta.write"),
	};

	const githubLink = footerLinks.community.find(
		(link) => link.label === "GitHub",
	) ?? {
		label: "GitHub",
		href: "https://github.com/QoreDB/QoreDB",
		external: true,
	};
	const discordLink = footerLinks.community.find(
		(link) => link.label === "Discord",
	) ?? {
		label: "Discord",
		href: "https://discord.gg/Yr6P3wuZDt",
		external: true,
	};
	const linkedinLink = footerLinks.community.find(
		(link) => link.label === "Linkedin",
	) ?? {
		label: "LinkedIn",
		href: "https://www.linkedin.com/company/qoredb/?viewAsMember=true",
		external: true,
	};

	const featuredLinks: FeaturedLink[] = [
		{
			label: t("links_page.featured.site.title"),
			description: t("links_page.featured.site.description"),
			href: `/${locale}`,
			icon: Globe,
			accent: "from-[#F97316] to-[#F43F5E]",
		},
		{
			label: t("links_page.featured.github.title"),
			description: t("links_page.featured.github.description"),
			href: githubLink.href,
			external: true,
			icon: Github,
			accent: "from-[#0F172A] to-[#334155]",
		},
		{
			label: t("links_page.featured.discord.title"),
			description: t("links_page.featured.discord.description"),
			href: discordLink.href,
			external: true,
			icon: MessageCircle,
			accent: "from-[#6366F1] to-[#22D3EE]",
		},
		{
			label: t("links_page.featured.linkedin.title"),
			description: t("links_page.featured.linkedin.description"),
			href: linkedinLink.href,
			external: true,
			icon: Linkedin,
			accent: "from-[#0A66C2] to-[#38BDF8]",
		},
	];

	const sections = [
		{ title: t("footer.product"), links: footerLinks.product },
		{ title: t("footer.resources"), links: footerLinks.resources },
		{ title: t("footer.community"), links: footerLinks.community },
		{ title: t("footer.legal"), links: footerLinks.legal },
		{ title: t("links_page.contact"), links: footerContactLinks },
		{ title: t("links_page.credits"), links: [footerCreditLink] },
	];

	const container: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.16, 1, 0.3, 1],
				staggerChildren: 0.08,
			},
		},
	};

	const item: Variants = {
		hidden: { opacity: 0, y: 16 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
		},
	};

	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0) relative overflow-hidden">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -top-40 right-10 h-90 w-90 rounded-full bg-(--q-accent) opacity-10 blur-[120px]" />
				<div className="absolute top-1/3 -left-24 h-75 w-75 rounded-full bg-(--q-text-0) opacity-5 blur-[120px]" />
				<div className="absolute bottom-10 right-1/3 h-60 w-60 rounded-full bg-(--q-accent) opacity-10 blur-[120px]" />
			</div>
			<Header />
			<main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full relative">
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="text-center mb-12"
				>
					<motion.p
						variants={item}
						className="text-xs uppercase tracking-[0.4em] text-(--q-text-2) mb-4"
					>
						{t("links_page.featured.title")}
					</motion.p>
					<motion.h1
						variants={item}
						className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-(--q-text-0) to-(--q-text-1)"
					>
						{t("links_page.title")}
					</motion.h1>
					<motion.p
						variants={item}
						className="text-(--q-text-2) text-lg max-w-2xl mx-auto"
					>
						{t("links_page.subtitle")}
					</motion.p>
				</motion.div>

				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="mb-16"
				>
					<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 xl:grid-cols-4">
						{featuredLinks.map((link) => (
							<motion.div key={link.label} variants={item}>
								<FeaturedCard {...link} cta={ctaLabels} />
							</motion.div>
						))}
					</div>
				</motion.div>

				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="space-y-8"
				>
					<motion.h2 variants={item} className="text-2xl md:text-3xl font-semibold">
						{t("links_page.all_links")}
					</motion.h2>
					<motion.div
						variants={container}
						className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
					>
						{sections.map((section) => (
							<motion.section
								key={section.title}
								variants={item}
								className="rounded-2xl border border-(--q-border) bg-(--q-bg-1)/40 p-6 backdrop-blur"
							>
								<h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-(--q-text-2) mb-4">
									{section.title}
								</h3>
								<ul className="space-y-3">
									{section.links.map((link) => (
										<li key={`${section.title}-${link.label}`}>
											<LinkItem link={link} />
										</li>
									))}
								</ul>
							</motion.section>
						))}
					</motion.div>
				</motion.div>
			</main>
			<Footer />
		</div>
	);
}

"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { PostDocument } from "@/types/posts";

interface BlogSectionProps {
	posts?: PostDocument[];
}

export function BlogSection({ posts = [] }: BlogSectionProps) {
	const { t } = useTranslation();
	const params = useParams();
	const locale = params?.locale as string | undefined;

	return (
		<section className="relative z-10 py-24 sm:py-32 px-6 bg-(--q-bg-0)">
			<div className="max-w-7xl mx-auto">
				<div className="text-center space-y-4 mb-12">
					<span className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase">
						{t("blog_section.eyebrow")}
					</span>
					<h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
						{t("blog_section.title")}
					</h2>
					<p className="text-(--q-text-1) text-lg max-w-2xl mx-auto leading-relaxed">
						{t("blog_section.subtitle")}
					</p>
					<Link
						href={locale ? `/${locale}/blog` : "/blog"}
						className="inline-flex items-center gap-2 text-(--q-accent) font-medium hover:text-(--q-accent-strong) transition-colors"
					>
						{t("blog_section.cta")}
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts.length > 0 ? (
						posts.map((post) => (
							<div key={post._id} className="w-full">
								<ArticleCard post={post} locale={locale} />
							</div>
						))
					) : (
						<div className="col-span-full text-center text-(--q-text-2)">
							{t("blog_section.empty")}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

import { client } from "../../../lib/sanity/client";
import { POSTS_QUERY } from "../../../lib/sanity/queries";
import { ArticleCard } from "../../../components/blog/ArticleCard";
import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { PostDocument } from "@/types/posts";

export const metadata: Metadata = {
	title: "Blog - QoreDB",
	description:
		"Articles, updates and technical deep dives from the QoreDB team.",
};

export default async function BlogIndexPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const posts = await client.fetch(POSTS_QUERY);

	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 container mx-auto py-24 space-y-12">
				<div className="space-y-4 text-center max-w-2xl mx-auto pt-20">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
					<p className="text-muted-foreground text-lg">
						Explorez nos derniers articles, tutoriels et actualités sur QoreDB et le
						développement moderne.
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-8">
					{posts.length > 0 ? (
						posts.map((post: PostDocument) => (
							<div
								key={post._id}
								className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)]"
							>
								<ArticleCard post={post} locale={locale} />
							</div>
						))
					) : (
						<div className="w-full text-center py-20 text-muted-foreground">
							<p>Aucun article pour le moment. Revenez bientôt !</p>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}

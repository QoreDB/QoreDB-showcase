import { client } from "../../../../lib/sanity/client";
import { POST_QUERY } from "../../../../lib/sanity/queries";
import { RichTextRenderer } from "../../../../components/blog/RichTextRenderer";
import { ArticleCard } from "../../../../components/blog/ArticleCard";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { urlForImage } from "../../../../lib/sanity/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, ChevronLeft } from "lucide-react";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await client.fetch(POST_QUERY, { slug });
	if (!post) return { title: "Not Found" };

	return {
		title: `${post.title} - QoreDB Blog`,
		description: post.title, // In real app, add description field to sanity schema
		openGraph: post.mainImage
			? {
					images: [urlForImage(post.mainImage).url()],
				}
			: undefined,
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await client.fetch(
		POST_QUERY,
		{ slug },
		{ next: { revalidate: 60 } },
	); // Revalidate every 60s

	if (!post) {
		notFound();
	}

	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 pt-20">
				<article className="container py-24 max-w-4xl mx-auto space-y-12">
					{/* Header */}
					<div className="space-y-6 text-center">
						<Link
							href="/blog"
							className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							Retour au blog
						</Link>
						<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
							<CalendarIcon className="w-4 h-4" />
							<time dateTime={post.publishedAt}>
								{new Date(post.publishedAt).toLocaleDateString("fr-FR", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</time>
						</div>
						<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl leading-tight">
							{post.title}
						</h1>
						{post.author && (
							<div className="flex items-center justify-center gap-3 pt-4">
								{post.author.image && (
									<div className="relative h-10 w-10 overflow-hidden rounded-full border">
										<Image
											src={urlForImage(post.author.image).url()}
											alt={post.author.name}
											fill
											className="object-cover"
										/>
									</div>
								)}
								<div className="text-left">
									<p className="text-sm font-medium">{post.author.name}</p>
									{/* Add bio snippet if needed */}
								</div>
							</div>
						)}
					</div>

					{/* Main Image */}
					{post.mainImage && (
						<div className="relative aspect-2/1 w-full overflow-hidden rounded-xl border bg-muted/50">
							<Image
								src={urlForImage(post.mainImage).url()}
								alt={post.title}
								fill
								className="object-cover"
								priority
							/>
						</div>
					)}

					{/* Content */}
					<div className="prose prose-lg dark:prose-invert max-w-none">
						<RichTextRenderer content={post.body} />
					</div>

					<hr className="my-12" />

					{/* Related Posts */}
					{post.related && post.related.length > 0 && (
						<div className="space-y-8">
							<h3 className="text-3xl font-bold">Articles similaires</h3>
							<div className="grid gap-6 md:grid-cols-2">
								{post.related.map((relatedPost: any) => (
									<ArticleCard key={relatedPost._id} post={relatedPost} />
								))}
							</div>
						</div>
					)}
				</article>
			</main>
			<Footer />
		</div>
	);
}

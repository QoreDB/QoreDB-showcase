import dynamic from "next/dynamic";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HeroBackgroundManager } from "@/components/hero-background-manager";
import { client } from "@/lib/sanity/client";
import { LATEST_POSTS_QUERY } from "@/lib/sanity/queries";

const WhySection = dynamic(() =>
	import("@/components/landing/why-section").then((m) => ({
		default: m.WhySection,
	}))
);
const FeaturesSection = dynamic(() =>
	import("@/components/landing/features-section").then((m) => ({
		default: m.FeaturesSection,
	}))
);
const PreviewSection = dynamic(() =>
	import("@/components/landing/preview-section").then((m) => ({
		default: m.PreviewSection,
	}))
);
const BlogSection = dynamic(() =>
	import("@/components/landing/blog-section").then((m) => ({
		default: m.BlogSection,
	}))
);
const CTASection = dynamic(() =>
	import("@/components/landing/cta-section").then((m) => ({
		default: m.CTASection,
	}))
);
const Footer = dynamic(() =>
	import("@/components/landing/footer").then((m) => ({
		default: m.Footer,
	}))
);

export default async function HomePage() {
	let posts = [];
	try {
		posts = await client.fetch(LATEST_POSTS_QUERY);
		if (!Array.isArray(posts)) posts = [];
	} catch {
		posts = [];
	}

	return (
		<div className="min-h-screen overflow-hidden relative">
			<HeroBackgroundManager />
			<Header />
			<Hero />
			<WhySection />
			<FeaturesSection />
			<PreviewSection />
			<BlogSection posts={posts} />
			<CTASection />
			<Footer />
		</div>
	);
}

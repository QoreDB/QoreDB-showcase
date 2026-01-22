"use client";

import { HeroBackground } from "@/components/hero-background";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { WhySection } from "@/components/landing/why-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PreviewSection } from "@/components/landing/preview-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
	return (
		<div className="min-h-screen overflow-hidden relative">
			<HeroBackground />
			<Header />
			<Hero />
			<WhySection />
			<FeaturesSection />
			<PreviewSection />
			<CTASection />
			<Footer />
		</div>
	);
}

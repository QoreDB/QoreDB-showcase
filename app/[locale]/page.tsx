"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { HeroBackground } from "@/components/hero-background";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { WhySection } from "@/components/landing/why-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PreviewSection } from "@/components/landing/preview-section";
import { BlogSection } from "@/components/landing/blog-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
	const [showHeroBackground, setShowHeroBackground] = useState(true);
	const [bgKey, setBgKey] = useState(0);
	const wasHiddenRef = useRef(false);
	const bgWrapperRef = useRef<HTMLDivElement | null>(null);
	const rafIdRef = useRef<number | null>(null);
	const lastScrollYRef = useRef(0);
	const lastViewportHeightRef = useRef(0);
	const showHeroBackgroundRef = useRef(true);

	const handleScroll = useCallback(() => {
		lastScrollYRef.current = window.scrollY;
		lastViewportHeightRef.current = window.innerHeight;

		if (rafIdRef.current != null) return;
		rafIdRef.current = window.requestAnimationFrame(() => {
			rafIdRef.current = null;
			const scrollY = lastScrollYRef.current;
			const viewportHeight = lastViewportHeightRef.current || window.innerHeight;
			const shouldShow = scrollY <= viewportHeight;

			if (shouldShow !== showHeroBackgroundRef.current) {
				showHeroBackgroundRef.current = shouldShow;
				setShowHeroBackground(shouldShow);
				if (!shouldShow) {
					wasHiddenRef.current = true;
				} else if (wasHiddenRef.current) {
					setBgKey((prev) => prev + 1);
					wasHiddenRef.current = false;
				}
			}

			if (shouldShow && bgWrapperRef.current) {
				bgWrapperRef.current.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
			}
		});
	}, []);

	useEffect(() => {
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafIdRef.current != null) {
				window.cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [handleScroll]);

	return (
		<div className="min-h-screen overflow-hidden relative">
			{showHeroBackground && (
				<div
					key={bgKey}
					ref={bgWrapperRef}
					className="fixed inset-0 -z-10"
					style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }}
				>
					<HeroBackground />
				</div>
			)}
			<Header />
			<Hero />
			<WhySection />
			<FeaturesSection />
			<PreviewSection />
			<BlogSection />
			<CTASection />
			<Footer />
		</div>
	);
}

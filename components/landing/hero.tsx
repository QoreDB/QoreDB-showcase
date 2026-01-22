"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineShadowText } from "@/components/line-shadow-text";
import { useTranslation, Trans } from "react-i18next";

export function Hero() {
	const { t } = useTranslation();

	return (
		<main className="relative z-10 flex flex-col items-start justify-center min-h-screen px-4 sm:px-6 lg:px-12 max-w-6xl pl-6 sm:pl-12 lg:pl-20 pt-24 sm:pt-0">
			{/* Badge amélioré */}
			<motion.div
				className="mb-6 sm:mb-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="group inline-flex items-center gap-2 bg-(--q-bg-0)/80 backdrop-blur-md border border-(--q-border) rounded-full px-4 py-2 hover:border-(--q-accent)/40 transition-colors duration-300">
					<Sparkles className="w-4 h-4 text-(--q-accent)" />
					<span className="text-(--q-text-1) text-xs sm:text-sm font-medium">
						{t("hero.badges.opensource")}
					</span>
					<span className="w-1 h-1 rounded-full bg-(--q-border)" />
					<span className="text-(--q-text-1) text-xs sm:text-sm font-medium">
						{t("hero.badges.localfirst")}
					</span>
					<span className="w-1 h-1 rounded-full bg-(--q-border)" />
					<span className="text-(--q-text-1) text-xs sm:text-sm font-medium">
						{t("hero.badges.hybrid")}
					</span>
				</div>
			</motion.div>

			{/* Titre principal */}
			<motion.h1
				className="text-(--q-text-0) text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-6 sm:mb-8 tracking-tight"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
			>
				<Trans
					i18nKey="hero.title"
					components={{
						br: <br />,
						italic: <LineShadowText className="italic font-light" shadowColor="var(--q-accent)" />
					}}
				/>
			</motion.h1>

			<motion.p
				className="text-(--q-text-1) text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl leading-relaxed"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<Trans
					i18nKey="hero.subtitle"
					components={{
						highlight: <span className="text-(--q-text-0) font-medium" />
					}}
				/>
			</motion.p>

			<motion.div
				className="flex flex-col sm:flex-row gap-4"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
			<button
						className="group hidden md:flex items-center gap-2 relative overflow-hidden
							bg-(--q-text-0)/90 backdrop-blur-sm
							text-(--q-bg-0) px-5 lg:px-5 py-2 rounded-xl 
							text-sm lg:text-base font-semibold 
							border border-(--q-accent)/40
							shadow-[0_0_20px_color-mix(in_srgb,var(--q-accent)_15%,transparent)]
							hover:border-(--q-accent)/80
							hover:shadow-[0_0_30px_color-mix(in_srgb,var(--q-accent)_40%,transparent)]
							hover:scale-105 hover:-translate-y-0.5
							transition-all duration-300 ease-out"
					>
						<span 
							className="absolute inset-0 bg-linear-to-r from-transparent via-(--q-accent)/20 to-transparent animate-shimmer"
							style={{
								backgroundSize: '200% 100%',
								animation: 'shimmer 3s ease-in-out infinite',
							}}
						/>
						<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-(--q-accent) to-transparent opacity-60 group-hover:opacity-100 group-hover:h-0.5 transition-all duration-300" />
						<span className="absolute inset-0 rounded-xl bg-(--q-accent)/0 group-hover:bg-(--q-accent)/10 transition-colors duration-300" />
						
						<span className="relative z-10">{t("nav.join_beta")}</span>
						<ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
					</button>
				<Button
					variant="outline"
					size="lg"
					onClick={() => window.open("https://github.com/raphplt/QoreDB", "_blank")}
					className="group border-2 border-(--q-border) hover:border-(--q-text-2) bg-(--q-bg-0)/50 backdrop-blur-sm
						text-(--q-text-0) px-8 py-6 rounded-xl text-base font-medium 
						flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
				>
					<Github className="w-5 h-5" />
					{t("hero.cta.view_project")}
				</Button>
			</motion.div>
		</main>
	);
}

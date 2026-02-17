"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LineShadowText } from "@/components/line-shadow-text";
import { useTranslation, Trans } from "react-i18next";
import { useParams, useRouter } from "next/navigation";

export function Hero() {
	const { t } = useTranslation();
	const router = useRouter();
	const params = useParams();
	const locale = (params.locale as string) || "fr";

	return (
		<main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-12 pt-32 pb-20 overflow-hidden w-full">
			<motion.div
				className="mb-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div
					className="group inline-flex items-center gap-2 bg-(--q-bg-0)/80 
				backdrop-blur-md border border-(--q-border) rounded-full
				px-4 py-2 hover:border-(--q-accent)/40 transition-colors duration-300"
				>
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

			<motion.h1
				className="font-heading text-(--q-text-0) text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-8 tracking-tight text-center max-w-5xl"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
			>
				<Trans
					i18nKey="hero.title"
					components={{
						br: <br />,
						italic: (
							<LineShadowText
								className="italic font-light"
								shadowColor="var(--q-accent)"
							/>
						),
					}}
				/>
			</motion.h1>

			<motion.p
				className="text-(--q-text-1) text-base sm:text-lg md:text-xl mb-12 max-w-2xl leading-relaxed text-center"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<Trans
					i18nKey="hero.subtitle"
					components={{
						highlight: <span className="text-(--q-text-0) font-medium" />,
					}}
				/>
			</motion.p>

			<motion.div
				className="flex flex-col sm:flex-row gap-4 mb-24"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
				<motion.button
					whileHover={{ scale: 1.05, y: -2 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => router.push(`/${locale}/download`)}
					className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-xl
							bg-linear-to-br from-(--q-accent) to-(--q-accent-strong)
							text-white font-bold text-lg
							shadow-[0_20px_40px_-15px_color-mix(in_srgb,var(--q-accent)_50%,transparent)]
							hover:shadow-[0_30px_60px_-12px_color-mix(in_srgb,var(--q-accent)_70%,transparent)]
							border border-white/10 backdrop-blur-sm
							overflow-hidden transition-all duration-300"
				>
					<div
						className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"
						style={{
							backgroundSize: "200% 100%",
						}}
					/>
					<div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
					<div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
					<span className="relative z-10">{t("hero.cta.download_core")}</span>
					<ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
				</motion.button>
				<Button
					variant="outline"
					size="lg"
					onClick={() => router.push(`/${locale}/pricing`)}
					className="group border-2 border-(--q-border) hover:border-(--q-text-2) bg-(--q-bg-0)/50 backdrop-blur-sm
						text-(--q-text-0) px-8 py-6 rounded-xl text-base font-medium 
						flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
				>
					{t("hero.cta.discover_pro")}
				</Button>
			</motion.div>

			<motion.div
				className="relative w-full max-w-7xl perspective-[2000px] flex justify-center perspective-origin-top"
				initial={{ opacity: 0, rotateX: 20, y: 100 }}
				animate={{ opacity: 1, rotateX: 0, y: 0 }}
				transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 40 }}
			>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-(--q-accent)/30 blur-[120px] rounded-full pointer-events-none" />

				<div
					className="relative w-full flex justify-center items-center select-none"
					style={{
						transform: "rotateX(20deg)",
						transformStyle: "preserve-3d",
					}}
				>
					<motion.div
						className="absolute top-1/2 -translate-y-1/2 -left-12 sm:left-0 md:left-[5%] w-[60%] sm:w-[45%] aspect-16/10 rounded-xl bg-(--q-bg-0) shadow-2xl overflow-hidden z-10 opacity-60 grayscale-30 blur-[1px] transform transition-transform duration-500 hover:z-30 hover:opacity-100 hover:grayscale-0 hover:blur-0 hover:scale-105 hover:-translate-y-1/2 hover:-translate-x-2"
						initial={{ x: -100, opacity: 0 }}
						animate={{ x: 0, opacity: 0.6 }}
						transition={{ duration: 1, delay: 0.6 }}
						style={{ transform: "translateZ(-50px)" }}
					>
						<Image
							src="/images/screenshots/er-diagram-screen.png"
							alt="Schema Explorer"
							fill
							className="object-cover object-top"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</motion.div>

					<motion.div
						className="absolute top-1/2 -translate-y-1/2 -right-12 sm:right-0 md:right-[5%] w-[60%] sm:w-[45%] aspect-16/10 rounded-xl bg-(--q-bg-0) shadow-2xl overflow-hidden z-10 opacity-60 grayscale-30 blur-[1px] transform transition-transform duration-500 hover:z-30 hover:opacity-100 hover:grayscale-0 hover:blur-0 hover:scale-105 hover:-translate-y-1/2 hover:translate-x-2"
						initial={{ x: 100, opacity: 0 }}
						animate={{ x: 0, opacity: 0.6 }}
						transition={{ duration: 1, delay: 0.6 }}
						style={{ transform: "translateZ(-50px)" }}
					>
						<Image
							src="/images/screenshots/table-screen.png"
							alt="Table Data View"
							fill
							className="object-cover object-top"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</motion.div>

					<motion.div
						className="relative z-20 w-[90%] sm:w-[70%] aspect-16/10 rounded-xl bg-(--q-bg-0) shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
						style={{ transform: "translateZ(0px)" }}
					>
						<div className="absolute inset-0 bg-(--q-bg-0)">
							<Image
								src="/images/screenshots/database-screen.png"
								alt="QoreDB Dashboard"
								fill
								className="object-cover object-top"
								sizes="100vw"
								priority
							/>
						</div>
						
						<div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none z-30" />
					</motion.div>
				</div>
				
				<div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-screen h-96 bg-linear-to-t from-(--q-bg-1) via-(--q-bg-1)/50 to-transparent z-30 pointer-events-none" />
			</motion.div>
		</main>
	);
}


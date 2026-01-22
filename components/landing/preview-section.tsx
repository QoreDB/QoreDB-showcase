"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation, Trans } from "react-i18next";

export function PreviewSection() {
	const { t } = useTranslation();

	return (
		<section
			id="preview"
			className="relative z-10 py-32 px-6 bg-(--q-bg-1) overflow-hidden"
		>
			{/* Background pattern subtil */}
			<div className="absolute inset-0 opacity-30">
				<div 
					className="absolute inset-0"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, var(--q-border) 1px, transparent 0)`,
						backgroundSize: '32px 32px',
					}}
				/>
			</div>
			
			{/* Gradient overlay pour fondu */}
			<div className="absolute inset-0 bg-linear-to-b from-(--q-bg-1) via-transparent to-(--q-bg-1)" />
			
			<div className="max-w-6xl mx-auto relative">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					{/* Eyebrow */}
					<span className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase mb-4">
						{t("preview.eyebrow")}
					</span>
					
					<h2 className="text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
						<Trans
							i18nKey="preview.title"
							components={{
								accent: <span className="text-(--q-accent)" />
							}}
						/>
					</h2>
					<p className="text-(--q-text-1) text-lg max-w-2xl mx-auto leading-relaxed">
						<Trans
							i18nKey="preview.description"
							components={{
								subtext: <span className="text-(--q-text-2)" />,
								br: <br />
							}}
						/>
					</p>
				</motion.div>

				<motion.div
					className="relative"
					initial={{ opacity: 0, y: 40, scale: 0.95 }}
					whileInView={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
				>
					{/* Glow effects multiples pour plus de profondeur */}
					<div className="absolute -inset-8 bg-linear-to-r from-(--q-accent)/20 via-transparent to-(--q-accent)/20 blur-3xl opacity-40" />
					<div className="absolute -inset-4 bg-(--q-accent)/10 blur-2xl opacity-30 rounded-3xl" />
					
					{/* Browser frame */}
					<div className="relative rounded-2xl overflow-hidden border border-(--q-border) bg-(--q-bg-0) shadow-2xl">
						{/* Browser top bar */}
						<div className="flex items-center gap-2 px-4 py-3 bg-(--q-bg-1) border-b border-(--q-border)">
							<div className="flex gap-2">
								<div className="w-3 h-3 rounded-full bg-(--q-error)/60" />
								<div className="w-3 h-3 rounded-full bg-(--q-warning)/60" />
								<div className="w-3 h-3 rounded-full bg-(--q-success)/60" />
							</div>
							<div className="flex-1 flex justify-center">
								<div className="px-4 py-1 rounded-md bg-(--q-bg-2) text-(--q-text-2) text-xs font-mono">
									{t("preview.browser_bar")}
								</div>
							</div>
							<div className="w-[52px]" /> {/* Spacer for symmetry */}
						</div>
						
						{/* App screenshot */}
						<Image
							src="/app-preview.png"
							alt="QoreDB Interface"
							width={1920}
							height={1080}
							className="w-full"
							priority
						/>
					</div>
					
					{/* Floating badges */}
					<motion.div
						className="absolute -right-4 top-1/4 hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-(--q-bg-0) border border-(--q-border) shadow-lg"
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						viewport={{ once: true }}
					>
						<div className="w-2 h-2 rounded-full bg-(--q-success) animate-pulse" />
						<span className="text-(--q-text-0) text-sm font-medium">{t("preview.badges.performance")}</span>
					</motion.div>
					
					<motion.div
						className="absolute -left-4 bottom-1/4 hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-(--q-bg-0) border border-(--q-border) shadow-lg"
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						viewport={{ once: true }}
					>
						<div className="w-6 h-6 rounded-md bg-(--q-accent)/10 flex items-center justify-center">
							<span className="text-(--q-accent) text-xs font-bold">⌘</span>
						</div>
						<span className="text-(--q-text-0) text-sm font-medium">{t("preview.badges.keyboard")}</span>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

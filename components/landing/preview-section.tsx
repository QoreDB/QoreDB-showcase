"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useTranslation, Trans } from "react-i18next";
import {
	Activity,
	GitGraph,
	Home,
	PlusCircle,
	ShieldCheck,
	Table,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const TABS = [
	{
		id: "home",
		image: "/images/screenshots/home-screen.webp",
		icon: Home,
	},
	{
		id: "connection",
		image: "/images/screenshots/new-connection-screen.webp",
		icon: PlusCircle,
	},
	{
		id: "database",
		image: "/images/screenshots/database-screen.webp",
		icon: Activity,
	},
	{
		id: "table",
		image: "/images/screenshots/table-screen.webp",
		icon: Table,
	},
	{
		id: "schema",
		image: "/images/screenshots/er-diagram-screen.webp",
		icon: GitGraph,
	},
	{
		id: "security",
		image: "/images/screenshots/settings-screen.webp",
		icon: ShieldCheck,
	},
];

export function PreviewSection() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState(TABS[0].id);
	const containerRef = useRef(null);
	const isInView = useInView(containerRef, { amount: 0.1 });

	useEffect(() => {
		if (!isInView) return;

		const interval = setInterval(() => {
			setActiveTab((current) => {
				const currentIndex = TABS.findIndex((tab) => tab.id === current);
				const nextIndex = (currentIndex + 1) % TABS.length;
				return TABS[nextIndex].id;
			});
		}, 5000);

		return () => clearInterval(interval);
	}, [isInView]);

	return (
		<section
			ref={containerRef}
			id="preview"
			className="relative z-10 py-24 sm:py-32 px-6 bg-(--q-bg-1) overflow-hidden"
		>
			<div className="absolute inset-0 opacity-30 pointer-events-none">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, var(--q-border) 1px, transparent 0)`,
						backgroundSize: "32px 32px",
					}}
				/>
			</div>

			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-linear-to-b from-(--q-bg-1) via-transparent to-(--q-bg-1) pointer-events-none" />

			<div className="max-w-7xl mx-auto relative">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<span className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase mb-4">
						{t("preview.eyebrow")}
					</span>

					<h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
						<Trans
							i18nKey="preview.title"
							components={{
								accent: <span className="text-(--q-accent)" />,
							}}
						/>
					</h2>
					<p className="text-(--q-text-1) text-lg max-w-2xl mx-auto leading-relaxed">
						<Trans
							i18nKey="preview.description"
							components={{
								subtext: <span className="text-(--q-text-2) block mt-2" />,
							}}
						/>
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
					{/* Left Column: Tabs */}
					<div className="lg:col-span-4 flex flex-col gap-4">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;

							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"group relative flex items-start gap-4 p-4 text-left rounded-xl transition-all duration-300 overflow-hidden",
										"border border-transparent",
										isActive
											? "bg-(--q-bg-0) border-(--q-border) shadow-sm"
											: "hover:bg-(--q-bg-0)/50 hover:border-(--q-border)/50"
									)}
								>
									<div
										className={cn(
											"p-2 rounded-lg transition-colors duration-300 shrink-0",
											isActive
												? "bg-(--q-accent) text-white"
												: "bg-(--q-bg-2) text-(--q-text-2) group-hover:text-(--q-text-1)"
										)}
									>
										<Icon className="w-5 h-5" />
									</div>
									<div>
										<h3
											className={cn(
												"font-medium text-base mb-1 transition-colors",
												isActive ? "text-(--q-text-0)" : "text-(--q-text-1)"
											)}
										>
											{t(`preview.tabs.${tab.id}.title`)}
										</h3>
										<p className="text-sm text-(--q-text-2) leading-relaxed">
											{t(`preview.tabs.${tab.id}.description`)}
										</p>
									</div>

									{/* Progress bar for active state */}
									{isActive && (
										<motion.div
											layoutId="active-tab-indicator"
											className="absolute left-0 top-0 bottom-0 w-1 bg-(--q-accent)"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
										/>
									)}
									
									{/* Timer progress bar */}
									{isActive && isInView && (
										<motion.div 
											className="absolute bottom-0 left-0 h-1 bg-(--q-accent)/20 w-full"
											initial={{ scaleX: 0, originX: 0 }}
											animate={{ scaleX: 1 }}
											transition={{ duration: 5, ease: "linear" }}
										/>
									)}
								</button>
							);
						})}
					</div>

					{/* Right Column: Preview Area */}
					<div className="lg:col-span-8 relative">
						{/* Glow effects */}
						<div className="absolute -inset-4 bg-linear-to-r from-(--q-accent)/20 via-transparent to-(--q-accent)/20 blur-3xl opacity-30 pointer-events-none" />

						<div className="relative rounded-xl overflow-hidden border border-(--q-border) bg-(--q-bg-0) shadow-2xl">

							{/* Image Area with Transitions */}
							<div className="relative aspect-16/10 bg-(--q-bg-0)">
								<AnimatePresence mode="wait">
									<motion.div
										key={activeTab}
										initial={{ opacity: 0, scale: 0.98 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 1.02 }}
										transition={{ duration: 0.3 }}
										className="absolute inset-0"
									>
										<Image
											src={
												TABS.find((t) => t.id === activeTab)?.image ||
												""
											}
											alt={t(`preview.tabs.${activeTab}.title`)}
											fill
											className="object-cover object-top"
											sizes="(max-width: 1024px) 100vw, 66vw"
										/>
									</motion.div>
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

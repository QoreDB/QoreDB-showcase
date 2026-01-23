"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Target } from "lucide-react";

export default function RoadmapPage() {
	const { t } = useTranslation();

	const sections = [
		{
			key: "now",
			accent: "from-emerald-400 to-emerald-600",
			border: "hover:border-emerald-500/30",
			bg: "hover:bg-emerald-500/5",
		},
		{
			key: "soon",
			accent: "from-blue-400 to-blue-600",
			border: "hover:border-blue-500/30",
			bg: "hover:bg-blue-500/5",
		},
		{
			key: "later",
			accent: "from-purple-400 to-purple-600",
			border: "hover:border-purple-500/30",
			bg: "hover:bg-purple-500/5",
		},
	];

	const items = ["1", "2", "3", "4", "5"];

	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
				{/* Hero Section */}
				<div className="text-center mb-16 relative">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-(--q-accent) opacity-5 blur-[100px] rounded-full pointer-events-none" />
					<h1 className="relative text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-br from-(--q-text-0) to-(--q-text-1)">
						{t("roadmap_page.title")}
					</h1>
					<p className="relative text-xl text-(--q-text-1) max-w-2xl mx-auto leading-relaxed">
						{t("roadmap_page.subtitle")}
					</p>
				</div>

				{/* Roadmap Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
					{sections.map((section) => (
						<div
							key={section.key}
							className={`group flex flex-col h-full p-8 rounded-2xl border border-(--q-border) bg-(--q-bg-1)/30 transition-all duration-300 ${section.border} ${section.bg}`}
						>
							<div className="mb-6">
								<div className="flex items-center gap-3 mb-3">
									<h2
										className={`text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r ${section.accent}`}
									>
										{t(`roadmap_page.${section.key}.title`)}
									</h2>
								</div>

								<div
									className={`h-0.5 w-12 bg-linear-to-r ${section.accent} rounded-full mb-4 opacity-70 group-hover:w-20 transition-all duration-500`}
								/>

								<blockquote className="text-(--q-text-1) italic text-sm leading-relaxed border-l-2 border-(--q-text-2) pl-4 py-1">
									&ldquo;{t(`roadmap_page.${section.key}.quote`)}&rdquo;
								</blockquote>
							</div>

							<ul className="space-y-4 mb-8 flex-1">
								{items.map((itemNum) => (
									<li key={itemNum} className="flex items-start gap-3 group/item">
										<div
											className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-linear-to-r ${section.accent} shrink-0 opacity-70 group-hover/item:opacity-100 transition-opacity`}
										/>
										<span className="text-(--q-text-1) group-hover/item:text-(--q-text-0) transition-colors duration-200">
											{t(`roadmap_page.${section.key}.items.${itemNum}`)}
										</span>
									</li>
								))}
							</ul>

							<div className="mt-auto pt-6 border-t border-(--q-border)/50 flex items-start gap-3">
								<Target className="w-4 h-4 shrink-0 text-(--q-text-1)/70 mt-0.5" />
								<p className="text-sm font-medium text-(--q-text-0)/80">
									{t(`roadmap_page.${section.key}.goal`)}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Transparency Note */}
				<div className="max-w-2xl mx-auto">
					<Alert className="bg-(--q-input-bg)/50 border-(--q-border) backdrop-blur-sm">
						<Info className="h-4 w-4 text-(--q-text-1)" />
						<AlertDescription className="text-(--q-text-1)">
							{t("roadmap_page.transparency.text")}
						</AlertDescription>
					</Alert>
				</div>
			</main>
			<Footer />
		</div>
	);
}

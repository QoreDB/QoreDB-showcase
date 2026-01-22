"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
	Database,
	Shield,
	Terminal,
	FolderOpen,
	Layers,
	Zap,
	RefreshCw,
	Lock,
} from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const featureIcons = {
	unified: Database,
	vault: Shield,
	ssh: Lock,
	editor: Terminal,
	library: FolderOpen,
	envs: Layers,
	grid: Zap,
	update: RefreshCw,
};

const databases = [
	{ name: "MySQL", image: "/images/databases/mysql.png", color: "#00758F" },
	{ name: "PostgreSQL", image: "/images/databases/postgresql.png", color: "#336791" },
	{ name: "MongoDB", image: "/images/databases/mongodb.png", color: "#47A248" },
];

export function FeaturesSection() {
	const { t } = useTranslation();

	const features = (Object.keys(featureIcons) as Array<keyof typeof featureIcons>).map(key => ({
		key,
		icon: featureIcons[key],
		title: t(`features.items.${key}.title`),
		description: t(`features.items.${key}.desc`),
	}));

	return (
		<section id="features" className="relative z-10 py-32 px-6 bg-(--q-bg-0)">
			<div className="max-w-6xl mx-auto">
				<motion.div
					className="text-center mb-20"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<span className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase mb-4">
						{t("features.eyebrow")}
					</span>
					
					<h2 className="text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
						<Trans i18nKey="features.title" components={{ accent: <span className="text-(--q-accent)" />, relative: <span className="relative" />, underline: <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 8 Q50 0 100 8" stroke="var(--q-accent)" strokeWidth="2" fill="none" strokeLinecap="round" /></svg> }} />
					</h2>
					

					<p className="text-(--q-text-1) text-lg max-w-2xl mx-auto leading-relaxed">
						{t("features.subtitle")}
					</p>
				</motion.div>

				{/* Features grid - 2 colonnes sur mobile, 4 sur desktop */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{features.map((feature, index) => (
						<motion.div
							key={feature.key}
							className="group relative p-6 rounded-2xl bg-(--q-bg-1) border border-(--q-border) hover:border-(--q-accent)/40"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: index * 0.05 }}
							viewport={{ once: true }}
						>
							{/* Subtle glow on hover */}
							<div className="absolute inset-0 rounded-2xl bg-(--q-accent)/0 group-hover:bg-(--q-accent)/5 transition-colors duration-300" />
							
							<div className="relative">
								<div className="w-11 h-11 rounded-xl bg-(--q-accent)/10 flex items-center justify-center mb-4 group-hover:bg-(--q-accent) transition-colors duration-300">
									<feature.icon className="w-5 h-5 text-(--q-accent) group-hover:text-white transition-colors duration-300" />
								</div>
								<h3 className="text-(--q-text-0) font-semibold text-base mb-2">
									{feature.title}
								</h3>
								<p className="text-(--q-text-2) text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				{/* Databases section */}
				<motion.div
					className="mt-32"
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<div className="text-center mb-12">
						<span className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase mb-4">
							{t("features.compatibility.eyebrow")}
						</span>
						<h3 className="text-(--q-text-0) text-2xl sm:text-3xl font-bold tracking-tight">
							{t("features.compatibility.title")}
						</h3>
					</div>
					
					<div className="flex flex-wrap justify-center gap-8">
						{databases.map((db, index) => (
							<motion.div
								key={db.name}
								className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-(--q-bg-1) border border-(--q-border) min-w-[160px] hover:shadow-xl transition-shadow"
								style={{
									"--db-color": db.color,
								} as React.CSSProperties}
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ 
									borderColor: db.color,
								}}
							>
								<div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-110">
									<Image
										src={db.image}
										alt={db.name}
										fill
										className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
									/>
								</div>
								<span className="font-semibold text-(--q-text-0) text-lg">
									{db.name}
								</span>
							</motion.div>
						))}
					</div>
					
					{/* Coming soon hint */}
					<p className="text-center mt-8 text-(--q-text-2) text-sm">
						{t("features.compatibility.coming_soon")}
					</p>
				</motion.div>
			</div>
		</section>
	);
}


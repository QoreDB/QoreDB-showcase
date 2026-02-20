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
	Lock,

	Github,
	GitBranch,
	Network,
	LifeBuoy,
	Check,
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
	opensource: Github,
};

const databases = [
	{ name: "PostgreSQL", image: "/images/databases/postgresql.webp", color: "#336791" },
	{ name: "MySQL / MariaDB", image: "/images/databases/mysql.webp", color: "#00758F" },
	{ name: "SQL Server", image: "/images/databases/sqlserver.png", color: "#CC2927" },
	{ name: "SQLite", image: "/images/databases/sqlite.webp", color: "#00758F" },
	{ name: "DuckDB", image: "/images/databases/duckdb.png", color: "#FFF100" },
	{ name: "MongoDB", image: "/images/databases/mongodb.webp", color: "#47A248" },
	{ name: "Redis", image: "/images/databases/redis.png", color: "#DC382D" },
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

					<h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
						<Trans
							i18nKey="features.title"
							components={{
								accent: <span className="text-(--q-accent)" />,
								relative: <span className="relative" />,
								underline: (
									<svg
										className="absolute -bottom-2 left-0 w-full h-3"
										viewBox="0 0 100 10"
										preserveAspectRatio="none"
									>
										<path
											d="M0 8 Q50 0 100 8"
											stroke="var(--q-accent)"
											strokeWidth="2"
											fill="none"
											strokeLinecap="round"
										/>
									</svg>
								),
							}}
						/>
					</h2>

					<p className="text-(--q-text-1) text-lg max-w-2xl mx-auto leading-relaxed">
						{t("features.subtitle")}
					</p>
				</motion.div>

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
							<div className="absolute inset-0 rounded-2xl bg-(--q-accent)/0 group-hover:bg-(--q-accent)/5 transition-colors duration-300" />

							<div className="relative">
								<div className="w-11 h-11 rounded-xl bg-(--q-accent)/10 flex items-center justify-center mb-4 group-hover:bg-(--q-accent) transition-colors duration-300">
									<feature.icon className="w-5 h-5 text-(--q-accent) group-hover:text-white transition-colors duration-300" />
								</div>
								<h3 className="font-heading text-(--q-text-0) font-semibold text-base mb-2">
									{feature.title}
								</h3>
								<p className="text-(--q-text-2) text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				<div className="mt-32 space-y-32">
					{/* Feature 1: Sandbox */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
					>
						<div className="order-2 lg:order-1 relative group">
							<div className="absolute -inset-4 bg-linear-to-r from-(--q-accent)/20 to-purple-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<Image
								src="/images/features/sandbox.png"
								alt="Sandbox feature"
								width={1200}
								height={800}
								className="relative w-full h-auto"
							/>
						</div>
						<div className="order-1 lg:order-2">
							<div className="flex flex-wrap items-center gap-2 mb-6">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--q-accent)/10 text-(--q-accent) text-xs font-medium tracking-wide uppercase">
									<GitBranch className="w-3 h-3" />
									{t("features.killer.sandbox.badge")}
								</div>
								<span className="inline-flex rounded-full bg-[#6B5CFF]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#6B5CFF]">
									{t("features.pro_badge")}
								</span>
								<span className="inline-flex rounded-full bg-[#6B5CFF]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#6B5CFF]">
									{t("features.visual_diff_badge")}
								</span>
							</div>
							<h3 className="font-heading text-3xl sm:text-4xl font-bold text-(--q-text-0) mb-6">
								{t("features.killer.sandbox.title")}
							</h3>
							<p className="text-(--q-text-1) text-lg leading-relaxed mb-8">
								{t("features.killer.sandbox.desc")}
							</p>
							<ul className="space-y-4">
								{[
									"features.killer.sandbox.list.local",
									"features.killer.sandbox.list.diff",
									"features.killer.sandbox.list.script",
								].map(key => (
									<li key={key} className="flex items-start gap-3">
										<div className="mt-1 w-5 h-5 rounded-full bg-(--q-accent)/10 flex items-center justify-center shrink-0">
											<Check className="w-3 h-3 text-(--q-accent)" />
										</div>
										<span className="text-(--q-text-1)">{t(key)}</span>
									</li>
								))}
							</ul>
						</div>
					</motion.div>

					{/* Feature 2: ER Diagram */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
					>
						<div className="order-1">
							<div className="flex flex-wrap items-center gap-2 mb-6">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium tracking-wide uppercase">
									<Network className="w-3 h-3" />
									{t("features.killer.er_diagram.badge")}
								</div>
							</div>
							<h3 className="font-heading text-3xl sm:text-4xl font-bold text-(--q-text-0) mb-6">
								{t("features.killer.er_diagram.title")}
							</h3>
							<p className="text-(--q-text-1) text-lg leading-relaxed mb-8">
								{t("features.killer.er_diagram.desc")}
							</p>
							<ul className="space-y-4">
								{[
									"features.killer.er_diagram.list.canvas",
									"features.killer.er_diagram.list.nav",
									"features.killer.er_diagram.list.peek",
								].map(key => (
									<li key={key} className="flex items-start gap-3">
										<div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
											<Check className="w-3 h-3 text-blue-500" />
										</div>
										<span className="text-(--q-text-1)">{t(key)}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="order-2 relative group">
							<div className="absolute -inset-4 bg-linear-to-l from-blue-500/20 to-cyan-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<Image
								src="/images/features/er-diagram.png"
								alt="ER Diagram feature"
								width={1200}
								height={800}
								className="relative w-full h-auto"
							/>
						</div>
					</motion.div>

					{/* Feature 3: Safety Net */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
					>
						<div className="order-2 lg:order-1 relative group">
							<div className="absolute -inset-4 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<Image
								src="/images/features/query-safety.png"
								alt="Query safety feature"
								width={1200}
								height={800}
								className="relative w-full h-auto"
							/>
						</div>
						<div className="order-1 lg:order-2">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium tracking-wide uppercase mb-6">
								<LifeBuoy className="w-3 h-3" />
								{t("features.killer.safety_net.badge")}
							</div>
							<h3 className="font-heading text-3xl sm:text-4xl font-bold text-(--q-text-0) mb-6">
								{t("features.killer.safety_net.title")}
							</h3>
							<p className="text-(--q-text-1) text-lg leading-relaxed mb-8">
								{t("features.killer.safety_net.desc")}
							</p>
							<ul className="space-y-4">
								{[
									"features.killer.safety_net.list.detect",
									"features.killer.safety_net.list.env",
									"features.killer.safety_net.list.audit",
								].map(key => (
									<li key={key} className="flex items-start gap-3">
										<div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
											<Check className="w-3 h-3 text-emerald-500" />
										</div>
										<span className="text-(--q-text-1)">{t(key)}</span>
									</li>
								))}
							</ul>
						</div>
					</motion.div>
				</div>

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
						<h3 className="font-heading text-(--q-text-0) text-2xl sm:text-3xl font-bold tracking-tight">
							{t("features.compatibility.title")}
						</h3>
					</div>

					<div className="flex flex-wrap justify-center gap-8">
						{databases.map((db, index) => (
							<motion.div
								key={db.name}
								className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-(--q-bg-1) border border-(--q-border) min-w-[160px] hover:shadow-xl transition-shadow"
								style={
									{
										"--db-color": db.color,
									} as React.CSSProperties
								}
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
								<span className="font-heading font-semibold text-(--q-text-0) text-lg">
									{db.name}
								</span>
							</motion.div>
						))}
					</div>

					<p className="text-center mt-8 text-(--q-text-2) text-sm">
						{t("features.compatibility.coming_soon")}
					</p>
				</motion.div>
			</div>
		</section>
	);
}


"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const painPoints = [
	{
		key: "slow",
		image: "/images/illustrations/time.webp",
		color: "--q-warning",
	},
	{
		key: "dated",
		image: "/images/illustrations/palette.webp",
		color: "--q-error",
	},
	{
		key: "tiring",
		image: "/images/illustrations/brain.webp",
		color: "--q-text-2",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
		},
	},
};

export function WhySection() {
	const { t } = useTranslation();

	return (
		<section className="relative z-10 py-32 px-6 bg-(--q-bg-1)">
			<div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />

			<motion.div
				className="max-w-4xl mx-auto text-center"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7 }}
				viewport={{ once: true }}
			>
				<motion.span
					className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase mb-4"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
				>
					{t("why.eyebrow")}
				</motion.span>

				<h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
					{t("why.title_pre")}
					<span className="text-(--q-accent)">{t("why.title_highlight")}</span>
				</h2>
				<p className="text-(--q-text-1) text-lg sm:text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
					{t("why.description")}
				</p>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					{painPoints.map((point) => (
						<motion.div
							key={point.key}
							className="group flex flex-col items-center p-8 rounded-2xl bg-(--q-bg-0) border border-(--q-border) hover:border-(--q-accent)/30 transition-[border-color,box-shadow] duration-500 hover:shadow-lg hover:shadow-(--q-accent)/5"
							variants={itemVariants}
						>
							<div className="relative w-24 h-24 mb-6 transition-transform duration-500 group-hover:scale-110">
								<Image
									src={point.image}
									alt={t(`why.items.${point.key}.title`)}
									fill
									className="object-contain drop-shadow-lg"
								/>
							</div>
							<span className="font-heading text-(--q-text-0) font-bold text-xl mb-1">
								{t(`why.items.${point.key}.title`)}
							</span>
							<span className="text-(--q-text-2) text-sm">
								{t(`why.items.${point.key}.desc`)}
							</span>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					className="relative inline-block"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.7, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<div className="absolute -inset-4 bg-(--q-accent)/5 blur-2xl rounded-full" />

					<p className="relative text-(--q-text-0) text-xl sm:text-2xl font-medium leading-relaxed">
						{t("why.comparison.pre")}
						<span className="font-bold text-(--q-accent) hover:underline decoration-2 underline-offset-4 cursor-default transition-colors">
							Linear
						</span>
						,{" "}
						<span className="font-bold text-(--q-accent) hover:underline decoration-2 underline-offset-4 cursor-default transition-colors">
							Raycast
						</span>{" "}
						ou{" "}
						<span className="font-bold text-(--q-accent) hover:underline decoration-2 underline-offset-4 cursor-default transition-colors">
							VS Code
						</span>{" "}
						{t("why.comparison.post")}
					</p>
				</motion.div>
			</motion.div>

			{/* Separator subtil en bas */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />
		</section>
	);
}

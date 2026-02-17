"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
	ArrowRight,
	CheckCircle2,
	AlertCircle,
	Loader2,
	MessageSquare,
	Send,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { sendEmail } from "@/actions/send-email";
import { contactSchema, ContactFormData } from "@/lib/schemas";

export function CTASection() {
	const { t } = useTranslation();
	const params = useParams();
	const locale = (params.locale as string) || "fr";
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
	});

	const onSubmit = async (data: ContactFormData) => {
		setSubmitError(null);

		const result = await sendEmail(data);

		if (result.success) {
			setIsSuccess(true);
			reset();
		} else {
			setSubmitError(result.error || t("cta.form.error"));
		}
	};

	return (
		<section id="pricing" className="py-24 lg:py-32 px-4 relative overflow-hidde">
			<div id="contact" className="absolute -top-24" aria-hidden />
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-(--q-accent)/5 to-transparent opacity-20 pointer-events-none" />
			<div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-(--q-accent)/5 rounded-full blur-[120px] pointer-events-none" />

			<div className="container mx-auto max-w-7xl relative z-10">
				<div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="text-center lg:text-left"
					>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--q-accent)/10 text-(--q-accent) text-sm font-medium mb-8">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--q-accent) opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-(--q-accent)"></span>
							</span>
							{t("cta.badge")}
						</div>

						<h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
							{t("cta.title_pre")}
							<br className="hidden lg:block" />
							<span className="text-transparent bg-clip-text bg-linear-to-r from-(--q-accent) to-(--q-accent-strong)">
								{t("cta.title_highlight")}
							</span>
						</h2>

						<p className="text-xl text-(--q-text-2) max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
							{t("cta.description")}
						</p>

						<div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
							<Link
								href={`/${locale}/download`}
								className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-(--q-foreground) text-(--q-bg) font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-(--q-accent)/10 hover:-translate-y-0.5 overflow-hidden"
							>
								<div className="absolute inset-0 bg-(--q-accent) opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
								<span>{t("cta.download_button")}</span>
								<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
							<Link
								href={`/${locale}/pricing`}
								className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-(--q-border) bg-(--q-bg-0) text-(--q-text-0) font-semibold text-lg transition-all duration-300 hover:border-(--q-accent)/40 hover:-translate-y-0.5 overflow-hidden"
							>
								<span>{t("cta.pricing_button")}</span>
								<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>

						<div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-(--q-text-2) text-sm font-medium opacity-80">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4 text-(--q-accent)" />
								<span>{t("cta.trust.spam")}</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4 text-(--q-accent)" />
								<span>{t("cta.trust.announcements")}</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4 text-(--q-accent)" />
								<span>{t("cta.trust.priority")}</span>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
						className="relative"
					>
						<div className="absolute inset-0 bg-linear-to-tr from-(--q-accent)/20 to-transparent rounded-3xl blur-2xl opacity-40 pointer-events-none transform rotate-3" />

						<div className="relative bg-(--q-bg-card)/80 backdrop-blur-xl border border-(--q-border) rounded-2xl p-8 lg:p-10 shadow-2xl">
							<div className="mb-8 flex items-center gap-3">
								<div className="p-3 bg-(--q-bg-app) rounded-xl border border-(--q-border)">
									<MessageSquare className="w-6 h-6 text-(--q-accent)" />
								</div>
								<div>
									<h3 className="text-xl font-bold">{t("cta.contact_title")}</h3>
									<p className="text-sm text-(--q-text-2) mt-0.5">
										{t("cta.form.reply_time")}
									</p>
								</div>
							</div>

							{isSuccess ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className="flex flex-col items-center justify-center py-12 text-center"
								>
									<div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
										<CheckCircle2 className="w-8 h-8 text-green-500" />
									</div>
									<h4 className="text-2xl font-bold mb-2">
										{t("cta.form.success_title")}
									</h4>
									<p className="text-(--q-text-2) mb-8 max-w-xs">
										{t("cta.form.success")}
									</p>
									<button
										onClick={() => setIsSuccess(false)}
										className="text-sm font-medium text-(--q-accent) hover:text-(--q-accent-strong) hover:underline transition-colors"
									>
										{t("cta.form.send_another")}
									</button>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
									<div className="grid grid-cols-2 gap-5">
										<div className="space-y-1.5">
											<label className="text-xs font-semibold uppercase tracking-wider text-(--q-text-2) ml-1">
												{t("cta.form.name")}
											</label>
											<input
												{...register("name")}
												className={`w-full px-4 py-3 rounded-xl bg-(--q-bg-app)/50 border ${errors.name ? "border-red-500/50 focus:border-red-500" : "border-(--q-border) focus:border-(--q-accent)"} focus:ring-4 focus:ring-(--q-accent)/10 outline-none transition-all duration-200 placeholder:text-(--q-text-2)/40`}
												placeholder={t("cta.form.placeholders.name")}
											/>
											{errors.name && (
												<p className="text-xs text-red-500 ml-1">{errors.name.message}</p>
											)}
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold uppercase tracking-wider text-(--q-text-2) ml-1">
												{t("cta.form.email")}
											</label>
											<input
												{...register("email")}
												type="email"
												className={`w-full px-4 py-3 rounded-xl bg-(--q-bg-app)/50 border ${errors.email ? "border-red-500/50 focus:border-red-500" : "border-(--q-border) focus:border-(--q-accent)"} focus:ring-4 focus:ring-(--q-accent)/10 outline-none transition-all duration-200 placeholder:text-(--q-text-2)/40`}
												placeholder={t("cta.form.placeholders.email")}
											/>
											{errors.email && (
												<p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
											)}
										</div>
									</div>

									<div className="space-y-1.5">
										<label className="text-xs font-semibold uppercase tracking-wider text-(--q-text-2) ml-1">
											{t("cta.form.subject")}
										</label>
										<input
											{...register("subject")}
											className={`w-full px-4 py-3 rounded-xl bg-(--q-bg-app)/50 border ${errors.subject ? "border-red-500/50 focus:border-red-500" : "border-(--q-border) focus:border-(--q-accent)"} focus:ring-4 focus:ring-(--q-accent)/10 outline-none transition-all duration-200 placeholder:text-(--q-text-2)/40`}
											placeholder={t("cta.form.placeholders.subject")}
										/>
										{errors.subject && (
											<p className="text-xs text-red-500 ml-1">{errors.subject.message}</p>
										)}
									</div>

									<div className="space-y-1.5">
										<label className="text-xs font-semibold uppercase tracking-wider text-(--q-text-2) ml-1">
											{t("cta.form.message")}
										</label>
										<textarea
											{...register("message")}
											rows={4}
											className={`w-full px-4 py-3 rounded-xl bg-(--q-bg-app)/50 border ${errors.message ? "border-red-500/50 focus:border-red-500" : "border-(--q-border) focus:border-(--q-accent)"} focus:ring-4 focus:ring-(--q-accent)/10 outline-none transition-all duration-200 resize-none placeholder:text-(--q-text-2)/40`}
											placeholder={t("cta.form.placeholders.message")}
										/>
										{errors.message && (
											<p className="text-xs text-red-500 ml-1">{errors.message.message}</p>
										)}
									</div>

									<div style={{ display: "none" }} aria-hidden="true">
										<input {...register("address")} tabIndex={-1} autoComplete="off" />
									</div>

									{submitError && (
										<div className="px-4 py-3 bg-red-500/10 border border-red-500/10 rounded-xl text-red-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
											<AlertCircle className="w-4 h-4 shrink-0" />
											{submitError}
										</div>
									)}

									<button
										type="submit"
										disabled={isSubmitting}
										className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-(--q-accent) hover:bg-(--q-accent-strong) text-white font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-(--q-accent)/25 hover:-translate-y-0.5 active:translate-y-0"
									>
										{isSubmitting ? (
											<>
												<Loader2 className="w-5 h-5 animate-spin" />
												<span>{t("cta.form.sending")}</span>
											</>
										) : (
											<>
												<span>{t("cta.form.submit")}</span>
												<Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
											</>
										)}
									</button>
								</form>
							)}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

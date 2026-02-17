"use client";

import { FormEvent, useState } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useTranslation } from "react-i18next";

type StatusResponse = {
	status: string;
	paymentId?: string;
	licenseKey?: string | null;
};

export default function LicensePage() {
	const { t } = useTranslation();
	const [statusEmail, setStatusEmail] = useState("");
	const [paymentId, setPaymentId] = useState("");
	const [statusResult, setStatusResult] = useState<StatusResponse | null>(null);
	const [statusError, setStatusError] = useState<string | null>(null);
	const [statusLoading, setStatusLoading] = useState(false);

	const [resendEmail, setResendEmail] = useState("");
	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const [resendError, setResendError] = useState<string | null>(null);
	const [resendLoading, setResendLoading] = useState(false);

	const handleStatus = async (event: FormEvent) => {
		event.preventDefault();
		setStatusError(null);
		setStatusResult(null);
		setStatusLoading(true);
		try {
			const response = await fetch("/api/license/status", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: statusEmail, paymentId }),
			});
			const data = (await response.json()) as
				| StatusResponse
				| { error?: string };
			if (response.status === 404) {
				setStatusResult({ status: "not_found" });
				return;
			}
			if (!response.ok) {
				throw new Error((data as { error?: string }).error ?? "Request failed");
			}
			setStatusResult(data as StatusResponse);
		} catch (error) {
			console.error(error);
			setStatusError(t("license_management.errors.status"));
		} finally {
			setStatusLoading(false);
		}
	};

	const handleResend = async (event: FormEvent) => {
		event.preventDefault();
		setResendError(null);
		setResendMessage(null);
		setResendLoading(true);
		try {
			const response = await fetch("/api/license/resend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: resendEmail }),
			});
			const data = (await response.json()) as { error?: string };
			if (response.status === 404) {
				setResendError(t("license_management.errors.not_found"));
				return;
			}
			if (!response.ok) {
				throw new Error(data.error ?? "Request failed");
			}
			setResendMessage(t("license_management.resend.success"));
		} catch (error) {
			console.error(error);
			setResendError(t("license_management.errors.resend"));
		} finally {
			setResendLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-12">
				<div className="mx-auto max-w-5xl space-y-8">
					<div className="text-center max-w-2xl mx-auto">
						<h1 className="text-4xl font-bold">{t("license_management.title")}</h1>
						<p className="mt-3 text-(--q-text-1)">
							{t("license_management.subtitle")}
						</p>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						<section className="rounded-3xl border border-(--q-border) bg-(--q-bg-1) p-6">
							<h2 className="text-xl font-semibold">
								{t("license_management.status.title")}
							</h2>
							<p className="text-sm text-(--q-text-2) mt-2 mb-5">
								{t("license_management.status.description")}
							</p>

							<form onSubmit={handleStatus} className="space-y-4">
								<div>
									<label className="text-sm text-(--q-text-2)">
										{t("license_management.fields.email")}
									</label>
									<input
										type="email"
										required
										value={statusEmail}
										onChange={(e) => setStatusEmail(e.target.value)}
										className="mt-1 w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-2.5 outline-none focus:border-(--q-accent)/50"
									/>
								</div>
								<div>
									<label className="text-sm text-(--q-text-2)">
										{t("license_management.fields.payment_id")}
									</label>
									<input
										required
										value={paymentId}
										onChange={(e) => setPaymentId(e.target.value)}
										className="mt-1 w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-2.5 outline-none focus:border-(--q-accent)/50"
									/>
								</div>
								<button
									type="submit"
									disabled={statusLoading}
									className="w-full rounded-xl bg-(--q-accent) text-white font-semibold py-2.5 disabled:opacity-60"
								>
									{statusLoading
										? t("license_management.actions.loading")
										: t("license_management.status.cta")}
								</button>
							</form>

							{statusError ? (
								<p className="text-red-500 text-sm mt-4">{statusError}</p>
							) : null}

							{statusResult ? (
								<div className="mt-4 rounded-xl border border-(--q-border) bg-(--q-bg-0) p-4 text-sm space-y-1">
									<p>
										{t("license_management.status.result")} :{" "}
										<strong>
											{statusResult.status === "not_found"
												? t("license_management.status.not_found")
												: statusResult.status}
										</strong>
									</p>
									{statusResult.licenseKey ? (
										<p className="text-(--q-text-2)">
											{t("license_management.status.license_found")}
										</p>
									) : null}
								</div>
							) : null}
						</section>

						<section className="rounded-3xl border border-(--q-border) bg-(--q-bg-1) p-6">
							<h2 className="text-xl font-semibold">
								{t("license_management.resend.title")}
							</h2>
							<p className="text-sm text-(--q-text-2) mt-2 mb-5">
								{t("license_management.resend.description")}
							</p>

							<form onSubmit={handleResend} className="space-y-4">
								<div>
									<label className="text-sm text-(--q-text-2)">
										{t("license_management.fields.email")}
									</label>
									<input
										type="email"
										required
										value={resendEmail}
										onChange={(e) => setResendEmail(e.target.value)}
										className="mt-1 w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-2.5 outline-none focus:border-(--q-accent)/50"
									/>
								</div>
								<button
									type="submit"
									disabled={resendLoading}
									className="w-full rounded-xl border border-(--q-border) font-semibold py-2.5 hover:border-(--q-accent)/50 disabled:opacity-60"
								>
									{resendLoading
										? t("license_management.actions.loading")
										: t("license_management.resend.cta")}
								</button>
							</form>

							{resendMessage ? (
								<p className="text-green-600 text-sm mt-4">{resendMessage}</p>
							) : null}
							{resendError ? (
								<p className="text-red-500 text-sm mt-4">{resendError}</p>
							) : null}
						</section>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyLicenseButton({
	licenseKey,
	copyLabel = "Copy key",
	copiedLabel = "Copied",
}: {
	licenseKey: string;
	copyLabel?: string;
	copiedLabel?: string;
}) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(licenseKey);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (error) {
			console.error("Copy failed", error);
		}
	};

	return (
		<button
			onClick={copy}
			className="inline-flex items-center gap-2 rounded-lg border border-(--q-border) bg-(--q-bg-1) px-4 py-2 text-sm font-medium text-(--q-text-0) hover:border-(--q-accent)/50"
		>
			{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
			{copied ? copiedLabel : copyLabel}
		</button>
	);
}

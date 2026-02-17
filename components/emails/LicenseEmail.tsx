import React from "react";

type LicenseEmailProps = {
	licenseKey: string;
	email: string;
};

export function LicenseEmail({ licenseKey, email }: LicenseEmailProps) {
	return (
		<html>
			<body
				style={{
					fontFamily: "Inter, system-ui, sans-serif",
					backgroundColor: "#f7f7fb",
					padding: "24px",
					color: "#111827",
				}}
			>
				<div
					style={{
						maxWidth: "640px",
						margin: "0 auto",
						backgroundColor: "#ffffff",
						border: "1px solid #e5e7eb",
						borderRadius: "14px",
						padding: "28px",
					}}
				>
					<h1 style={{ margin: "0 0 12px", fontSize: "24px" }}>
						Votre licence QoreDB Pro
					</h1>
					<p style={{ margin: "0 0 18px", color: "#4b5563" }}>Bonjour {email},</p>
					<p style={{ margin: "0 0 18px", color: "#4b5563" }}>
						Merci pour votre achat. Voici votre clé de licence QoreDB Pro.
					</p>

					<p style={{ margin: "0 0 8px", fontSize: "13px", color: "#6b7280" }}>
						Clé de licence
					</p>
					<pre
						style={{
							whiteSpace: "pre-wrap",
							wordBreak: "break-all",
							backgroundColor: "#0f172a",
							color: "#e2e8f0",
							padding: "14px",
							borderRadius: "10px",
							fontSize: "12px",
							lineHeight: "1.45",
						}}
					>
						{licenseKey}
					</pre>

					<h2 style={{ margin: "20px 0 8px", fontSize: "16px" }}>
						Activation
					</h2>
					<ol style={{ margin: "0 0 20px", paddingLeft: "20px", color: "#4b5563" }}>
						<li>Ouvrir QoreDB</li>
						<li>Aller dans Settings</li>
						<li>Ouvrir Licence</li>
						<li>Coller la clé</li>
						<li>Cliquer sur Activer</li>
					</ol>

					<p style={{ margin: "0 0 8px" }}>
						<a href="https://www.qoredb.com/fr/quick-start">Documentation</a>
					</p>
					<p style={{ margin: "0" }}>
						<a href="https://www.qoredb.com/fr#contact">Support</a>
					</p>
				</div>
			</body>
		</html>
	);
}

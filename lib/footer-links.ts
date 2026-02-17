export type FooterLink = {
	label: string;
	href: string;
	external?: boolean;
};

type Translate = (key: string) => string;

export const getFooterLinks = (t: Translate) => ({
	product: [
		{ label: t("footer.features"), href: "/#features" },
		{ label: t("footer.preview"), href: "/#preview" },
		{ label: t("footer.pricing"), href: "/pricing" },
		{ label: "Roadmap", href: "/roadmap" },
		{ label: t("footer.changelog"), href: "/changelog" },
	],
	resources: [
		{ label: t("footer.documentation"), href: "#", external: false },
		{ label: "Blog", href: "/blog" },
		{ label: "FAQ", href: "/faq" },
		{ label: t("footer.guide"), href: "/quick-start", external: false },
	],
	community: [
		{
			label: "GitHub",
			href: "https://github.com/QoreDB/QoreDB",
			external: true,
		},
		{
			label: "Discord",
			href: "https://discord.gg/Yr6P3wuZDt",
			external: true,
		},
		{
			label: "Linkedin",
			href: "https://www.linkedin.com/company/qoredb/?viewAsMember=true",
			external: true,
		},
	],
	legal: [
		{ label: t("footer.mentions_legales"), href: "/legal" },
		{ label: t("footer.privacy"), href: "/privacy" },
		{ label: t("footer.terms"), href: "/terms" },
		{ label: t("footer.license"), href: "/license" },
	],
});

export const footerContactLinks: FooterLink[] = [
	{ label: "Email", href: "mailto:qoredb@gmail.com" },
];

export const footerCreditLink: FooterLink = {
	label: "Raphaël Plassart",
	href: "https://github.com/raphplt",
	external: true,
};

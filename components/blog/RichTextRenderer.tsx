import { PortableText } from "@portabletext/react";
import { urlForImage } from "../../lib/sanity/image";
import Image from "next/image";
import Link from "next/link";

const components = {
	types: {
		image: ({ value }: any) => {
			if (!value?.asset?._ref) {
				return null;
			}
			return (
				<div className="my-8 relative w-full h-96 rounded-lg overflow-hidden">
					<Image
						src={urlForImage(value).url()}
						alt={value.alt || "Blog Image"}
						fill
						className="object-cover"
					/>
				</div>
			);
		},
	},
	marks: {
		link: ({ children, value }: any) => {
			const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
			return (
				<Link
					href={value.href}
					rel={rel}
					className="text-primary underline hover:text-primary/80 transition-colors"
				>
					{children}
				</Link>
			);
		},
	},
	block: {
		h1: ({ children }: any) => (
			<h1 className="text-4xl font-bold mt-12 mb-4 scroll-m-20">{children}</h1>
		),
		h2: ({ children }: any) => (
			<h2 className="text-3xl font-semibold mt-10 mb-4 scroll-m-20 pb-2 border-b">
				{children}
			</h2>
		),
		h3: ({ children }: any) => (
			<h3 className="text-2xl font-semibold mt-8 mb-4 scroll-m-20">{children}</h3>
		),
		h4: ({ children }: any) => (
			<h4 className="text-xl font-semibold mt-6 mb-4 scroll-m-20">{children}</h4>
		),
		normal: ({ children }: any) => (
			<p className="leading-7 not-first:mt-6 text-foreground/90">{children}</p>
		),
		blockquote: ({ children }: any) => (
			<blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }: any) => (
			<ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
		),
		number: ({ children }: any) => (
			<ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
		),
	},
};

export function RichTextRenderer({ content }: { content: any }) {
	return <PortableText value={content} components={components} />;
}

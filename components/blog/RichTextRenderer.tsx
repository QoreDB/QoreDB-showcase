import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { codeToHtml } from "shiki";
import { getHeadingId } from "@/lib/blog-content";
import type {
  PortableTextCallout,
  PortableTextCodeBlock,
  PortableTextImage,
  PortableText as PortableTextType,
  PortableTextYoutube,
} from "@/types/posts";
import { urlForImage } from "../../lib/sanity/image";
import { CopyButton } from "./CopyButton";

const Callout = ({ value }: { value: PortableTextCallout }) => {
  const type = value.type || "info";
  const text = value.text || "";

  const config = {
    info: {
      bg: "bg-[var(--q-info)]/10 border-[var(--q-info)]/20 text-[var(--q-text-0)]",
      icon: <Info className="h-5 w-5 text-[var(--q-info)] shrink-0" />,
    },
    warning: {
      bg: "bg-[var(--q-warning)]/10 border-[var(--q-warning)]/20 text-[var(--q-text-0)]",
      icon: (
        <AlertTriangle className="h-5 w-5 text-[var(--q-warning)] shrink-0" />
      ),
    },
    success: {
      bg: "bg-[var(--q-success)]/10 border-[var(--q-success)]/20 text-[var(--q-text-0)]",
      icon: (
        <CheckCircle2 className="h-5 w-5 text-[var(--q-success)] shrink-0" />
      ),
    },
    tip: {
      bg: "bg-[var(--q-accent)]/10 border-[var(--q-accent)]/20 text-[var(--q-text-0)]",
      icon: <Lightbulb className="h-5 w-5 text-[var(--q-accent)] shrink-0" />,
    },
  };

  const current = config[type as keyof typeof config] || config.info;

  return (
    <div
      className={`my-6 flex gap-4 p-4 rounded-xl border not-prose ${current.bg}`}
    >
      {current.icon}
      <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div>
    </div>
  );
};

const CodeBlock = async ({ value }: { value: PortableTextCodeBlock }) => {
  const code = value.code || "";
  const language = value.language || "typescript";
  const filename = value.filename;

  let html = "";
  try {
    html = await codeToHtml(code, {
      lang: language,
      theme: "github-dark",
    });
  } catch {
    html = `<pre><code>${code}</code></pre>`;
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-(--q-border) bg-[#0d1117] text-white not-prose">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-(--q-border) text-xs text-white/70 font-mono">
        <span>{filename || language}</span>
        <CopyButton code={code} />
      </div>
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe highlighted HTML
        dangerouslySetInnerHTML={{ __html: html }}
        className="p-4 overflow-x-auto text-sm [&>pre]:!m-0 [&>pre]:!p-0 [&>pre]:!bg-transparent"
      />
    </div>
  );
};

const YouTube = ({ value }: { value: PortableTextYoutube }) => {
  const url = value.url;
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = match && match[2].length === 11 ? match[2] : null;

  if (!id) {
    return (
      <div className="my-6 p-4 rounded-lg bg-(--q-bg-1) text-xs text-muted-foreground text-center not-prose">
        Invalid YouTube URL: {url}
      </div>
    );
  }

  return (
    <div className="my-8 aspect-video w-full rounded-xl overflow-hidden border border-(--q-border) shadow-md not-prose">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: PortableTextImage }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8 space-y-2 not-prose">
          <div className="relative w-full h-96 rounded-lg overflow-hidden border border-(--q-border)">
            <Image
              src={urlForImage(value).url()}
              alt={value.alt || "Blog Image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-center text-(--q-text-2) italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: CodeBlock,
    callout: Callout,
    youtube: YouTube,
    divider: () => <hr className="my-8 border-t border-(--q-border)" />,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const rel = !href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <Link
          href={href}
          rel={rel}
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-12 mb-4 scroll-m-20">{children}</h1>
    ),
    h2: ({ children, value }) => (
      <h2
        id={getHeadingId(
          value.children?.map((child) => child.text).join("") ?? "",
        )}
        className="text-3xl font-semibold mt-12 mb-4 scroll-m-28 pb-3 border-b"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={getHeadingId(
          value.children?.map((child) => child.text).join("") ?? "",
        )}
        className="text-2xl font-semibold mt-10 mb-4 scroll-m-28"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-6 mb-4 scroll-m-20">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="leading-8 not-first:mt-6 text-(--q-text-0)/90">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
  },
};

export function RichTextRenderer({ content }: { content: PortableTextType }) {
  return <PortableText value={content} components={components} />;
}

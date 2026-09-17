"use client";

import { Check, Copy } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function CodeBlock(props: ComponentProps<"pre">) {
  const { t } = useTranslation();
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be denied (insecure context, permissions): stay silent.
    }
  }

  return (
    <div className="docs-codeblock group/code relative">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t("docs.copied") : t("docs.copy_code")}
        title={copied ? t("docs.copied") : t("docs.copy_code")}
        className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-md bg-(--q-bg-2) text-(--q-text-1) opacity-0 transition hover:text-(--q-text-0) focus-visible:opacity-100 group-hover/code:opacity-100"
      >
        {copied ? (
          <Check className="size-4 text-(--q-success)" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

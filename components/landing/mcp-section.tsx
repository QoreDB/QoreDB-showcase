// SPDX-License-Identifier: Apache-2.0
"use client";

import { ArrowRight, Bot, Check, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function McpSection() {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const steps = t("mcp_showcase.steps", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;

  return (
    <section id="mcp" className="relative z-10 bg-(--q-bg-1) px-6 py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--q-accent)/30 bg-(--q-accent)/10 px-3 py-1 text-xs font-semibold text-(--q-accent)">
            <Bot className="size-4" aria-hidden="true" /> MCP · Core
          </span>
          <h2 className="font-heading mb-6 text-3xl font-bold tracking-tight text-(--q-text-0) sm:text-4xl">
            {t("mcp_showcase.title")}
          </h2>
          <p className="mb-8 leading-relaxed text-(--q-text-1)">
            {t("mcp_showcase.description")}
          </p>
          <Link
            href={`/${locale}/docs/automation/mcp-server`}
            className="inline-flex items-center gap-2 rounded-xl bg-(--q-accent) px-5 py-3 font-semibold text-white transition-colors hover:bg-(--q-accent-strong)"
          >
            {t("mcp_showcase.cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-(--q-text-2)">
            {t("mcp_showcase.tiers")}
          </p>
        </div>
        <div className="rounded-2xl border border-(--q-border) bg-(--q-bg-0) p-6 sm:p-8">
          <div className="mb-7 flex flex-wrap items-center gap-2 border-b border-(--q-border) pb-6 text-sm text-(--q-text-1)">
            <Bot className="size-5 text-(--q-accent)" aria-hidden="true" />
            <span>Claude Desktop · Claude Code · Cursor</span>
            <ArrowRight className="size-4" aria-hidden="true" />
            <span className="font-mono text-(--q-accent)">qore-mcp</span>
            <Database className="size-5 text-(--q-accent)" aria-hidden="true" />
          </div>
          <ol className="space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--q-accent)/10 text-sm font-semibold text-(--q-accent)">
                  {index + 1}
                </span>
                <div>
                  <h3 className="mb-1 font-semibold text-(--q-text-0)">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-(--q-text-2)">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-7 flex flex-wrap gap-3 border-t border-(--q-border) pt-5 text-xs text-(--q-text-2)">
            <span className="inline-flex items-center gap-1">
              <Check className="size-3.5" aria-hidden="true" /> stdio
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5" aria-hidden="true" />{" "}
              {t("features.items.mcp.title")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

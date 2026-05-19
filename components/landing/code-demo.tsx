"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const lines = [
  { num: 1, type: "comment" },
  {
    num: 2,
    content: (
      <>
        <span className="text-purple-400">SELECT</span> u.name,{" "}
        <span className="text-blue-400">COUNT</span>(o.id){" "}
        <span className="text-purple-400">AS</span> orders
      </>
    ),
  },
  {
    num: 3,
    content: (
      <>
        <span className="text-purple-400">FROM</span> users u
      </>
    ),
  },
  {
    num: 4,
    content: (
      <>
        <span className="text-purple-400">JOIN</span> orders o{" "}
        <span className="text-purple-400">ON</span> o.user_id = u.id
      </>
    ),
  },
  {
    num: 5,
    content: (
      <>
        <span className="text-purple-400">WHERE</span> o.created_at &gt;={" "}
        <span className="text-emerald-400">&apos;2026-03-01&apos;</span>
      </>
    ),
  },
  {
    num: 6,
    content: (
      <>
        <span className="text-purple-400">GROUP BY</span> u.name
      </>
    ),
  },
  {
    num: 7,
    content: (
      <>
        <span className="text-purple-400">ORDER BY</span> orders{" "}
        <span className="text-purple-400">DESC</span>
      </>
    ),
  },
  {
    num: 8,
    content: (
      <>
        <span className="text-purple-400">LIMIT</span>{" "}
        <span className="text-orange-400">10</span>;
      </>
    ),
  },
];

export function CodeDemo() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 py-24 px-6 bg-(--q-bg-0)">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />

      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) overflow-hidden shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-black/20 border-b border-(--q-border)">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
            <span className="w-3 h-3 rounded-full bg-[#eab308]/80" />
            <span className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
            <span className="ml-auto text-xs text-(--q-text-2) font-mono">
              {t("code_demo.title_bar")}
            </span>
          </div>

          {/* Code body with line numbers */}
          <div className="p-6 font-mono text-sm leading-8 text-(--q-text-2)">
            {lines.map((line) => (
              <div key={line.num} className="flex">
                <span className="w-8 shrink-0 text-right pr-4 text-(--q-text-2)/30 select-none">
                  {line.num}
                </span>
                {line.type === "comment" ? (
                  <span className="text-(--q-text-2)/50">
                    {t("code_demo.comment")}
                  </span>
                ) : (
                  <span>{line.content}</span>
                )}
              </div>
            ))}

            {/* Result */}
            <div className="mt-5 pt-4 border-t border-dashed border-(--q-border) text-emerald-400 text-xs flex items-center gap-2">
              <span>&#10003;</span>
              <span>{t("code_demo.result")}</span>
              <span className="animate-pulse text-(--q-text-2)/40">|</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

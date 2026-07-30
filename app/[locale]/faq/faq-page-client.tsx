"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_FILTERS, FAQ_ITEMS } from "@/lib/faq";
import { cn } from "@/lib/utils";

export function FAQPageClient() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const faqItems = FAQ_ITEMS;
  const filters = FAQ_FILTERS;

  const filteredItems = faqItems.filter((item) => {
    const matchesFilter =
      activeFilter === "all" || item.category === activeFilter;
    const query = searchQuery.toLowerCase();
    const question = t(`faq_page.items.${item.key}.question`).toLowerCase();
    const answer = t(`faq_page.items.${item.key}.answer`).toLowerCase();
    const matchesSearch = question.includes(query) || answer.includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-(--q-accent) opacity-5 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="relative text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-linear-to-br from-(--q-text-0) to-(--q-text-1)">
            {t("faq_page.title")}
          </h1>

          <div className="max-w-xl mx-auto space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-(--q-text-2) group-focus-within:text-(--q-accent) transition-colors" />
              </div>
              <input
                type="text"
                placeholder={t("faq_page.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-(--q-bg-1)/50 hover:bg-(--q-bg-1) focus:bg-(--q-bg-1) border border-(--q-border) text-(--q-text-0) rounded-xl pl-12 pr-4 py-4 outline-none focus:border-(--q-accent)/50 focus:ring-4 focus:ring-(--q-accent)/10 transition-all duration-300 placeholder:text-(--q-text-2)"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    activeFilter === filter
                      ? "bg-(--q-accent) text-white border-(--q-accent) shadow-lg shadow-(--q-accent)/20"
                      : "bg-(--q-bg-1)/50 text-(--q-text-1) border-(--q-border) hover:bg-(--q-bg-1) hover:text-(--q-text-0)",
                  )}
                >
                  {t(`faq_page.filters.${filter}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              <Accordion type="single" className="space-y-4">
                {filteredItems.map(({ key }) => (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger>
                      {t(`faq_page.items.${key}.question`)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-(--q-text-1)"
                        dangerouslySetInnerHTML={{
                          __html: t(`faq_page.items.${key}.answer`)
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n\n/g, "<br/><br/>")
                            .replace(
                              /^\* (.*)$/gm,
                              '<li class="ml-4 list-disc">$1</li>',
                            ),
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-(--q-text-2)"
              >
                <motion.div className="inline-block p-4 rounded-full bg-(--q-bg-1) mb-4">
                  <Search className="h-6 w-6 opacity-50" />
                </motion.div>
                <p>
                  {t("faq_page.no_results")} &quot;{searchQuery}&quot;
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

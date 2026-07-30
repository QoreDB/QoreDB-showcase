export type FaqCategory = "general" | "tech" | "project";

export type FaqItem = {
  key: string;
  category: FaqCategory;
};

export const FAQ_ITEMS: FaqItem[] = [
  { key: "what_is_qoredb", category: "general" },
  { key: "difference_dbeaver", category: "general" },
  { key: "is_opensource", category: "project" },
  { key: "is_free", category: "project" },
  { key: "data_privacy", category: "tech" },
  { key: "analytics", category: "tech" },
  { key: "production_ready", category: "tech" },
  { key: "supported_databases", category: "tech" },
  { key: "remote_ssh", category: "tech" },
  { key: "platforms", category: "general" },
  { key: "maintenance", category: "general" },
  { key: "contribute", category: "project" },
  { key: "funding", category: "project" },
  { key: "professional_use", category: "project" },
  { key: "follow_progress", category: "general" },
  { key: "join_beta", category: "general" },
  { key: "long_term", category: "general" },
];

export const FAQ_FILTERS = ["all", "general", "tech", "project"] as const;

export function faqAnswerToPlainText(answer: string) {
  return answer
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*[*-]\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\s*\n\s*\n\s*/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

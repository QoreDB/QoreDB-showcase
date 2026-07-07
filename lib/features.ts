import type { LucideIcon } from "lucide-react";
import { FileCheck, History, Network } from "lucide-react";

export type FeatureTier = "core" | "pro";

export interface FeaturePage {
  slug: string;
  icon: LucideIcon;
  tier: FeatureTier;
}

// Registre des pages de présentation des fonctionnalités phares.
// Ajouter une entrée ici (+ le bloc i18n `features_pages.<slug>`) suffit à
// publier une nouvelle page et à la référencer sur l'index /features.
export const FEATURE_PAGES: FeaturePage[] = [
  { slug: "federation", icon: Network, tier: "pro" },
  { slug: "time-travel", icon: History, tier: "pro" },
  { slug: "data-contracts", icon: FileCheck, tier: "pro" },
];

export const FEATURE_SLUGS = FEATURE_PAGES.map((feature) => feature.slug);

export function getFeaturePage(slug: string): FeaturePage | undefined {
  return FEATURE_PAGES.find((feature) => feature.slug === slug);
}

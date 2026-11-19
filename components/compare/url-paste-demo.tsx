import { ArrowDown, Check, Link2 } from "lucide-react";

const SAMPLE_URL = "postgresql://app@db.example.com:5432/shop";

const SAMPLE_FIELDS = [
  ["host", "db.example.com"],
  ["port", "5432"],
  ["user", "app"],
  ["database", "shop"],
] as const;

export type UrlPasteFieldLabels = Record<
  (typeof SAMPLE_FIELDS)[number][0],
  string
>;

export function UrlPasteDemo({
  urlLabel,
  resultLabel,
  fieldLabels,
}: {
  urlLabel: string;
  resultLabel: string;
  fieldLabels: UrlPasteFieldLabels;
}) {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-5 sm:p-6"
    >
      <p className="mb-2 text-xs font-medium text-(--q-text-2)">{urlLabel}</p>
      <div className="flex items-center gap-2 rounded-lg border border-(--q-accent)/40 bg-(--q-bg-0) px-3 py-2.5 shadow-[0_0_0_3px_color-mix(in_srgb,var(--q-accent)_15%,transparent)]">
        <Link2 className="h-4 w-4 shrink-0 text-(--q-accent)" />
        <span className="truncate font-mono text-[13px] text-(--q-text-0)">
          {SAMPLE_URL}
        </span>
      </div>
      <div className="my-3 flex justify-center text-(--q-text-2)">
        <ArrowDown className="h-4 w-4" />
      </div>
      <dl className="grid grid-cols-2 gap-2">
        {SAMPLE_FIELDS.map(([field, value]) => (
          <div
            key={field}
            className="rounded-md border border-(--q-border) bg-(--q-bg-0) px-3 py-2"
          >
            <dt className="text-[11px] text-(--q-text-2)">
              {fieldLabels[field]}
            </dt>
            <dd className="truncate font-mono text-[13px] text-(--q-text-0)">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-(--q-accent)">
        <Check className="h-3.5 w-3.5" />
        {resultLabel}
      </p>
    </div>
  );
}

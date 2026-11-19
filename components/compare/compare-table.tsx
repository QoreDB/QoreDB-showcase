import {
  Cpu,
  Database,
  EyeOff,
  type LucideIcon,
  Monitor,
  NotebookPen,
  Scale,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import Image from "next/image";
import type { CompareRow } from "@/lib/compare";

const ROW_ICONS: Record<CompareRow, LucideIcon> = {
  license: Scale,
  price: Tag,
  platforms: Monitor,
  technology: Cpu,
  databases: Database,
  telemetry: EyeOff,
  safety: ShieldCheck,
  ai: Sparkles,
  notebooks: NotebookPen,
};

export type CompareTableRow = {
  key: CompareRow;
  label: string;
  qoredb: string;
  competitor: string;
};

function QoreDbMark() {
  return (
    <>
      <Image
        src="/logo.webp"
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 dark:hidden"
      />
      <Image
        src="/logo-white.webp"
        alt=""
        width={20}
        height={20}
        className="hidden h-5 w-5 dark:block"
      />
    </>
  );
}

export function CompareTable({
  topicLabel,
  competitorName,
  rows,
}: {
  topicLabel: string;
  competitorName: string;
  rows: CompareTableRow[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--q-border) bg-(--q-bg-1)">
      <table className="w-full border-collapse text-left md:table-fixed">
        <thead className="sr-only md:not-sr-only">
          <tr className="text-sm">
            <th
              scope="col"
              className="px-6 py-4 font-medium text-(--q-text-2) md:w-[22%]"
            >
              {topicLabel}
            </th>
            <th
              scope="col"
              className="bg-(--q-accent)/8 px-6 py-4 font-semibold text-(--q-text-0) shadow-[inset_0_2px_0_var(--q-accent)]"
            >
              <span className="inline-flex items-center gap-2">
                <QoreDbMark />
                QoreDB
              </span>
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold text-(--q-text-0)"
            >
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center rounded-sm bg-(--q-bg-2) text-[11px] font-bold text-(--q-text-1)"
                >
                  {competitorName.charAt(0)}
                </span>
                {competitorName}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const Icon = ROW_ICONS[row.key];
            return (
              <tr
                key={row.key}
                className="block border-t border-(--q-border) md:table-row"
              >
                <th
                  scope="row"
                  className="block px-5 pt-5 pb-3 text-sm font-medium text-(--q-text-0) md:table-cell md:px-6 md:py-5 md:align-top"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-(--q-bg-2) text-(--q-text-1)">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {row.label}
                  </span>
                </th>
                <td className="mx-5 mb-2 block rounded-lg bg-(--q-accent)/8 px-4 py-3 text-[15px] leading-relaxed text-(--q-text-0) md:mx-0 md:mb-0 md:table-cell md:rounded-none md:px-6 md:py-5 md:align-top">
                  <span className="mb-1 block text-xs font-semibold text-(--q-accent) md:hidden">
                    QoreDB
                  </span>
                  {row.qoredb}
                </td>
                <td className="block px-5 pt-1 pb-5 text-[15px] leading-relaxed text-(--q-text-1) md:table-cell md:px-6 md:py-5 md:align-top">
                  <span className="mb-1 block text-xs font-semibold text-(--q-text-0) md:hidden">
                    {competitorName}
                  </span>
                  {row.competitor}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

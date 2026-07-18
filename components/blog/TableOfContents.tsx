import type { ArticleHeading } from "@/lib/blog-content";

export function TableOfContents({
  headings,
  label,
}: {
  headings: ArticleHeading[];
  label: string;
}) {
  if (headings.length < 2) return null;

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label={label}
        className="sticky top-28 border-l border-(--q-border) pl-5"
      >
        <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--q-text-2)">
          {label}
        </p>
        <ol className="space-y-3">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={heading.level === 3 ? "pl-3" : undefined}
            >
              <a
                href={`#${heading.id}`}
                className="block text-sm leading-5 text-(--q-text-2) transition-colors hover:text-(--q-accent-strong)"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

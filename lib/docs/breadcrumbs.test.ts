import assert from "node:assert/strict";
import test from "node:test";
import { buildBreadcrumbs } from "./breadcrumbs";
import { findPageWithFallback, getAllPages } from "./tree";

for (const locale of ["fr", "en"] as const) {
  test(`${locale}: Introduction links to an existing article, not its directory`, () => {
    const items = buildBreadcrumbs(
      locale,
      locale,
      ["introduction", "open-core-model"],
      "Open Core",
      "Docs",
    );
    assert.deepEqual(items[1], {
      label: "Introduction",
      href: `/${locale}/docs/introduction/what-is-qoredb`,
    });
    assert.deepEqual(items.at(-1), { label: "Open Core" });
  });

  test(`${locale}: every published breadcrumb destination resolves`, () => {
    const sections = new Map<string, string[]>();
    for (const page of getAllPages("en")) {
      if (page.slug.length > 1)
        sections.set(page.slug.slice(0, -1).join("/"), page.slug);
    }
    assert.ok(sections.size > 5);
    for (const slug of sections.values()) {
      const items = buildBreadcrumbs(locale, "en", slug, "Article", "Docs");
      for (const item of items.slice(1, -1)) {
        if (!item.href) continue;
        assert.ok(item.href.startsWith(`/${locale}/docs/`));
        const target = item.href.split("/").slice(3);
        assert.ok(
          findPageWithFallback(locale, target).page,
          `${slug.join("/")} links to missing ${item.href}`,
        );
      }
    }
  });
}

test("A section without an article remains a label, never a fabricated URL", () => {
  const items = buildBreadcrumbs(
    "fr",
    "en",
    ["missing-section", "article"],
    "Article",
    "Docs",
  );
  assert.deepEqual(items[1], { label: "Missing Section" });
});

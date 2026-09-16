import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import Module, { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { createInstance } from "i18next";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { register } from "tsx/cjs/api";

// Render the real pricing components with synthetic SSR prices. Only the site
// shell and server mutation are stubbed; forms, copy, and branch logic are real.
export async function runPricingSSRFixtures() {
  const require = createRequire(import.meta.url);
  const unregister = register();
  const originalLoad = Module._load;
  const originalFetch = globalThis.fetch;
  const denyNetwork = () => {
    throw new Error(
      "Network and server mutations are forbidden in SSR fixtures",
    );
  };
  Module._load = function load(request, parent, isMain) {
    if (request === "@/components/landing/header")
      return { Header: () => null };
    if (request === "@/components/landing/footer")
      return { Footer: () => null };
    if (request === "@/actions/join-team-waitlist")
      return { joinTeamWaitlist: denyNetwork };
    return originalLoad.call(this, request, parent, isMain);
  };
  globalThis.fetch = denyNetwork;
  try {
    const { I18nextProvider } = require("react-i18next");
    const copy = JSON.parse(
      await readFile(new URL("../locales/en/common.json", import.meta.url)),
    );
    const i18n = createInstance();
    await i18n.init({
      lng: "en",
      fallbackLng: false,
      resources: { en: { translation: copy } },
      interpolation: { escapeValue: false },
    });
    const PricingPageClient =
      require("../components/pricing/pricing-page-client.tsx").default;
    const {
      TeamPlanClient,
    } = require("../components/pricing/team-plan-client.tsx");
    const render = (component, props) =>
      renderToStaticMarkup(
        React.createElement(
          I18nextProvider,
          { i18n },
          React.createElement(component, props),
        ),
      );
    const results = [];
    for (const available of [false, true]) {
      const html = render(PricingPageClient, {
        locale: "en",
        initialProStripePrice: available ? "€321.00" : null,
        initialTeamSeatPrice: available ? "€123.00" : null,
      });
      assert.equal(
        html.includes('href="/en/pricing/team"'),
        available,
        "Only an available Team price exposes the purchase route",
      );
      assert.equal(
        [...html.matchAll(/<form\b/g)].length,
        available ? 1 : 2,
        "Unavailable Team adds its waitlist; Enterprise keeps its own form",
      );
      assert.ok(html.includes(copy.pricing_page.pro.billing));
      assert.ok(html.includes(copy.pricing_page.team.per_seat_note));
      assert.ok(
        html.includes(available ? "€321.00" : copy.pricing_page.pro.price),
        "Pro preserves the supplied price or the translated fallback",
      );
      if (available) {
        assert.ok(html.includes("€123.00"));
        assert.ok(html.includes(copy.pricing_page.team.discover_cta));
      }
      assert.doesNotMatch(html, /pricing_page\.[a-z_]+/);
      results.push({
        name: `team-availability-${available ? "available" : "waitlist"}-ssr`,
        status: "passed",
        detail: "Real component, synthetic prices, no Stripe or network call",
      });
    }
    const team = render(TeamPlanClient, {
      locale: "en",
      unitAmount: 12300,
      currency: "EUR",
      minSeats: 3,
      intlLocale: "en-US",
    });
    assert.ok(team.includes("€123.00"));
    assert.ok(team.includes("€369.00"));
    assert.ok(team.includes(copy.pricing_page.team.per_year));
    assert.ok(team.includes(copy.pricing_page.team.per_seat_note));
    assert.match(
      team,
      new RegExp(
        `aria-label="${copy.pricing_page.team.seats_decrease}"[^>]*disabled=""`,
      ),
    );
    results.push({
      name: "team-annual-total-ssr",
      status: "passed",
      detail: "€123 per seat per year × 3 minimum seats = €369 per year",
    });
    return results;
  } finally {
    globalThis.fetch = originalFetch;
    Module._load = originalLoad;
    unregister();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  console.log(JSON.stringify(await runPricingSSRFixtures(), null, 2));

import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { runPricingSSRFixtures } from "./pricing-ssr-fixture.mjs";

// Run against an already-started dev/production server. Every browser mutation
// is intercepted before it can reach checkout, email, or another real service.
const base = new URL(process.env.SHOWCASE_BASE_URL || "http://127.0.0.1:3102");
const output = path.resolve(
  process.env.SHOWCASE_OUTPUT || "/tmp/qore-showcase-smoke",
);
const filter = new RegExp(process.env.SHOWCASE_SCENARIOS || ".*");
const timeout = Number(process.env.SHOWCASE_TIMEOUT || 15000);
const locales = ["fr", "en", "de", "es", "ja", "it", "zh"];
const en = JSON.parse(
  await readFile(new URL("../locales/en/common.json", import.meta.url), "utf8"),
);
const results = [];
const pending = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
const release = {
  version: "9.9.9-smoke",
  notes: "Synthetic browser fixture",
  pub_date: "2026-09-16T00:00:00Z",
  platforms: Object.fromEntries(
    [
      "windows-x86_64-msi",
      "windows-x86_64-nsis",
      "darwin-aarch64",
      "darwin-x86_64",
      "linux-x86_64-appimage",
      "linux-x86_64-deb",
      "linux-x86_64-rpm",
    ].map((platform) => [
      platform,
      {
        signature: "fixture",
        url: `${base.origin}/__smoke_download/${platform}`,
      },
    ]),
  ),
};
const json = (body, status = 200) => ({
  status,
  contentType: "application/json",
  body: JSON.stringify(body),
});
const browser = await puppeteer.launch({
  executablePath:
    process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox"],
});
await mkdir(output, { recursive: true });

async function named(
  page,
  name,
  selector = "button, summary, [role=menuitem]",
) {
  const candidates = await page.$$(selector);
  for (const candidate of candidates) {
    const match = await candidate.evaluate(
      (element, pattern) => {
        const rect = element.getBoundingClientRect();
        const label =
          element.getAttribute("aria-label") || element.textContent || "";
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          new RegExp(pattern, "i").test(label.trim())
        );
      },
      typeof name === "string"
        ? name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        : name.source,
    );
    if (match) return candidate;
  }
  throw new Error(`Visible control not found: ${name}`);
}

async function navigate(page, pathname) {
  const response = await page.goto(new URL(pathname, base).href, {
    waitUntil: "networkidle0",
    timeout: timeout * 2,
  });
  assert.ok(
    response?.ok(),
    `Navigation ${pathname}: HTTP ${response?.status()}`,
  );
  await page.evaluate(() => document.fonts.ready);
}

async function noOverflow(page) {
  const size = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  assert.ok(
    size.page <= size.viewport + 1,
    `Horizontal overflow: ${size.page} > ${size.viewport}`,
  );
}

async function scenario(name, run, options = {}) {
  if (!filter.test(name)) return;
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    ...options.viewport,
  });
  const errors = [];
  const requests = [];
  const expectedFailures = new Set();
  const blocked = new Set();
  const tracked = new Set();
  const started = Date.now();
  if (options.userAgent) await page.setUserAgent(options.userAgent);
  if (options.noJS) await page.setJavaScriptEnabled(false);
  if (options.reducedMotion)
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  if (options.theme)
    await page.evaluateOnNewDocument(
      (theme) => localStorage.setItem("theme", theme),
      options.theme,
    );
  page.on("pageerror", (error) => errors.push(`Uncaught: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    const url = message.location().url;
    if (blocked.has(url) || expectedFailures.has(url)) return;
    if (options.expectedConsole?.test(text)) return;
    errors.push(`Console: ${text} (${url || "inline"})`);
  });
  // Direct CDP interception avoids Puppeteer's shared network manager
  // stalling Pagefind worker fetches. The same mutation/external guards apply.
  if (options.realWorker) {
    const guard = async (client) => {
      client.on("Fetch.requestPaused", async ({ requestId, request }) => {
        const url = new URL(request.url);
        requests.push({
          path: url.pathname,
          method: request.method,
          guard: "cdp",
        });
        const mutation = !["GET", "HEAD", "OPTIONS"].includes(request.method);
        const external =
          ["http:", "https:"].includes(url.protocol) &&
          url.origin !== base.origin;
        if (mutation)
          errors.push(
            `Unexpected mutation blocked: ${request.method} ${url.pathname}`,
          );
        if (external) blocked.add(request.url);
        if (mutation || external)
          await client.send("Fetch.failRequest", {
            requestId,
            errorReason: "BlockedByClient",
          });
        else await client.send("Fetch.continueRequest", { requestId });
      });
      await client.send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
    };
    await guard(await page.createCDPSession());
  } else await page.setRequestInterception(true);
  page.on("request", (request) => {
    const work = (async () => {
      const url = new URL(request.url());
      if (!["http:", "https:"].includes(url.protocol))
        return request.continue();
      requests.push({ path: url.pathname, method: request.method() });
      if (options.realWorker) return;
      const mock = await options.mock?.(request, url);
      if (mock) {
        if (mock.status >= 400) expectedFailures.add(request.url());
        return request.respond(mock);
      }
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
        errors.push(
          `Unexpected mutation blocked: ${request.method()} ${url.pathname}`,
        );
        expectedFailures.add(request.url());
        return request.respond(
          json({ error: "Unexpected mutation blocked by smoke harness" }, 403),
        );
      }
      if (url.origin !== base.origin) {
        blocked.add(request.url());
        return request.abort("blockedbyclient");
      }
      if (url.pathname.startsWith("/__smoke_download/")) {
        return request.respond({
          status: 200,
          contentType: "text/html",
          body: "<p>Mock download destination</p>",
        });
      }
      if (url.pathname === "/__smoke_checkout") {
        return request.respond({
          status: 200,
          contentType: "text/html",
          body: "<p>Mock checkout destination</p>",
        });
      }
      return request.continue();
    })().catch((error) => {
      errors.push(`Interceptor: ${error.message}`);
      if (!request.isInterceptResolutionHandled()) return request.abort();
    });
    tracked.add(work);
    work.finally(() => tracked.delete(work));
  });
  let entry;
  try {
    const detail = await run(page, requests);
    await Promise.all([...tracked]);
    assert.deepEqual(errors, [], "Unexpected browser errors");
    entry = { name, status: "passed", detail };
  } catch (error) {
    entry = {
      name,
      status: "failed",
      error: error.message,
      browserErrors: errors,
    };
  }
  const filename = `${name.replace(/[^a-z0-9-]/gi, "-")}.png`;
  try {
    await page.screenshot({
      path: path.join(output, filename),
      fullPage: false,
    });
    entry.screenshot = filename;
  } catch (error) {
    entry.captureError = error.message;
  }
  entry.durationMs = Date.now() - started;
  results.push(entry);
  console.log(
    `${entry.status.toUpperCase()} ${name}${entry.error ? `: ${entry.error}` : ""}`,
  );
  await context.close();
}

async function checkHome(page, locale, requests) {
  await navigate(page, `/${locale}`);
  assert.equal(
    await page.$$eval("main", (items) => items.length),
    1,
    "Exactly one main landmark",
  );
  assert.equal(
    await page.$$eval("h1", (items) => items.length),
    1,
    "Exactly one h1",
  );
  for (const anchor of ["features", "preview", "mcp"])
    assert.ok(
      await page.$(`[id="${anchor}"]`),
      `Missing legacy anchor ${anchor}`,
    );
  assert.ok(
    await page.$(`main a[href="/${locale}/download"]`),
    "Download is a real link inside main",
  );
  const rawKeys = await page.evaluate(() =>
    [...document.querySelectorAll("main,header,footer")].flatMap(
      (e) =>
        e.innerText.match(
          /\b(?:nav|hero|home|showcase|a11y|landing|download|pricing_page)\.[a-z_][a-z_.]+\b/g,
        ) || [],
    ),
  );
  assert.deepEqual(rawKeys, [], "Untranslated keys exposed");
  assert.ok(
    !requests.some((r) => r.path === "/api/latest-release"),
    "Home must not fetch download metadata",
  );
  await noOverflow(page);
  const visuals = await page.evaluate(() => {
    const main = document.querySelector("main");
    const hidden = [...main.querySelectorAll("h1,h2")]
      .filter((heading) => {
        for (let e = heading; e && e !== main; e = e.parentElement)
          if (
            getComputedStyle(e).opacity === "0" ||
            getComputedStyle(e).visibility === "hidden"
          )
            return true;
        return false;
      })
      .map((e) => e.textContent);
    const infinite = document
      .getAnimations()
      .filter(
        (animation) =>
          animation.effect.getTiming().iterations === Infinity &&
          !animation.effect.target?.matches(".q-home-drivers-track"),
      ).length;
    const image = main.querySelector("figure img");
    let imageVisible = 0;
    if (image) {
      let top = Math.max(0, image.getBoundingClientRect().top),
        bottom = Math.min(innerHeight, image.getBoundingClientRect().bottom);
      for (let e = image.parentElement; e && e !== main; e = e.parentElement) {
        if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(e).overflowY)) {
          const r = e.getBoundingClientRect();
          top = Math.max(top, r.top);
          bottom = Math.min(bottom, r.bottom);
        }
      }
      imageVisible = Math.max(0, bottom - top);
    }
    return {
      hidden,
      infinite,
      imageVisible,
      loadedFonts: [...document.fonts]
        .filter((f) => f.status === "loaded")
        .map((f) => f.family),
    };
  });
  assert.deepEqual(
    visuals.hidden,
    [],
    "Editorial headings must be visible without hydration",
  );
  assert.equal(
    visuals.infinite,
    0,
    "No infinite animations outside the requested driver rail",
  );
  if (locale === "fr" && (await page.evaluate(() => innerWidth === 390)))
    assert.ok(
      visuals.imageVisible >= 200,
      `Only ${visuals.imageVisible}px of product visible above fold`,
    );
  return visuals;
}

try {
  for (const locale of locales)
    await scenario(`home-${locale}`, (page, requests) =>
      checkHome(page, locale, requests),
    );
  for (const theme of ["light", "dark"])
    for (const width of [320, 768, 1024, 1440, 1920])
      await scenario(
        `layout-${theme}-${width}`,
        async (page) => {
          await navigate(page, "/fr");
          await noOverflow(page);
        },
        { theme, viewport: { width, height: 900 } },
      );
  await scenario(
    "home-no-javascript",
    (page, requests) => checkHome(page, "fr", requests),
    { noJS: true },
  );
  await scenario(
    "home-reduced-motion",
    (page, requests) => checkHome(page, "fr", requests),
    { reducedMotion: true },
  );
  for (const [width, height] of [
    [390, 844],
    [1440, 900],
    [1920, 1080],
  ]) {
    await scenario(
      `hero-first-screen-${width}`,
      async (page) => {
        await navigate(page, "/fr");
        const bounds = await page.evaluate(() => ({
          next: document.querySelector("#features").getBoundingClientRect().top,
          height: innerHeight,
        }));
        assert.ok(
          bounds.next >= bounds.height - 1,
          `Next section begins at ${bounds.next}, inside ${bounds.height}px viewport`,
        );
        await noOverflow(page);
        return bounds;
      },
      { viewport: { width, height } },
    );
  }
  await scenario(
    "drivers-motion-controls",
    async (page) => {
      await navigate(page, "/fr");
      await page.waitForSelector(
        '.q-home-drivers[data-ready="true"][data-playing="true"]',
      );
      const track = ".q-home-drivers-track";
      const state = () =>
        page.$eval(track, (e) => getComputedStyle(e).animationPlayState);
      await page.mouse.move(0, 0);
      assert.equal(await state(), "running");
      const before = await page.$eval(
        track,
        (e) => getComputedStyle(e).transform,
      );
      await new Promise((r) => setTimeout(r, 250));
      assert.notEqual(
        await page.$eval(track, (e) => getComputedStyle(e).transform),
        before,
      );
      await page.click(".q-home-drivers-pause");
      await page.$eval(".q-home-drivers-pause", (e) => e.blur());
      await page.mouse.move(0, 0);
      assert.equal(await state(), "paused");
      await page.focus(".q-home-drivers-pause");
      await page.keyboard.press("Enter");
      await page.$eval(".q-home-drivers-pause", (e) => e.blur());
      assert.equal(await state(), "running");
      await page.hover(".q-home-drivers");
      assert.equal(await state(), "paused");
      await page.mouse.move(0, 0);
      await page.$eval("footer", (e) => e.scrollIntoView());
      await page.waitForSelector('.q-home-drivers[data-playing="false"]');
      assert.equal(await state(), "paused");
    },
    { viewport: { width: 1440, height: 900 } },
  );
  await scenario(
    "drivers-reduced-motion",
    async (page) => {
      await navigate(page, "/fr");
      assert.equal(
        await page.$eval(
          ".q-home-drivers-track",
          (e) => getComputedStyle(e).animationName,
        ),
        "none",
      );
      assert.equal(
        await page.$eval(
          ".q-home-drivers-pause",
          (e) => getComputedStyle(e).display,
        ),
        "none",
      );
      assert.equal(
        await page.$$eval(
          ".q-home-drivers-track > ul li",
          (items) => items.length,
        ),
        5,
      );
      await noOverflow(page);
    },
    { reducedMotion: true },
  );
  for (const locale of ["fr", "en"]) {
    await scenario(`docs-breadcrumb-${locale}`, async (page) => {
      await navigate(page, `/${locale}/docs/introduction/open-core-model`);
      const links = await page.$$eval(
        '.docs-prose nav[aria-label="Breadcrumb"] a',
        (nodes) =>
          nodes.map((e) => ({
            text: e.textContent,
            href: e.getAttribute("href"),
          })),
      );
      assert.equal(
        links[1].href,
        `/${locale}/docs/introduction/what-is-qoredb`,
      );
      const schema = await page.$eval(
        'script[id^="docs-breadcrumbs-jsonld-"]',
        (e) => JSON.parse(e.textContent),
      );
      assert.ok(schema.itemListElement[1].item.endsWith(links[1].href));
      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        page.click(
          '.docs-prose nav[aria-label="Breadcrumb"] li:nth-child(2) a',
        ),
      ]);
      assert.equal(new URL(page.url()).pathname, links[1].href);
      assert.ok(await page.$(".docs-prose h1"));
      assert.ok(
        !(await page.evaluate(() => document.body.innerText)).includes("404"),
      );
    });
  }
  await scenario("navigation-mobile", async (page) => {
    await navigate(page, "/en");
    const toggle = await named(page, en.nav.open_menu);
    await toggle.focus();
    await page.keyboard.press("Enter");
    await page.waitForSelector("nav#mobile-navigation", { visible: true });
    assert.equal(
      await toggle.evaluate((e) => e.getAttribute("aria-expanded")),
      "true",
    );
    await noOverflow(page);
    await page.keyboard.press("Escape");
    await page.waitForSelector("nav#mobile-navigation", { hidden: true });
    assert.ok(
      await toggle.evaluate((e) => document.activeElement === e),
      "Escape restores menu trigger focus",
    );
  });
  await scenario(
    "preferences-route",
    async (page) => {
      await navigate(page, "/en/features");
      const before = await page.evaluate(() =>
        document.documentElement.classList.contains("dark"),
      );
      await (await named(page, /theme/)).click();
      await page.waitForFunction(
        (previous) =>
          document.documentElement.classList.contains("dark") !== previous,
        {},
        before,
      );
      // Route prefetches may keep the network busy after the document is ready.
      // Verify the persisted preference and next interaction explicitly.
      await page.reload({ waitUntil: "domcontentloaded" });
      assert.notEqual(
        await page.evaluate(() =>
          document.documentElement.classList.contains("dark"),
        ),
        before,
        "Theme persists",
      );
      await (await named(page, /language/)).click();
      await (await named(page, /Français/, "[role=menuitem]")).click();
      await page.waitForFunction(() => location.pathname === "/fr/features");
    },
    { viewport: { width: 1440, height: 900 } },
  );
  for (const locale of ["fr", "en"])
    await scenario(
      `navigation-links-${locale}`,
      async (page) => {
        await navigate(page, `/${locale}`);
        const links = await page.$$eval(
          "header a, main a, footer a",
          (items) => [...new Set(items.map((a) => a.href))],
        );
        const checked = [];
        for (const href of links) {
          const url = new URL(href);
          if (
            url.origin !== base.origin ||
            url.hash ||
            url.pathname.startsWith("/api/")
          )
            continue;
          const response = await fetch(url, {
            redirect: "manual",
            signal: AbortSignal.timeout(timeout),
          });
          assert.ok(
            response.status < 400,
            `${url.pathname}: HTTP ${response.status}`,
          );
          checked.push(url.pathname);
        }
        return { checked };
      },
      { viewport: { width: 1440, height: 900 } },
    );

  for (const locale of ["fr", "en"])
    await scenario(`seo-${locale}`, async (page) => {
      await navigate(page, `/${locale}`);
      const metadata = await page.evaluate(() => ({
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        alternates: [
          ...document.querySelectorAll('link[rel="alternate"][hreflang]'),
        ].map((link) => [link.hreflang, link.href]),
        structured: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].map((script) => JSON.parse(script.textContent)),
      }));
      assert.equal(new URL(metadata.canonical).pathname, `/${locale}`);
      for (const language of locales) {
        const alternate = metadata.alternates.find(
          ([code]) => code === language,
        );
        assert.ok(alternate, `Missing hreflang ${language}`);
        assert.equal(new URL(alternate[1]).pathname, `/${language}`);
      }
      assert.ok(metadata.structured.length > 0, "JSON-LD exists and parses");
      return metadata;
    });
  await scenario("routing-sitemap-quick-start", async () => {
    const sitemap = await fetch(new URL("/sitemap.xml", base));
    assert.equal(sitemap.status, 200);
    assert.match(await sitemap.text(), /<urlset\b/);
    const response = await fetch(new URL("/fr/quick-start", base), {
      redirect: "manual",
    });
    assert.ok([307, 308].includes(response.status));
    assert.match(
      response.headers.get("location") || "",
      /\/fr\/docs\/getting-started/,
    );
  });
  for (const route of [
    "faq",
    "changelog",
    "newsletter",
    "legal",
    "privacy",
    "terms",
    "oss-program",
    "team/join",
    "team/admin",
  ])
    await scenario(`secondary-${route.replaceAll("/", "-")}`, async (page) => {
      await navigate(page, `/fr/${route}`);
      await noOverflow(page);
      assert.equal(await page.$$eval("main", (items) => items.length), 1);
      assert.ok(await page.$("main#main-content"));
      const headingCount = await page.$$eval("h1", (items) => items.length);
      if (route !== "changelog") assert.equal(headingCount, 1);
      return {
        route,
        viewport: 390,
        forms: "not submitted",
        ...(route === "changelog" && headingCount > 1
          ? {
              knownIssue: `${headingCount} h1 elements: pre-existing release Markdown headings in unchanged components/changelog/release-card.tsx; changelog heading hierarchy is not certified`,
            }
          : {}),
      };
    });

  await scenario("demo-playback-keyboard", async (page, requests) => {
    await navigate(page, "/en");
    const player = await page.$(".q-demo");
    assert.ok(player, "Product demo exists");
    await player.scrollIntoView();
    await noOverflow(page);
    const video = await page.$(".q-demo-video");
    assert.ok(video);
    assert.ok(
      await video.evaluate(
        (element) => !element.currentSrc && !element.getAttribute("src"),
      ),
    );
    assert.ok(
      !requests.some((request) => request.path.startsWith("/videos/")),
      "No video bytes requested before activation, including after scrolling into view",
    );
    const trigger = await page.$(".q-demo-play");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => {
      const element = document.querySelector(".q-demo-video");
      return element.currentTime > 0.3 && !element.paused;
    });
    assert.ok(
      await video.evaluate((element) => document.activeElement === element),
      "Keyboard focus moves to the visible native player",
    );
    assert.ok(
      await video.evaluate(
        (element) =>
          element.controls &&
          element.playsInline &&
          !element.autoplay &&
          !element.loop,
      ),
    );
    await page.keyboard.press("Space");
    await page.waitForFunction(
      () => document.querySelector(".q-demo-video").paused,
    );
    const pausedAt = await video.evaluate((element) => element.currentTime);
    await page.keyboard.press("Space");
    await page.waitForFunction(
      (time) =>
        document.querySelector(".q-demo-video").currentTime > time + 0.2,
      {},
      pausedAt,
    );
    const duration = await video.evaluate((element) => {
      element.playbackRate = 8;
      return element.duration;
    });
    assert.ok(
      duration >= 20 && duration <= 30,
      `Real clip duration: ${duration}s`,
    );
    await page.waitForFunction(
      () => document.querySelector(".q-demo-video").ended,
    );
    assert.ok(
      await video.evaluate((element) => element.paused && !element.loop),
    );
    await page.click(".q-demo-transcript summary");
    assert.ok(
      await page.$eval(".q-demo-transcript", (element) => element.open),
    );
    assert.equal(
      await page.$$eval(".q-demo-transcript li", (elements) => elements.length),
      3,
    );
    return { duration, nativeKeyboardPauseResume: true, endsWithoutLoop: true };
  });

  let demoFailures = 0;
  await scenario(
    "demo-error-retry",
    async (page) => {
      await navigate(page, "/en");
      await page.click(".q-demo-play");
      await page.waitForSelector(".q-demo-error [role=alert]");
      assert.ok(
        await page.$('.q-demo-error a[href="/videos/qoredb-workflow.mp4"]'),
      );
      await page.click(".q-demo-error button");
      await page.waitForFunction(() => {
        const element = document.querySelector(".q-demo-video");
        return element.currentTime > 0.3 && !element.paused;
      });
      assert.equal(await page.$(".q-demo-error"), null);
      assert.ok(demoFailures >= 2, "Retry makes another media request");
      return { firstResponse: 503, retry: "actual local MP4" };
    },
    {
      mock: (_request, url) =>
        url.pathname === "/videos/qoredb-workflow.mp4" && ++demoFailures === 1
          ? { status: 503, contentType: "video/mp4", body: "" }
          : undefined,
    },
  );

  await scenario(
    "demo-no-javascript",
    async (page, requests) => {
      await navigate(page, "/fr");
      assert.ok(
        !requests.some((request) => request.path.startsWith("/videos/")),
      );
      const href = await page.$eval(".q-demo-play", (element) =>
        element.getAttribute("href"),
      );
      assert.equal(href, "/videos/qoredb-workflow.mp4");
      const response = await fetch(new URL(href, base), { method: "HEAD" });
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type") || "", /video\/mp4/);
      await page.click(".q-demo-transcript summary");
      assert.ok(
        await page.$eval(".q-demo-transcript", (element) => element.open),
      );
      return { fallback: href, transcriptWithoutJavaScript: true };
    },
    { noJS: true },
  );

  const dialogSelector = '[role="dialog"], dialog[open]';
  async function openSearch(page) {
    const trigger = await named(page, en.docs.search_label);
    await trigger.click();
    await page.waitForSelector(dialogSelector, { visible: true });
    const label = await page.$eval(
      dialogSelector,
      (e) =>
        e.getAttribute("aria-label") ||
        (e.getAttribute("aria-labelledby") || "")
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent || "")
          .join(""),
    );
    assert.ok(label.trim(), "Search dialog has an accessible name");
    await page.waitForFunction(
      (selector) =>
        document.querySelector(selector)?.contains(document.activeElement) &&
        document.activeElement?.tagName === "INPUT",
      {},
      dialogSelector,
    );
    return trigger;
  }
  const fixtureModule = `export function createInstance(){return {init:async()=>{await new Promise(resolve=>setTimeout(resolve,250))},destroy:async()=>{},mergeIndex:async()=>{},search:async(query)=>{await new Promise(resolve=>setTimeout(resolve,300));return {results:query==='missing-fixture'?[]:[...Array.from({length:12},(_,i)=>({data:async()=>({url:'/en/features/fixture-'+i,meta:{title:'Non-doc result'},excerpt:'Other route'})})),{data:async()=>({url:'/en/docs/getting-started/installation.html',meta:{title:'Smoke installation result'},excerpt:'Local <mark>installation</mark> fixture'})}]}}}}`;

  await scenario(
    "docs-mobile-fixture",
    async (page, requests) => {
      await navigate(page, "/en/docs");
      assert.ok(
        !requests.some((r) => r.path.startsWith("/pagefind/")),
        "Pagefind loads only on search opening",
      );
      const trigger = await openSearch(page);
      await page.type(
        `${dialogSelector.split(",")[0]} input, dialog[open] input`,
        "installation",
      );
      await page.waitForSelector(
        `${dialogSelector.split(",")[0]} [role=status], dialog[open] [role=status]`,
      );
      await page.waitForFunction(() =>
        [...document.querySelectorAll('[role="dialog"] a,dialog[open] a')].some(
          (a) => a.textContent.includes("Smoke installation result"),
        ),
      );
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press("Tab");
        assert.ok(
          await page.evaluate(
            (selector) =>
              document
                .querySelector(selector)
                ?.contains(document.activeElement),
            dialogSelector,
          ),
          "Tab focus stays inside modal",
        );
      }
      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      assert.ok(
        await page.evaluate(
          (selector) =>
            document.querySelector(selector)?.contains(document.activeElement),
          dialogSelector,
        ),
        "Shift+Tab stays inside modal",
      );
      await page.keyboard.press("Escape");
      await page.waitForSelector(dialogSelector, { hidden: true });
      assert.ok(
        await trigger.evaluate((e) => e === document.activeElement),
        "Closing search restores trigger focus",
      );
      await openSearch(page);
      const input = await page.$('[role="dialog"] input,dialog[open] input');
      await input.click({ clickCount: 3 });
      await page.keyboard.press("Backspace");
      await input.type("missing-fixture");
      await page.waitForFunction(() => {
        const d = document.querySelector('[role="dialog"],dialog[open]');
        return (
          d &&
          /no results/i.test(d.textContent) &&
          !d.querySelector('a[href*="installation"]')
        );
      });
      await noOverflow(page);
    },
    {
      mock: (_request, url) =>
        url.pathname === "/pagefind/pagefind.js"
          ? {
              status: 200,
              contentType: "application/javascript",
              body: fixtureModule,
            }
          : undefined,
    },
  );

  let moduleAttempts = 0;
  await scenario(
    "docs-load-error-retry",
    async (page) => {
      await navigate(page, "/en/docs");
      await openSearch(page);
      await page.waitForFunction(() =>
        /unavailable/i.test(
          document.querySelector("dialog[open] [role=status]")?.textContent ||
            "",
        ),
      );
      await (await named(page, /retry|try again/)).click();
      await page.type(
        '[role="dialog"] input,dialog[open] input',
        "installation",
      );
      await page.waitForFunction(() =>
        [...document.querySelectorAll('[role="dialog"] a,dialog[open] a')].some(
          (a) => a.textContent.includes("Smoke installation result"),
        ),
      );
      assert.ok(moduleAttempts >= 2, "Retry requests index again");
    },
    {
      mock: (_request, url) =>
        url.pathname === "/pagefind/pagefind.js"
          ? ++moduleAttempts === 1
            ? { status: 503, contentType: "application/javascript", body: "" }
            : {
                status: 200,
                contentType: "application/javascript",
                body: fixtureModule,
              }
          : undefined,
    },
  );

  const indexResponse = filter.test("docs-real-index")
    ? await fetch(new URL("/pagefind/pagefind.js", base), {
        signal: AbortSignal.timeout(timeout),
      })
    : null;
  if (indexResponse?.ok)
    await scenario(
      "docs-real-index",
      async (page, requests) => {
        await navigate(page, "/en/docs");
        await openSearch(page);
        await page.type(
          '[role="dialog"] input,dialog[open] input',
          "installation",
        );
        await page.waitForFunction(() =>
          document.querySelector(
            '[role="dialog"] a[href*="/en/docs/"],dialog[open] a[href*="/en/docs/"]',
          ),
        );
        return {
          guardedIndexRequests: requests.filter(
            (request) =>
              request.guard === "cdp" && request.path.startsWith("/pagefind/"),
          ),
        };
      },
      { realWorker: true },
    );
  else if (indexResponse)
    results.push({
      name: "docs-real-index",
      status: "skipped",
      reason: `Index unavailable: HTTP ${indexResponse.status}; run build:search after production build`,
    });

  const agents = {
    windows:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36",
    macIntel:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36",
    macArm:
      "Mozilla/5.0 (Macintosh; ARM Mac OS X 14_0) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36",
    linux:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36",
    unknown: "ShowcaseSmoke/1.0",
  };
  async function selectPlatform(page, platform) {
    await page.$eval(`input[name="platform"][value="${platform}"]`, (input) =>
      input.click(),
    );
    await page.waitForFunction(
      (value) =>
        document.querySelector(`input[name="platform"][value="${value}"]`)
          ?.checked,
      {},
      platform,
    );
  }
  for (const [platform, userAgent] of Object.entries(agents))
    await scenario(
      `download-${platform}`,
      async (page) => {
        await navigate(page, "/en/download");
        await page.waitForFunction(
          (version) => document.body.innerText.includes(version),
          {},
          release.version,
        );
        await noOverflow(page);
        if (platform === "unknown") {
          assert.equal(
            await page.$("main input[name=platform]:checked"),
            null,
            "Unknown OS does not guess a desktop platform",
          );
          await selectPlatform(page, "windows");
        }
        const expected =
          platform === "macArm"
            ? "darwin-aarch64"
            : platform === "macIntel"
              ? "darwin-x86_64"
              : platform === "linux"
                ? "linux-x86_64-appimage"
                : null;
        if (expected) {
          const link = await page.$(
            `main a[href="${release.platforms[expected].url}"]`,
          );
          assert.ok(link, `Explicit download link for ${expected}`);
          await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            link.click(),
          ]);
          assert.equal(
            new URL(page.url()).pathname,
            `/__smoke_download/${expected}`,
          );
        } else {
          assert.ok(
            await page.$(
              'main a[href="https://apps.microsoft.com/detail/9NZLCGFWCHHG"]',
            ),
            "Microsoft Store destination remains available",
          );
        }
      },
      {
        userAgent,
        mock: (_request, url) =>
          url.pathname === "/api/latest-release" ? json(release) : undefined,
      },
    );

  await scenario(
    "download-windows-missing-installers",
    async (page) => {
      await navigate(page, "/en/download");
      await page.waitForFunction(
        (version) => document.body.innerText.includes(version),
        {},
        release.version,
      );
      await selectPlatform(page, "windows");
      assert.ok(
        await page.$(
          'main a[href="https://apps.microsoft.com/detail/9NZLCGFWCHHG"]',
        ),
      );
      assert.ok(
        !(await page.$(
          `main a[href="${release.platforms["windows-x86_64-msi"].url}"]`,
        )),
      );
      assert.ok(
        !(await page.$(
          `main a[href="${release.platforms["windows-x86_64-nsis"].url}"]`,
        )),
      );
      assert.ok(
        (await page.evaluate(() => document.body.innerText)).includes(
          en.download.unavailable,
        ),
      );
    },
    {
      mock: (_request, url) => {
        if (url.pathname !== "/api/latest-release") return;
        const missing = structuredClone(release);
        delete missing.platforms["windows-x86_64-msi"];
        delete missing.platforms["windows-x86_64-nsis"];
        return json(missing);
      },
    },
  );
  await scenario(
    "download-formats",
    async (page) => {
      await navigate(page, "/en/download");
      await page.waitForFunction(
        (version) => document.body.innerText.includes(version),
        {},
        release.version,
      );
      for (const [platform, keys] of [
        ["windows", ["windows-x86_64-msi", "windows-x86_64-nsis"]],
        ["mac", ["darwin-aarch64", "darwin-x86_64"]],
        [
          "linux",
          ["linux-x86_64-appimage", "linux-x86_64-deb", "linux-x86_64-rpm"],
        ],
      ]) {
        await selectPlatform(page, platform);
        for (const key of keys)
          assert.ok(
            await page.$(`main a[href="${release.platforms[key].url}"]`),
            `Format destination ${key}`,
          );
      }
      assert.ok(
        await page.$(
          'main a[href="https://aur.archlinux.org/packages/qoredb-bin"]',
        ),
        "AUR destination preserved",
      );
      await selectPlatform(page, "windows");
      assert.ok(
        await page.$(
          'main a[href="https://apps.microsoft.com/detail/9NZLCGFWCHHG"]',
        ),
        "Windows Store destination preserved",
      );
      await selectPlatform(page, "mac");
      for (const label of [en.download.apple_silicon, en.download.intel_mac])
        assert.ok(
          await named(page, label, "main a"),
          `Named architecture ${label}`,
        );
      await noOverflow(page);
    },
    {
      userAgent: agents.unknown,
      mock: (_request, url) =>
        url.pathname === "/api/latest-release" ? json(release) : undefined,
    },
  );

  const releasePending = pending();
  await scenario(
    "download-loading",
    async (page) => {
      try {
        await page.goto(new URL("/en/download", base).href, {
          waitUntil: "domcontentloaded",
        });
        await page.waitForSelector('main [role="status"]');
        assert.ok(
          (
            await page.$eval('main [role="status"]', (el) => el.textContent)
          ).includes(en.download.loading),
        );
        await selectPlatform(page, "windows");
        assert.ok(
          await page.$(
            'main a[href="https://apps.microsoft.com/detail/9NZLCGFWCHHG"]',
          ),
          "Store works while release is pending",
        );
        releasePending.resolve();
        await page.waitForFunction(
          (version) => document.body.innerText.includes(version),
          {},
          release.version,
        );
      } finally {
        releasePending.resolve();
      }
    },
    {
      mock: async (_request, url) => {
        if (url.pathname === "/api/latest-release") {
          await releasePending.promise;
          return json(release);
        }
      },
    },
  );

  let releaseAttempts = 0;
  await scenario(
    "download-error-retry",
    async (page) => {
      await navigate(page, "/en/download");
      await page.waitForSelector("main [role=alert]");
      assert.ok(
        await page.$('main a[href*="github.com/QoreDB/QoreDB/releases"]'),
        "Release fallback available on API failure",
      );
      await selectPlatform(page, "windows");
      assert.ok(
        await page.$(
          'main a[href="https://apps.microsoft.com/detail/9NZLCGFWCHHG"]',
        ),
        "Windows Store remains available on API failure",
      );
      await (await named(page, /retry|try again/)).click();
      await page.waitForFunction(
        (version) => document.body.innerText.includes(version),
        {},
        release.version,
      );
      assert.ok(releaseAttempts >= 2, "Retry fetched release again");
    },
    {
      mock: (_request, url) =>
        url.pathname === "/api/latest-release"
          ? ++releaseAttempts === 1
            ? json({ error: "Synthetic release failure" }, 503)
            : json(release)
          : undefined,
      expectedConsole:
        /Failed to fetch latest version|Failed to fetch release|API response not ok/,
    },
  );

  await scenario(
    "download-missing-format",
    async (page) => {
      await navigate(page, "/en/download");
      await page.waitForFunction(
        (version) => document.body.innerText.includes(version),
        {},
        release.version,
      );
      assert.equal(
        await page.$(
          `main a[href="${release.platforms["linux-x86_64-appimage"].url}"]`,
        ),
        null,
        "Unavailable AppImage has no live link",
      );
      assert.ok(
        await page.$('main a[href*="github.com/QoreDB/QoreDB/releases"]'),
        "Fallback for missing format",
      );
    },
    {
      userAgent: agents.linux,
      mock: (_request, url) =>
        url.pathname === "/api/latest-release"
          ? json({
              ...release,
              platforms: {
                ...release.platforms,
                "linux-x86_64-appimage": undefined,
              },
            })
          : undefined,
    },
  );

  for (const successful of [false, true]) {
    const checkout = pending();
    const received = pending();
    const bodies = [];
    await scenario(
      `checkout-${successful ? "success" : "failure"}`,
      async (page) => {
        try {
          await navigate(page, "/en/pricing");
          const button = await named(page, en.pricing_page.pro.cta);
          await button.click();
          await Promise.race([
            received.promise,
            new Promise((_resolve, reject) =>
              setTimeout(
                () => reject(new Error("Checkout POST not intercepted")),
                timeout,
              ),
            ),
          ]);
          assert.ok(
            await button.evaluate((e) => e.disabled),
            "Checkout button disabled while waiting",
          );
          assert.ok(
            (await button.evaluate((e) => e.textContent)).includes(
              en.pricing_page.pro.cta,
            ),
            "Checkout keeps its action label while waiting",
          );
          checkout.resolve();
          if (successful) {
            await page.waitForFunction(
              () => location.pathname === "/__smoke_checkout",
            );
          } else {
            await page.waitForSelector("[role=alert]");
            await page.waitForFunction(
              (label) =>
                [...document.querySelectorAll("button")].some(
                  (e) => e.textContent.includes(label) && !e.disabled,
                ),
              {},
              en.pricing_page.pro.cta,
            );
          }
          assert.equal(bodies.length, 1);
          assert.equal(bodies[0].locale, "en");
          return {
            bodies,
            checkout: "entirely mocked; no payment session created",
          };
        } finally {
          checkout.resolve();
        }
      },
      {
        mock: async (request, url) => {
          if (url.pathname !== "/api/checkout" || request.method() !== "POST")
            return;
          bodies.push(JSON.parse(request.postData()));
          received.resolve();
          await checkout.promise;
          return successful
            ? json({ url: `${base.origin}/__smoke_checkout` })
            : json({ error: "Synthetic checkout failure" }, 503);
        },
        expectedConsole: /Synthetic checkout failure|Checkout unavailable/,
      },
    );
  }
  if (filter.test("team-availability")) {
    try {
      const fixtures = await runPricingSSRFixtures();
      results.push(...fixtures);
      for (const fixture of fixtures) console.log(`PASSED ${fixture.name}`);
    } catch (error) {
      results.push({
        name: "team-availability-ssr",
        status: "failed",
        error: error.message,
      });
      console.log(`FAILED team-availability-ssr: ${error.message}`);
    }
  }
} finally {
  await browser.close();
  const summary = {
    passed: results.filter((r) => r.status === "passed").length,
    failed: results.filter((r) => r.status === "failed").length,
    skipped: results.filter((r) => r.status === "skipped").length,
  };
  await writeFile(
    path.join(output, "report.json"),
    JSON.stringify(
      {
        base: base.href,
        createdAt: new Date().toISOString(),
        summary,
        results,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({ ...summary, report: path.join(output, "report.json") }),
  );
  if (summary.failed) process.exitCode = 1;
}

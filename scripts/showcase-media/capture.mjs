import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

// Records the unmodified app against the isolated SQLite fixture described in README.md.
const root = process.env.QORE_MEDIA_ROOT || '/tmp/qore-showcase-media';
const output = resolve(process.env.MEDIA_OUTPUT || `${root}/capture`);
const baseUrl = process.env.QORE_CAPTURE_URL || 'http://127.0.0.1:8089';
const only = process.env.MEDIA_ONLY?.split(',');
const viewport = { width: 1440, height: 900, deviceScaleFactor: 2 };
const local = ['127.0.0.1', 'localhost'];
if (!local.includes(new URL(baseUrl).hostname)) {
  throw new Error('Capture is restricted to a local, isolated instance.');
}
await mkdir(output, { recursive: true });

const heroQuery = `SELECT c.company, c.country, c.plan,
       COUNT(o.id)                AS orders,
       SUM(o.total_cents) / 100.0 AS revenue,
       MAX(o.placed_at)           AS last_order
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.id
ORDER BY revenue DESC
LIMIT 50;`;
// Typed live in the film, so no leading spaces: the editor indents on its own.
const filmQuery = `SELECT c.company, c.country, COUNT(o.id) AS orders,
SUM(o.total_cents) / 100.0 AS revenue
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.id
ORDER BY revenue DESC
LIMIT 50;`;
const guardedQuery = "DELETE FROM invoices\nWHERE status = 'void';";
const delay = ms => new Promise(done => setTimeout(done, ms));
const executed = [];
const blocked = [];

// The HTTP bridge has no licence commands, so the web runtime always falls back to Core.
// For the Pro scenes the harness answers that single status call the way the desktop
// app's own dev tier override does. Nothing else is stubbed: UI and features are real.
const licence = tier => ({
  tier, email: null, payment_id: null, issued_at: null, expires_at: null,
  is_expired: false, seats: null, is_founder: false,
});

async function session(browser, { theme, tier }) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    if (!local.includes(url.hostname) && !['data:', 'blob:'].includes(url.protocol)) return request.abort();
    const body = request.postData();
    if (body && url.pathname.includes('/api/')) {
      const args = JSON.parse(body);
      if (tier && args.command === 'get_license_status') {
        return request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(licence(tier)) });
      }
      // Hard stop: only SELECT statements may ever reach the fixture.
      if (typeof args.query === 'string') {
        if (!/^\s*SELECT\s/i.test(args.query)) {
          blocked.push({ path: url.pathname, query: args.query });
          return request.abort();
        }
        if (url.pathname.includes('/stream/execute_query')) executed.push(args.query);
      }
    }
    return request.continue();
  });
  await page.evaluateOnNewDocument(theme => {
    sessionStorage.setItem('qore_auth_token', 'showcase-local-admin');
    localStorage.setItem('qoredb_onboarding_completed', 'true');
    localStorage.setItem('qoredb_workspace_banner_dismissed', 'true');
    localStorage.setItem('qoredb_completed_tours', JSON.stringify(['first-query', 'first-table', 'first-notebook', 'workspaces']));
    localStorage.setItem('qoredb-theme', theme);
    localStorage.setItem('i18nextLng', 'en');
  }, theme);
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  await delay(3000);

  const leaf = label => page.evaluate(label => {
    const node = [...document.querySelectorAll('*')].find(item => item.children.length === 0 && item.textContent.trim() === label);
    node?.click();
    return Boolean(node);
  }, label);
  const settle = async () => {
    // Toasts and hover states are transient UI: wait them out rather than hiding them.
    await page.mouse.move(720, 892);
    // Typing leaves a keyboard focus ring around the whole workspace; drop focus, not styles.
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForFunction(() => !document.querySelector('[data-sonner-toast]'), { timeout: 12000 }).catch(() => {});
    await delay(400);
  };
  const save = async name => {
    await settle();
    const png = await page.screenshot({ type: 'png' });
    await sharp(png).webp({ quality: 92, effort: 6 }).toFile(resolve(output, `${name}-${theme}.webp`));
    console.log(`saved ${name}-${theme}`);
  };
  const connect = async (name = 'Atelier / demo') => {
    await page.locator(`text/${name}`).click();
    await page.waitForFunction(() => document.body.innerText.includes('Open Query Editor'));
    await delay(600);
  };
  const openDatabase = async () => {
    await leaf('atelier');
    await page.waitForFunction(() => document.body.innerText.includes('Tables (6)'));
    await delay(600);
  };
  const paste = async text => {
    await page.locator('.cm-content').click();
    await page.evaluate(text => {
      const data = new DataTransfer();
      data.setData('text/plain', text);
      document.querySelector('.cm-content').dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    }, text);
    await delay(300);
  };
  const resizeEditor = async delta => {
    const bounds = await (await page.$('[aria-label="Resize editor"]')).boundingBox();
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + delta, { steps: 12 });
    await page.mouse.up();
  };
  return { page, leaf, save, settle, connect, openDatabase, paste, resizeEditor };
}

const scenes = {
  async 'query-workspace'({ page, save, connect, openDatabase, leaf, paste, resizeEditor }) {
    await connect();
    await openDatabase();
    await leaf('SQL Editor');
    await page.waitForSelector('.cm-content');
    await paste(heroQuery);
    await page.locator('[data-tour="query-execute"]').click();
    await page.waitForFunction(() => document.body.innerText.includes('50 row(s)'));
    await resizeEditor(36);
    await page.evaluate(() => document.querySelector('.cm-scroller')?.scrollTo(0, 0));
    await save('query-workspace');
  },
  async 'table-workspace'({ page, save, connect, openDatabase, leaf }) {
    await connect();
    await openDatabase();
    await leaf('customers');
    await page.waitForFunction(() => document.body.innerText.includes('rows loaded'));
    await save('table-workspace');
  },
  async 'er-diagram'({ page, save, connect, openDatabase }) {
    await connect();
    await openDatabase();
    await page.locator('button ::-p-text(Schema)').click();
    await page.waitForFunction(() => document.body.innerText.includes('Virtual relations'));
    await delay(1500);
    await page.locator('button ::-p-text(Fit)').click();
    await delay(1200);
    await save('er-diagram');
  },
  async 'sandbox-changes'({ page, save, connect, openDatabase, leaf }) {
    await connect();
    await openDatabase();
    await leaf('customers');
    await page.waitForFunction(() => document.body.innerText.includes('rows loaded'));
    await page.locator('button ::-p-text(Sandbox)').click();
    await delay(1200);
    await page.locator('[aria-label="Close"]').click().catch(() => {});
    const cell = async text => (await page.evaluateHandle(text => [...document.querySelectorAll('td')].find(item => item.textContent.trim() === text), text)).asElement();
    for (const [from, to] of [['Sofia Haddad', 'Sofia Moreau'], ['growth', 'scale'], ['Milan Okafor', 'Milan Keller'], ['880', '920']]) {
      await (await cell(from)).click({ count: 2 });
      await delay(350);
      await page.evaluate(() => document.activeElement.select?.());
      await page.keyboard.type(to, { delay: 12 });
      await page.keyboard.press('Enter');
      await delay(600);
    }
    const checkbox = await page.evaluateHandle(() => [...document.querySelectorAll('tr')].find(row => row.innerText.includes('Umbra Labs')).querySelector('[aria-label="Select row"]'));
    await checkbox.asElement().click();
    await delay(400);
    const remove = await page.evaluateHandle(() => [...document.querySelectorAll('button')].find(item => item.innerText.trim() === 'Delete' && item.getBoundingClientRect().width > 0));
    await remove.asElement().click();
    await delay(900);
    // Sandbox deletions ask for a confirmation; accepting only queues the change locally.
    const confirm = await page.evaluateHandle(() => [...document.querySelectorAll('[role="dialog"] button, [role="alertdialog"] button')].find(item => /^(Delete|Confirm|Continue)/.test(item.innerText.trim())));
    await confirm.asElement()?.click();
    await delay(900);
    await page.evaluate(() => [...document.querySelectorAll('button')].find(item => /change\(s\)/.test(item.innerText))?.click());
    await delay(900);
    await save('sandbox-changes');
  },
  async 'safety-confirm'({ page, save, connect, paste }) {
    await connect('Atelier / product');
    await page.locator('text/Open Query Editor').click();
    await page.waitForSelector('.cm-content');
    await paste(guardedQuery);
    await page.locator('[data-tour="query-execute"]').click();
    await page.waitForSelector('[role="dialog"], [role="alertdialog"]', { timeout: 8000 });
    await delay(700);
    await save('safety-confirm');
  },
};

// Headless Chrome paints no pointer. The film overlays one that follows the real mouse
// events; it is the only element added to the page, and only while filming.
const pointer = () => {
  const dot = document.createElement('div');
  dot.style.cssText = 'position:fixed;z-index:2147483647;left:0;top:0;width:22px;height:22px;margin:-3px 0 0 -3px;pointer-events:none;transition:transform .06s linear;';
  dot.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2.5v17l4.6-4.3 3 6.6 2.9-1.3-3-6.5h6.3Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  document.body.append(dot);
  addEventListener('mousemove', event => { dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`; }, true);
};

// Chrome's screencast only delivers 1x frames, which is what made the previous film soft.
// Every input here is scripted, so the film is shot frame by frame at 2x instead: one
// screenshot per pointer step or typed character, each with its nominal duration.
scenes.workflow = async ({ page }) => {
  const frames = resolve(output, 'frames');
  await rm(frames, { recursive: true, force: true });
  await mkdir(frames, { recursive: true });
  const timeline = [];
  const shot = async (seconds = 1 / 30) => {
    const file = resolve(frames, `${String(timeline.length).padStart(5, '0')}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 96, optimizeForSpeed: true });
    timeline.push({ file, seconds });
  };
  const hold = async seconds => {
    // A few samples so that transitions and late paints land in the film, then a still.
    for (let index = 0; index < 4; index += 1) await shot(0.1);
    await shot(Math.max(0.1, seconds - 0.4));
  };
  await page.evaluate(pointer);
  let at = { x: 760, y: 520 };
  await page.mouse.move(at.x, at.y);
  const glideTo = async to => {
    const steps = 22;
    for (let index = 1; index <= steps; index += 1) {
      const eased = (1 - Math.cos((index / steps) * Math.PI)) / 2;
      await page.mouse.move(at.x + (to.x - at.x) * eased, at.y + (to.y - at.y) * eased);
      await shot();
    }
    at = to;
    await shot(0.2);
  };
  const glide = async handle => {
    const box = await handle.boundingBox();
    await glideTo({ x: box.x + Math.min(box.width / 2, 60), y: box.y + box.height / 2 });
  };
  const byText = (text, selector = '*') => page.evaluateHandle((text, selector) => [...document.querySelectorAll(selector)].find(item => item.getBoundingClientRect().width > 0 && (selector !== '*' || item.children.length === 0) && item.textContent.trim() === text), text, selector).then(handle => handle.asElement());
  const press = async (text, selector) => {
    await glide(await byText(text, selector));
    await page.mouse.click(at.x, at.y);
  };
  const scroll = async total => {
    for (let index = 0; index < 12; index += 1) {
      await page.mouse.wheel({ deltaY: total / 12 });
      await shot();
    }
  };
  await hold(0.9);
  await press('Atelier / demo');
  await page.waitForFunction(() => document.body.innerText.includes('Open Query Editor'));
  await hold(1);
  await press('atelier');
  await page.waitForFunction(() => document.body.innerText.includes('Tables (6)'));
  await hold(1.1);
  await press('customers');
  await page.waitForFunction(() => document.body.innerText.includes('rows loaded'));
  await hold(1.2);
  await glideTo({ x: 820, y: 560 });
  await scroll(420);
  await hold(1.6);
  await press('atelier', '[role="tab"]');
  await hold(0.7);
  await press('SQL Editor');
  await page.waitForSelector('.cm-content');
  await hold(0.5);
  await glide(await page.$('.cm-content'));
  await page.mouse.click(at.x, at.y);
  await glideTo({ x: 1080, y: 318 });
  for (const character of filmQuery) {
    await page.keyboard.type(character);
    await shot(character === '\n' ? 0.16 : 0.034);
  }
  await hold(0.6);
  await glide(await page.$('[data-tour="query-execute"]'));
  await page.mouse.click(at.x, at.y);
  await page.waitForFunction(() => document.body.innerText.includes('50 row(s)'));
  await hold(1.4);
  await glideTo({ x: 860, y: 700 });
  await scroll(360);
  await hold(2.8);
  const list = timeline.map(({ file, seconds }) => `file '${file}'\nduration ${seconds.toFixed(4)}`).join('\n');
  await writeFile(resolve(output, 'workflow.ffconcat'), `ffconcat version 1.0\n${list}\nfile '${timeline.at(-1).file}'\n`);
  const seconds = timeline.reduce((total, frame) => total + frame.seconds, 0);
  console.log(`shot workflow: ${timeline.length} frames, ${seconds.toFixed(1)} s`);
};

// The film runs first, on a server with no other open session.
const plan = [
  ['workflow', null], ['query-workspace', null], ['table-workspace', null], ['er-diagram', null],
  ['sandbox-changes', 'pro'], ['safety-confirm', null],
].filter(([name]) => !only || only.includes(name));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable',
  headless: true,
  args: ['--no-sandbox', '--font-render-hinting=none'],
  defaultViewport: viewport,
});
const failures = [];
try {
  for (const theme of (process.env.MEDIA_THEMES || 'dark,light').split(',')) {
    for (const [name, tier] of plan) {
      if (name === 'workflow' && theme !== 'dark') continue;
      const context = await browser.createBrowserContext();
      try {
        await scenes[name](await session(context, { theme, tier }));
      } catch (error) {
        failures.push(`${name}-${theme}: ${error.message}`);
        console.error(`FAILED ${name}-${theme}: ${error.message}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
if (executed.some(query => !query.startsWith('SELECT '))) throw new Error('A non-SELECT statement was executed.');
await writeFile(resolve(output, 'capture.json'), JSON.stringify({
  viewport, scenes: plan.map(([name, tier]) => ({ name, tier: tier || 'core' })),
  executed: [...new Set(executed)], blockedBeforeReachingServer: blocked, failures,
  driver: 'SQLite', fixture: 'Atelier synthetic commerce dataset', mutationExecuted: false,
}, null, 2));
if (failures.length) process.exitCode = 1;

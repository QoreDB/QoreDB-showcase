import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

// Records the unmodified app against the isolated SQLite fixture described in README.md.
const output = resolve(process.env.MEDIA_OUTPUT || '/tmp/qore-showcase-media/capture');
const baseUrl = process.env.QORE_CAPTURE_URL || 'http://127.0.0.1:8089';
if (!['127.0.0.1', 'localhost'].includes(new URL(baseUrl).hostname)) {
  throw new Error('Capture is restricted to a local, isolated instance.');
}
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable',
  headless: true,
  args: ['--no-sandbox'],
  defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
const commands = [];
await page.setRequestInterception(true);
page.on('request', request => {
  const url = new URL(request.url());
  if (!['127.0.0.1', 'localhost'].includes(url.hostname) && !['data:', 'blob:'].includes(url.protocol)) {
    return request.abort();
  }
  if (url.pathname.includes('/api/')) {
    const body = request.postData();
    if (body) {
      const args = JSON.parse(body);
      commands.push({ path: url.pathname, command: args.command, query: args.query });
    }
  }
  return request.continue();
});
await page.evaluateOnNewDocument(() => {
  sessionStorage.setItem('qore_auth_token', 'showcase-local-admin');
  localStorage.setItem('qoredb_onboarding_completed', 'true');
  localStorage.setItem('qoredb_workspace_banner_dismissed', 'true');
  localStorage.setItem('qoredb_completed_tours', JSON.stringify(['first-query', 'first-table', 'first-notebook', 'workspaces']));
  localStorage.setItem('qoredb-theme', 'dark');
  localStorage.setItem('i18nextLng', 'en');
});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const edit = async (text, typingDelay = 0) => {
  await page.locator('.cm-content').click();
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.type(text, { delay: typingDelay });
};
const save = async name => {
  const png = await page.screenshot();
  await sharp(png).webp({ quality: 90 }).toFile(resolve(output, `${name}.webp`));
};
const query = "SELECT name, environment, status, region, deployments\nFROM projects\nWHERE environment = 'production'\nORDER BY deployments DESC;";
try {
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  await delay(4500);
  const recorder = await page.screencast({ path: resolve(output, 'workflow.webm'), fps: 24, format: 'webm' });
  const start = performance.now();
  const at = async seconds => delay(Math.max(0, seconds * 1000 - (performance.now() - start)));
  const timings = [];
  const mark = name => timings.push({ name, seconds: Number(((performance.now() - start) / 1000).toFixed(2)) });
  await at(1);
  mark('connect');
  await page.locator('text/Atelier / demo').click();
  await page.waitForFunction(() => document.body.innerText.includes('Open Query Editor'));
  await at(3);
  mark('open-editor');
  await page.locator('text/Open Query Editor').click();
  await page.waitForSelector('.cm-content');
  await at(4.5);
  mark('type-select');
  await edit(query, 22);
  await at(8.5);
  mark('execute-select');
  await page.locator('[data-tour="query-execute"]').click();
  await page.waitForFunction(() => document.body.innerText.includes('4 row(s)'));
  mark('results-visible');
  await at(10);
  const handle = await page.$('[aria-label="Resize editor"]');
  const bounds = await handle.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2 - 72, { steps: 12 });
  await page.mouse.up();
  await page.mouse.move(260, 770);
  await delay(300);
  await save('query-workspace');
  await save('workflow-poster');
  await at(16);
  mark('prepare-update');
  await edit("-- Draft only. Review before execution.\nUPDATE projects\nSET status = 'healthy'\nWHERE name = 'Orbit'\n  AND environment = 'staging';", 24);
  await page.mouse.click(1180, 88);
  await page.mouse.move(260, 770);
  await at(24);
  await recorder.stop();
  mark('end');
  await save('query-draft');
  await page.locator('text/atelier').click();
  await page.waitForFunction(() => document.body.innerText.includes('Tables (1)'));
  await page.locator('text/projects').click();
  await page.waitForFunction(() => document.body.innerText.includes('All 8 rows loaded'));
  await delay(700);
  await save('table-workspace');
  const executed = commands.filter(command => command.path.includes('/stream/execute_query'));
  if (executed.length !== 1 || executed.some(command => !command.query?.startsWith('SELECT '))) {
    throw new Error('Unexpected query execution: capture must execute exactly one SELECT.');
  }
  const appVersion = await page.evaluate(() => document.body.innerText.match(/v(\d+\.\d+\.\d+)/)?.[1] || 'unknown');
  await writeFile(resolve(output, 'capture.json'), JSON.stringify({ viewport: { width: 1280, height: 800 }, timings, executed, appVersion, driver: 'SQLite', fixture: 'Atelier synthetic projects', mutationExecuted: false }, null, 2));
  console.log(JSON.stringify({ output, timings }, null, 2));
} finally {
  await browser.close();
}

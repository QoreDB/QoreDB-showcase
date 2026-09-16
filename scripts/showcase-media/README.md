# QoreDB product media — 16 September 2026

The assets in `public/images/showcase-v2/` and `public/videos/qoredb-workflow.mp4`
are captures of the **unmodified QoreDB 0.1.39 React application**, using its
actual HTTP transport and `qore-server` SQLite driver. No UI mock, fabricated
query result, CSS restyling or generated product image is used. The browser
runtime shares the desktop frontend but does not support every desktop IPC.

Only the isolated synthetic SQLite database `/tmp/qore-showcase-media/atelier.db`
is connected. The connection is a development connection: `production` values
in rows are demonstration data, not a production connection classification.
The seeded vault key and admin token are public local fixture values, never
production credentials. Existing QoreDB profiles and databases are not read.

The film shows connection, writing and executing a SELECT, reading its four
results, then writing an UPDATE draft **without executing it**. This is not a
Sandbox Pro demonstration. The existing sandbox/safety screenshots elsewhere
on the site remain historical assets; their versions have not been relabeled.
The only view adjustment is the application's real editor resize handle.

## Reproduce

Prerequisites already present during capture: adjacent QoreDB checkout,
Rust/Cargo dependencies, pnpm, Python 3 with PyNaCl, Google Chrome, ffmpeg,
and this showcase's existing Puppeteer/Sharp dependencies. No dependencies
were installed. Run the commands from the indicated repositories.

From `QoreDB-showcase`:

```bash
python3 scripts/showcase-media/seed.py
```

From `QoreDB` (build output only; no source or version changes):

```bash
cargo build --manifest-path src-tauri/Cargo.toml -p qore-server --no-default-features --features driver-sqlite --offline
pnpm --config.verify-deps-before-run=false exec vite build --outDir /tmp/qore-showcase-media/web
QORE_SERVER_HOST=127.0.0.1 \
QORE_SERVER_PORT=8089 \
QORE_SERVER_TOKEN=showcase-local-admin \
QOREDB_CONFIG_DIR=/tmp/qore-showcase-media/config \
QORE_VAULT_KEY=showcase-local-fixture \
QORE_VAULT_FILE=/tmp/qore-showcase-media/vault.enc \
QORE_SERVER_WEB_DIR=/tmp/qore-showcase-media/web \
XDG_DATA_HOME=/tmp/qore-showcase-media/data \
XDG_CONFIG_HOME=/tmp/qore-showcase-media/config \
src-tauri/target/debug/qore-server
```

From `QoreDB-showcase`, with that local server running:

```bash
node scripts/showcase-media/capture.mjs
ffmpeg -y -i /tmp/qore-showcase-media/capture/workflow.webm -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart public/videos/qoredb-workflow.mp4
cp /tmp/qore-showcase-media/capture/query-workspace.webp public/images/showcase-v2/
cp /tmp/qore-showcase-media/capture/table-workspace.webp public/images/showcase-v2/
cp /tmp/qore-showcase-media/capture/workflow-poster.webp public/images/showcase-v2/
```

The recorder uses a fresh Chromium profile, sets normal saved theme/onboarding
preferences, blocks external browser requests and rejects non-loopback URLs.
It asserts exactly one streamed query was executed, and that it is a SELECT.
`capture.json` records the actual timings and SQL. The film is silent; the
site provides the localized text alternative and native controls.

## Actual queries

Executed:

```sql
SELECT name, environment, status, region, deployments
FROM projects
WHERE environment = 'production'
ORDER BY deployments DESC;
```

Draft only, never executed:

```sql
-- Draft only. Review before execution.
UPDATE projects
SET status = 'healthy'
WHERE name = 'Orbit'
  AND environment = 'staging';
```

The result contains Atlas (128), Forma (96), Prism (84), Tempo (72). Orbit
remains `review` after filming; this is checked directly in the fixture.
Source frames are 1280 × 800, WebP quality 90. MP4 uses H.264/YUV420p and a
front-loaded metadata atom for compatible progressive playback. See the
committed `capture-provenance.json` for output sizes, hashes and timing.

# QoreDB product media — 17 September 2026

The assets in `public/images/showcase-v2/` and `public/videos/qoredb-workflow.mp4`
are captures of the **unmodified QoreDB 0.1.39 React application**, using its
actual HTTP transport and `qore-server` SQLite driver. No UI mock, fabricated
query result, CSS restyling or generated product image is used. The browser
runtime shares the desktop frontend but does not support every desktop IPC.

Stills are 2880 × 1800 (1440 × 900 viewport at 2x), each in the app's dark and
light theme so the site can match its own theme. The film is 1920 × 1200.

## Fixture

Only the isolated synthetic SQLite database `atelier.db` is connected:
6 related tables (customers, products, orders, order_items, invoices,
deployments), about 8 000 rows. Every company, person and figure comes from a
fixed random seed; email addresses use the reserved `.example` domain.

A second connection, "Atelier / production", points to a **copy of the same
synthetic file** labelled with the `production` environment. It exists to show
the real production safeguard. The seeded vault key and admin token are public
local fixture values, never production credentials. Existing QoreDB profiles
and databases are not read.

## What the harness does and does not touch

- Only `SELECT` statements may reach the server: any other statement is
  aborted in the browser harness before it leaves, and listed in `capture.json`.
  The `DELETE` of the safety scene never leaves the app — the confirmation
  dialog appears first and is left unanswered.
- Sandbox edits (4 updates, 1 delete) are pending local changes. They are never
  applied.
- The HTTP bridge has no licence commands, so the web runtime always runs as
  Core. For the single Pro scene (`sandbox-changes`) the harness answers the
  `get_license_status` call with a Pro status, exactly like the desktop app's
  own dev tier override. Nothing else is stubbed.
- The film overlays a pointer that follows the real mouse events, because
  headless Chrome paints none. It is the only element added to the page.
- The film is shot frame by frame (one 2x screenshot per pointer step or typed
  character, each with a nominal duration) because Chrome's screencast only
  delivers 1x frames. Timing is therefore nominal, not a performance claim; the
  `EXEC` timings visible in the UI are the app's own measurements.

## Reproduce

Prerequisites: adjacent QoreDB checkout with a built `qore-server`, pnpm,
Python 3 with PyNaCl, Google Chrome, ffmpeg, and this showcase's Puppeteer and
Sharp dependencies. `QORE_MEDIA_ROOT` defaults to `/tmp/qore-showcase-media`.

From `QoreDB-showcase`:

```bash
python3 scripts/showcase-media/seed.py
```

From `QoreDB` (build output only; no source or version changes):

```bash
cargo build --manifest-path src-tauri/Cargo.toml -p qore-server --no-default-features --features driver-sqlite --offline
pnpm --config.verify-deps-before-run=false exec vite build --outDir $QORE_MEDIA_ROOT/web
QORE_SERVER_HOST=127.0.0.1 \
QORE_SERVER_PORT=8089 \
QORE_SERVER_TOKEN=showcase-local-admin \
QOREDB_CONFIG_DIR=$QORE_MEDIA_ROOT/config \
QORE_VAULT_KEY=showcase-local-fixture \
QORE_VAULT_FILE=$QORE_MEDIA_ROOT/vault.enc \
QORE_SERVER_WEB_DIR=$QORE_MEDIA_ROOT/web \
XDG_DATA_HOME=$QORE_MEDIA_ROOT/data \
XDG_CONFIG_HOME=$QORE_MEDIA_ROOT/config \
src-tauri/target/debug/qore-server
```

From `QoreDB-showcase`, with that local server running:

```bash
node scripts/showcase-media/capture.mjs          # MEDIA_ONLY=scene,… and MEDIA_THEMES=dark,light narrow a run
cd $QORE_MEDIA_ROOT/capture
ffmpeg -y -f concat -safe 0 -i workflow.ffconcat -vf "fps=30,scale=1920:1200:flags=lanczos" -an \
  -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -movflags +faststart workflow.mp4
```

Then copy `*-dark.webp`, `*-light.webp` to `public/images/showcase-v2/`,
`workflow.mp4` to `public/videos/qoredb-workflow.mp4`, and run
`npm run build:images`. The film's poster is `query-workspace-dark.webp`: same
scene as the film's ending, without the filming pointer.

## Scenes

| File | Tier | Shows |
| --- | --- | --- |
| `query-workspace` | Core | JOIN + aggregate query, 50 result rows |
| `table-workspace` | Core | `customers` table grid |
| `er-diagram` | Core | Schema view with the six tables and their relations |
| `sandbox-changes` | Pro | 4 pending updates and 1 pending delete, changes panel open |
| `safety-confirm` | Core | Production confirmation before a `DELETE` |
| `workflow` (film) | Core | Connect, browse `customers`, write and run the JOIN, read results |

The only statement executed is the `SELECT` of the query scenes; see the
committed `capture-provenance.json`.

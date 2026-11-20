# QoreDB Showcase Website

This repository contains the source code for the **QoreDB landing page and showcase website**.

> **Note:** This is the website repository. If you are looking for the QoreDB application source code, this is not it.

## 🚀 About QoreDB

QoreDB is a **local-first, desktop database client** designed for modern developers. It aims to unify SQL and NoSQL workflows into a single, beautiful, and fast interface.

- **Unified:** Manage PostgreSQL, MySQL, MongoDB, Redis, and more in one place.
- **Local-First:** Runs on your machine, for your machine. No mandatory cloud.
- **Modern:** Built with a focus on speed, aesthetics, and developer experience.

## 🛠 Tech Stack

This website is built with the latest modern web technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **CMS:** [Sanity](https://www.sanity.io/)
- **Internationalization:** [i18next](https://www.i18next.com/)
- **Email:** [Resend](https://resend.com/)
- **Analytics:** [Umami](https://umami.is/) (self-hosted)
- **Hosting:** [Hetzner](https://www.hetzner.com/) (Docker, Nuremberg) behind [Cloudflare](https://www.cloudflare.com/) (DNS/CDN)

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/QoreDB/QoreDB-showcase.git
cd QoreDB-showcase
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory. You will need to configure variables for Sanity CMS and Resend if you want full functionality locally.

```bash
# Example .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
RESEND_API_KEY=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
LICENSE_PRIVATE_KEY=base64_encoded_private_key
SANITY_API_WRITE_TOKEN=...
ANTHROPIC_API_KEY=...
SANITY_TRANSLATION_WEBHOOK_SECRET=...
```

### Blog translation

French posts are translated to English by Claude. In production, a Sanity
webhook calls `POST /api/translate-post` when a French post is published:

- Trigger on create and update, dataset `production`, HTTP method POST.
- Filter: `_type == "post" && (language == "fr" || !defined(language))`
- Projection: `{_id}`
- Secret: the value of `SANITY_TRANSLATION_WEBHOOK_SECRET`.

The route checks the signature, answers immediately and publishes the English
document `<id>-en` in the background. Posts that already have an English
version are skipped, so later edits of the French post do not overwrite it.
Failures are logged with the `[translate-post]` prefix.

`npm run translate:posts pending` lists French posts without an English
version; `translate`, `submit`/`collect` (Batches API) and `publish` handle
them from a local machine.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/` - Next.js App Router pages and layouts.
- `components/` - Reusable UI components.
- `lib/` - Utility functions and shared logic.
- `locales/` - Internationalization JSON files.
- `sanity/` - Sanity CMS schemas and configuration.
- `public/` - Static assets.

## 📄 License

This project is proprietary.

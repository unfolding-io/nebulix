# Nebulix | Astro 7 + Sveltia CMS

[![License: CC BY-ND 4.0](https://img.shields.io/badge/License-CC_BY--ND_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nd/4.0/)

Fast theme for blogs, portfolios, and restaurant menus — built on **Astro 7**, **Tailwind CSS v4**, **content collections**, and **Sveltia CMS**.

## Features

- Blog, portfolio, and restaurant menu
- Typed Content Layer collections (`src/content.config.ts`)
- Optimized images via `astro:assets` `Picture` with layout-aware `sizes` / `widths`
- PhotoSwipe lightbox for image enlargement (no `/images` routes)
- CMS-editable light/dark surfaces
- Sveltia CMS admin at `/admin`
- Pagefind full-text search
- Contact + newsletter via [Astro Actions](https://docs.astro.build/en/guides/actions/) (Mailgun, Postmark, Slack, Mailchimp)

## Requirements

- Node.js **22.12+** (22.19+ recommended)
- npm 10+

## Getting started

```bash
cp env.txt .env
npm install
npm run dev
```

Demo env shortcut:

```bash
npm run dev:demo
```

## Environment

See [`env.txt`](env.txt). Key vars:

| Variable | Purpose |
| --- | --- |
| `BLOG_SLUG` | Blog URL segment (default `blog`) |
| `PORTFOLIO_SLUG` | Portfolio URL segment (default `work`) |
| `MENU_SLUG` | Menu URL segment (default `menu`) |
| `WEBSITE_LANGUAGE` | Locale for UI strings |
| `CURRENCY` / `UNITS` | Display preferences |
| Newsletter / mail / Slack | Used by Astro Actions (see below) |

## CMS (Sveltia)

Open `/admin` in the browser. Collection definitions live in [`src/cms/`](src/cms/). Media is stored under `src/assets`.

On **localhost**, Sveltia offers “Work with local repository” (File System Access). Choose this repo root (the folder that contains `.git`). For production, sign in with GitHub; backend settings are in [`src/pages/admin.astro`](src/pages/admin.astro).

## Forms (Astro Actions)

Contact and newsletter no longer use Netlify edge functions. They run as Astro Actions under [`src/actions/`](src/actions/) with shared providers in [`src/lib/forms/`](src/lib/forms/).

| Action | Used by | Providers |
| --- | --- | --- |
| `actions.contact` | Contact dialog | `mailgun`, `postmark`, `slack` |
| `actions.subscribe` | Footer newsletter | `mailchimp` |

Pages stay statically prerendered; the adapter only serves the action endpoints. Set the matching secrets in `.env` (local) and in your host’s environment UI (production).

Provider setup details: [Contact Form](/blog/contact-form) and [Activate Newsletter](/blog/activate-newsletter) posts in the demo content.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build + Pagefind index |
| `npm run preview` | Preview `dist/` |

## Deploy

Nebulix is mostly static HTML. An [Astro adapter](https://docs.astro.build/en/guides/on-demand-rendering/) is required so Actions can run on the server. The repo ships with **`@astrojs/netlify`**.

Official deploy guides: [Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) · [Netlify](https://docs.astro.build/en/guides/deploy/netlify/) · [Vercel](https://docs.astro.build/en/guides/deploy/vercel/)

### Netlify (default)

Already configured (`adapter: netlify()` in [`astro.config.mjs`](astro.config.mjs), [`netlify.toml`](netlify.toml)).

1. Connect the Git repo in the Netlify UI (or use the Netlify CLI).
2. Build command: `npm run build` · publish directory: `dist` (set by `netlify.toml`).
3. Add the same secrets from `env.txt` under **Site configuration → Environment variables**.
4. Deploy.

### Cloudflare Workers

1. Swap the adapter:

   ```bash
   npx astro add cloudflare
   ```

   That replaces `@astrojs/netlify` with `@astrojs/cloudflare` and updates `astro.config.mjs`.

2. Set secrets / vars in the Cloudflare dashboard (or `wrangler secret put …`) for Mailchimp / Mailgun / Postmark / Slack as needed.
3. Local preview / deploy:

   ```bash
   npx astro build && npx wrangler dev
   npx astro build && npx wrangler deploy
   ```

See the [Cloudflare adapter docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) and [Cloudflare deploy guide](https://docs.astro.build/en/guides/deploy/cloudflare/).

### Vercel

1. Swap the adapter:

   ```bash
   npx astro add vercel
   ```

2. Import the project in Vercel (or `vercel` CLI). Framework preset: Astro.
3. Add environment variables from `env.txt` in the Vercel project settings.
4. Deploy. Build uses `npm run build`; the Vercel adapter emits the serverless Action handlers.

See the [Vercel adapter docs](https://docs.astro.build/en/guides/integrations-guide/vercel/) and [Vercel deploy guide](https://docs.astro.build/en/guides/deploy/vercel/).

### Switching hosts later

Only one adapter should be active. After `npx astro add <platform>`, remove the unused adapter package if it remains in `package.json`, and keep host-specific config (`netlify.toml`, `wrangler.jsonc`, `vercel.json`) aligned with the platform you actually use.

## License

CC BY-ND 4.0 — see [`LICENSE.md`](LICENSE.md). Attribution in the footer must remain visible unless you purchase a license.

# Nebulix | Astro 7 + Sveltia CMS

[![License: CC BY-ND 4.0](https://img.shields.io/badge/License-CC_BY--ND_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nd/4.0/)

Fast theme for blogs, portfolios, and restaurant menus — built on **Astro 7**, **Tailwind CSS v4**, **content collections**, and **Sveltia CMS**.

> App root: this folder (`SITES/AstroThemes` in the repository).

## Features

- Blog, portfolio, and restaurant menu
- Typed Content Layer collections (`src/content.config.ts`)
- Optimized images via `astro:assets` `Picture`
- Sveltia CMS admin at `/admin`
- Pagefind full-text search
- Netlify edge functions for contact / newsletter

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
| Newsletter / mail / Slack | Contact & newsletter providers |

## CMS (Sveltia)

Open `/admin` in the browser. Collection definitions live in [`src/cms/`](src/cms/). Media is stored under `src/assets`.

On **localhost**, Sveltia offers “Work with local repository” (File System Access). Choose the **git repo root** (the folder that contains `.git`, not only `SITES/AstroThemes`) so collection paths like `SITES/AstroThemes/src/content/...` resolve. For production, sign in with GitHub; backend settings are in [`src/pages/admin.astro`](src/pages/admin.astro).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build + Pagefind index |
| `npm run preview` | Preview `dist/` |

## Deploy (Netlify)

Repo-root [`netlify.toml`](../../netlify.toml) sets `base = "SITES/AstroThemes"`. Publish directory is `dist` relative to that base.

## License

CC BY-ND 4.0 — see [`LICENSE.md`](LICENSE.md). Attribution in the footer must remain visible unless you purchase a license.

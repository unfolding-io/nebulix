---
name: migrate
description: Plan and execute migrations to Astro or between Astro versions with minimal regressions.
---

# Migrate to Astro

Use this skill when moving a project from another framework to Astro, converting a static site into Astro, or upgrading an existing Astro codebase.

If `astro-best-practices` is available, apply it alongside this skill so the migrated result follows good Astro defaults rather than just reproducing the old system mechanically.

## Workflow

### 1. Inventory the current system

Before changing code, identify:

- routing structure
- layout/shared shell patterns
- data sources
- styling strategy
- interactive components
- image handling
- deployment/runtime requirements

This determines whether the target should be static, hybrid, or server-rendered.

### 2. Choose the migration shape

Common patterns:

- static HTML to Astro pages and layouts
- Next.js or Nuxt to Astro pages plus framework islands
- Gatsby content/data flows to content collections
- Astro major-version upgrades using the official upgrade guide

Prefer an incremental migration plan when the existing app has meaningful runtime behavior or a large interactive surface.

### 3. Map concepts instead of copying files blindly

Typical mappings:

| Source | Astro target |
| --- | --- |
| shared app shell | layout |
| route component | page or dynamic route |
| markdown/content pipeline | content collection |
| framework-only widget | island with client directive |
| image helper | `astro:assets` or the project’s current image strategy |

Keep framework components only where they still add value. Static content should usually become `.astro`.

### 4. Rebuild the routing and data flow

For each migrated slice:

- recreate routes in `src/pages/`
- move shared wrappers into `src/layouts/`
- migrate structured content into `src/content/`
- replace framework-specific fetching patterns with Astro frontmatter or content APIs

When a page was using `getStaticPaths`-style route generation before, rebuild it explicitly in Astro rather than simulating the old framework lifecycle.

### 5. Handle interactivity as islands

Do not port an entire framework app into Astro unchanged unless that is a deliberate compatibility bridge.

Instead:

- keep the static shell in `.astro`
- preserve framework components for interactive islands
- choose client directives intentionally
- minimize the hydrated surface

### 6. Validate behavior and regressions

Check at least:

- route parity
- metadata and head output
- image rendering
- form behavior
- keyboard navigation
- build and preview behavior
- deployment assumptions

## Astro Upgrade Guidance

For Astro-to-Astro upgrades:

- start with the official upgrade guide and use `npx @astrojs/upgrade` when it fits the repo
- update official integrations and adapters together with Astro, not as a separate afterthought
- verify the local and deployment runtime meet the current Node requirement before debugging code-level issues
- rerun content, routing, and build checks after the upgrade

For Astro 6 specifically, check these breakpoints:

- Node runtime: Astro 6 requires Node 22.12.0 or newer
- content collections: use `src/content.config.*`, define a `loader` for every collection, remove `type`, import `z` from `astro/zod`, use `entry.id` instead of `slug`, and replace `entry.render()` with `render(entry)`
- legacy collection flags: remove any `legacy.collections` config
- file querying: replace `Astro.glob()` with `import.meta.glob()` or `getCollection()` for content collections
- view transitions: replace `<ViewTransitions />` with `<ClientRouter />` if it still exists in the project
- `getStaticPaths()`: remove `Astro.generator`, and replace `Astro.site` with `import.meta.env.SITE` if it is used inside `getStaticPaths()`
- custom schemas: review custom Zod usage against Zod 4 if validation starts failing after the upgrade

Use version-specific docs for breaking changes. Do not assume older migration advice still applies to the current Astro release.

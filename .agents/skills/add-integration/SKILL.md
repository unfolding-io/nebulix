---
name: add-integration
description: Add and configure Astro integrations, adapters, and UI framework tooling.
---

# Add Astro Integration

Use this skill when adding official or community integrations to an Astro project, including UI frameworks, styling tools, adapters, content tooling, and utilities.

If `astro-best-practices` is available, apply it alongside this skill for performance, accessibility, and hydration defaults.

## Workflow

### 1. Classify the integration

Identify what is being added before changing anything:

- UI framework: React, Vue, Svelte, Preact, Solid
- Styling: Tailwind, UnoCSS, Sass, CSS tooling
- Deployment adapter: Netlify, Vercel, Cloudflare, Node
- Content tooling: MDX, Markdoc, CMS integrations
- Utilities: sitemap, Partytown, analytics, database helpers

This determines whether the change affects rendering mode, hydration, config shape, or build output.

### 2. Prefer the official Astro path

Use `astro add` when an official integration supports it:

```bash
npx astro add react
npx astro add tailwind
npx astro add netlify
```

If the integration is community-maintained, install it with the project package manager and wire it into `astro.config.*` manually.

Before finalizing, verify the current setup in the official Astro docs or the integration README, especially when Astro or the integration recently changed versions.

If the project is also upgrading Astro itself, upgrade Astro and official integrations together. For Astro 6, confirm the environment is running Node 22.12.0 or newer before treating integration issues as application bugs.

### 3. Configure Astro deliberately

When editing `astro.config.*`:

- add integrations explicitly and keep the array readable
- set `output` only when the adapter or runtime requires it
- avoid enabling server output unless the feature actually needs request-time work
- preserve existing config ordering unless the integration docs require a specific sequence

Example:

```ts
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
})
```

### 4. Handle framework components with restraint

When adding React, Vue, or another UI framework:

- prefer `.astro` for static content
- keep framework components for interactive islands
- choose the lightest client directive that satisfies the UX

Hydration guidance:

- `client:visible` for below-the-fold or deferred UI
- `client:idle` for non-critical enhancements
- `client:load` only for immediately interactive UI
- `client:only` only when skipping server rendering is intentional

### 5. Finish the surrounding setup

Do not stop at package installation. Check for:

- stylesheet imports or entrypoints
- environment variables
- config files such as `tailwind.config.*`
- adapter-specific output requirements
- platform deployment settings

For Tailwind v4, the minimum setup is often just:

```css
@import "tailwindcss";
```

and importing that stylesheet from a shared layout or entrypoint.

### 6. Validate the result

After setup:

- confirm the integration is registered in `astro.config.*`
- run the project checks that make sense for the repo, such as `astro check`, `astro build`, or the existing test suite
- confirm the deployment/runtime environment still matches the adapter requirements after major Astro upgrades
- inspect for hydration mismatches, missing styles, or adapter/runtime drift

## Common Failure Modes

- Package installed but not added to `integrations`
- Adapter added without matching `output`
- Styles present but never imported
- Framework component added where a plain `.astro` component would be simpler
- Overuse of `client:load`, increasing JavaScript cost

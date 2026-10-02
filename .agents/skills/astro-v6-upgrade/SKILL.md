---
name: astro-v6-upgrade
description: Guide for upgrading Astro projects from v5 to v6. Use when users mention upgrading Astro, Astro v6, Astro 6, the Cloudflare adapter v13, or errors related to content collections, ViewTransitions, Astro.glob, Zod schemas, or the Content Layer API.
---

# Astro v6 Upgrade Guide

This skill is based on the final [Astro v6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/) and the [Cloudflare adapter v13 migration](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#upgrading-to-v13-and-astro-6).

## Quick Start

1. **Check Node version**: Astro v6 requires Node `22.12.0` or higher. Check with `node -v`, and update `.nvmrc` / deployment config if needed. Ensure that you include CI workflows in this update if applicable.
2. **Upgrade Astro and official integrations together**:
   ```bash
   npx @astrojs/upgrade      # npm
   pnpm dlx @astrojs/upgrade # pnpm
   yarn dlx @astrojs/upgrade # yarn
   ```
3. **Check for legacy content collections** (see below). v5 supported legacy collections via backwards-compat even without the flag. v6 removes that entirely.
4. **If deploying to Cloudflare**: the `@astrojs/cloudflare` v13 upgrade has significant changes. Load [cloudflare.md](cloudflare.md).
5. **Fix any errors** using this guide.

## Check: Legacy Content Collections

**Before upgrading**, check if the project needs content-collection migration. Many v5 projects silently relied on legacy backwards-compat (no flag required) and will break on v6.

**Decision tree:**

1. **Does `src/content/config.{js,ts,mjs,mts}` exist?**
   - Yes → needs migration (legacy config location).
2. **Are there content folders in `src/content/` but no config file anywhere?**
   - Yes → needs migration (implicit legacy collections).
3. **Otherwise, check `src/content.config.{js,ts,mjs,mts}` for:**
   - Any collection without a `loader` property → needs migration.
   - Any collection with `type:` set → needs migration.
4. **Does the code use `getEntryBySlug()`, `getDataEntryById()`, `entry.slug`, or `entry.render()`?**
   - Yes → needs migration.

If any apply, load [content-collections.md](content-collections.md).

**Temporary escape hatch** (if migration can't happen immediately):

```js title="astro.config.mjs"
export default defineConfig({
  legacy: {
    collectionsBackwardsCompat: true,
  },
});
```

This preserves the v4-style behavior: `src/content/config.ts` location, `type: 'content'`/`'data'` without loaders, `entry.slug`, `entry.render()`, path-based IDs. It is explicitly a migration helper and should be removed as soon as the project moves to the Content Layer API.

**Note**: The old `legacy.collections: true` flag is removed. Remove it if present.

## Quick Fixes

These are simple renames/replacements. Apply directly.

### ViewTransitions → ClientRouter

```astro
---
// Before
import { ViewTransitions } from 'astro:transitions';
// After
import { ClientRouter } from 'astro:transitions';
---

<!-- Before -->
<ViewTransitions />
<!-- After -->
<ClientRouter />
```

Also remove the `handleForms` prop if present - it is now removed entirely (form handling has been built in by default since v4).

### Astro.glob() → import.meta.glob()

```astro
---
// Before
const posts = await Astro.glob('./posts/*.md');

// After - note: no longer returns a Promise
const posts = Object.values(import.meta.glob('./posts/*.md', { eager: true }));
---
```

Consider content collections for content, or `fast-glob` for runtime globbing.

### Zod imports

```ts
// Before (deprecated)
import { z } from 'astro:content';
import { z } from 'astro:schema';

// After
import { z } from 'astro/zod';
```

`astro:schema` and `z` from `astro:content` are deprecated - import `z` from `astro/zod` directly. For Zod 4 API changes (string formats, error messages, transforms), see [zod.md](zod.md).

### Deprecated APIs

```ts
// Astro.site in getStaticPaths → import.meta.env.SITE
export function getStaticPaths() {
  const site = import.meta.env.SITE;  // was Astro.site
}

// Astro.generator in getStaticPaths → just remove it

// import.meta.env.ASSETS_PREFIX → astro:config/server
import { build } from 'astro:config/server';
const prefix = build.assetsPrefix;
```

### Removed: emitESMImage()

```ts
// Before
import { emitESMImage } from 'astro/assets/utils';
const result = await emitESMImage(imageId, false, false);

// After
import { emitImageMetadata } from 'astro/assets/utils';
const result = await emitImageMetadata(imageId);
```

### Removed: `<ClientRouter />` `handleForms` prop

Forms are handled automatically since v4. Remove the prop:

```astro
<!-- Before -->
<ClientRouter handleForms />
<!-- After -->
<ClientRouter />
```

### Removed: `prefetch()` `with` option

```ts
// Before
prefetch('/about', { with: 'fetch' });
// After
prefetch('/about');
```

### Removed: `rewrite()` from Actions context

```ts
// Inside an Action handler - remove any context.rewrite() calls.
// Use custom endpoints instead if you need redirect/rewrite behavior.
```

### Removed: exposed `astro:transitions` internals

If imported, remove these or use plain string event names:

```ts
// Before
import {
  createAnimationScope,
  isTransitionBeforePreparationEvent,
  TRANSITION_AFTER_SWAP,
} from 'astro:transitions/client';

console.log(isTransitionBeforePreparationEvent(event));
console.log(TRANSITION_AFTER_SWAP);

// After
console.log(event.type === 'astro:before-preparation');
console.log('astro:after-swap');
// createAnimationScope has no replacement - remove it.
```

### Removed: exposed `astro:actions` internals

`serializeActionResult` and `deserializeActionResult` are no longer exported from `astro:actions`. Use `getActionContext()` in middleware:

```ts title="src/middleware.ts"
import { defineMiddleware } from 'astro:middleware';
import { getActionContext } from 'astro:actions';

export const onRequest = defineMiddleware(async (context, next) => {
  const { serializeActionResult, deserializeActionResult } = getActionContext(context);
  // ...
});
```

Also remove imports of: `ACTION_ERROR_CODES`, `ActionInputError`, `appendForwardSlash`, `astroCalledServerError`, `callSafely`, `formDataToObject`, `getActionQueryString`, `type Actions`, `type ActionAccept`, `type AstroActionContext`, `type SerializedActionResult`.

### Removed: CommonJS config files

`astro.config.cjs` and `astro.config.cts` are no longer supported. Rename to `.mjs`, `.js`, `.ts`, or `.mts`.

### Changed: getStaticPaths params must be strings

```ts
// Before - numbers were auto-stringified
return [{ params: { id: 1 } }];
// After - must be string or undefined
return [{ params: { id: "1" } }];
```

### Changed: Session driver config

```js title="astro.config.mjs"
// Before
import { defineConfig } from 'astro/config';

export default defineConfig({
  session: {
    driver: 'redis',
    options: { url: process.env.REDIS_URL },
  },
});

// After
import { defineConfig, sessionDrivers } from 'astro/config';

export default defineConfig({
  session: {
    driver: sessionDrivers.redis({ url: process.env.REDIS_URL }),
  },
});
```

### Removed: Percent-encoding in route filenames

`%25` is no longer allowed in filenames. Rename any `src/pages/test%25file.astro` etc.

## Error Quick Reference

| Error | Fix |
|-------|-----|
| `LegacyContentConfigError` | Move `src/content/config.ts` → `src/content.config.ts` |
| `ContentCollectionMissingALoaderError` | Add `loader` to collection - see [content-collections.md](content-collections.md) |
| `ContentCollectionInvalidTypeError` | Remove `type: 'content'` or `type: 'data'` from collection |
| `GetEntryDeprecationError` | Replace `getEntryBySlug()`/`getDataEntryById()` with `getEntry()` |
| `ContentSchemaContainsSlugError` | Replace `.slug` with `.id`, use `.filePath` for filename |
| Cannot find `ViewTransitions` | Use `ClientRouter` (see above) |
| Cannot find `Astro.glob` | Use `import.meta.glob()` (see above) |
| Node version error | Upgrade to Node 22.12.0+ |
| Zod validation errors | Check [zod.md](zod.md) for Zod 4 changes |
| Cloudflare: `Astro.locals.runtime is undefined` | See [cloudflare.md](cloudflare.md) - access moved |

## Deep Dive Files

Load these only when needed:

| File | When to load |
|------|--------------|
| [content-collections.md](content-collections.md) | Legacy content collections need migration |
| [zod.md](zod.md) | Using Zod schemas with `.email()`, `.url()`, custom errors, transforms, or `.default()` |
| [behavior-changes.md](behavior-changes.md) | Subtle issues: i18n redirects, script/style order, env vars, image sizing, Vitest, Shiki, SVGs |
| [integration-api.md](integration-api.md) | Building integrations or adapters |
| [cloudflare.md](cloudflare.md) | Deploying to Cloudflare Workers / Pages, upgrading `@astrojs/cloudflare` to v13 |

## Experimental Flags to Remove

These flags are now stable, default, or renamed. Remove from config:

```js
export default defineConfig({
  experimental: {
    // Remove all of these - now stable or default:
    csp: true,                     // stable: use `security.csp`
    fonts: true,                   // stable
    liveContentCollections: true,  // stable
    preserveScriptOrder: true,     // now default - see behavior-changes.md
    staticImportMetaEnv: true,     // now default - see behavior-changes.md
    headingIdCompat: true,         // now default - see behavior-changes.md
    failOnPrerenderConflict: true, // renamed to `prerenderConflictBehavior`
  },
});
```

## Official Adapter Upgrades

All official adapters need a major upgrade alongside Astro v6 (to accompany Vite 7 + Environment API):

- [`@astrojs/cloudflare`](https://github.com/withastro/astro/blob/main/packages/integrations/cloudflare/CHANGELOG.md) → **v13** (significant breaking changes - see [cloudflare.md](cloudflare.md))
- [`@astrojs/netlify`](https://github.com/withastro/astro/blob/main/packages/integrations/netlify/CHANGELOG.md)
- [`@astrojs/node`](https://github.com/withastro/astro/blob/main/packages/integrations/node/CHANGELOG.md)
- [`@astrojs/vercel`](https://github.com/withastro/astro/blob/main/packages/integrations/vercel/CHANGELOG.md)

## Resources

- [Astro v6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Astro v6 Blog Post](https://astro.build/blog/astro-6-beta/)
- [Content Layer Deep Dive](https://astro.build/blog/content-layer-deep-dive/)
- [Cloudflare adapter docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)

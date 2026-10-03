# Cloudflare adapter v13 + Astro 6

Astro 6 requires `@astrojs/cloudflare` **v13** or later. The v13 upgrade is significant: `astro dev` and `astro preview` now run inside Cloudflare's real `workerd` runtime via the Cloudflare Vite plugin, so development closely mirrors production.

This also means several long-standing APIs changed - in particular `Astro.locals.runtime` is gone, and the Wrangler `main` entrypoint is new.

## Quick checklist

- [ ] Upgrade `@astrojs/cloudflare` to v13 (and Astro to v6).
- [ ] Update `wrangler.jsonc` `main` to `@astrojs/cloudflare/entrypoints/server` (or, if you used `workerEntryPoint`, point it at your own Worker file and rewrite using `@astrojs/cloudflare/handler`).
- [ ] Replace `Astro.locals.runtime.env` with `import { env } from 'cloudflare:workers'`.
- [ ] Replace `Astro.locals.runtime.cf` with `Astro.request.cf`.
- [ ] Replace `Astro.locals.runtime.caches` with the global `caches`.
- [ ] Replace `Astro.locals.runtime.ctx` with `Astro.locals.cfContext`.
- [ ] Remove `cloudflareModules` from adapter config (no longer needed).
- [ ] If deploying to Pages, decide: migrate to Workers (recommended) or apply Pages-specific config.
- [ ] Run `wrangler types` after any config change.

## Development server now runs on workerd

`astro dev` and `astro preview` use the Cloudflare Vite plugin to run inside the real Workers runtime. This is enabled by Vite's Environment API (new in Astro 6).

Benefits:

- Durable Objects, R2, KV, Workers AI, and other bindings behave exactly as in production during dev.
- Node.js-specific behaviour no longer silently "just works" in dev; you catch compat issues before deployment.
- `astro preview` is now supported and uses `workerd` too.

What to check in your project:

- Any code that depended on Node.js globals or filesystem access in dev will need to be guarded or moved to prerender/build time.
- If you had custom dev-server wiring (e.g. custom Vite plugins assuming Node environment), revisit it against the Environment API.

## Wrangler entrypoint change

The `main` field of `wrangler.jsonc` previously pointed at the built worker (`dist/_worker.js/index.js`). It now points to a single adapter-provided entrypoint that handles both `astro dev` and production builds.

```jsonc title="wrangler.jsonc"
{
  // Before
  "main": "dist/_worker.js/index.js",
  // After
  "main": "@astrojs/cloudflare/entrypoints/server",
  "name": "my-astro-app",
}
```

### Custom Worker entrypoint (replaces `workerEntryPoint`)

If you had a custom worker in v12 (e.g. for Durable Objects, Queues, or other Worker features), the adapter's `workerEntryPoint` option is **removed**. Point `main` at your own file instead, and write it as a standard Cloudflare Worker module using `@astrojs/cloudflare/handler`.

#### 1. Remove the adapter option

```js title="astro.config.mjs"
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare({
    // Remove:
    // workerEntryPoint: {
    //   path: 'src/worker.ts',
    //   namedExports: ['MyDurableObject'],
    // },
  }),
});
```

#### 2. Point `wrangler.jsonc` `main` at your entry file

```jsonc title="wrangler.jsonc"
{
  "main": "./src/worker.ts"
}
```

#### 3. Rewrite the entrypoint with `@astrojs/cloudflare/handler`

```ts title="src/worker.ts"
import { handle } from '@astrojs/cloudflare/handler';
import { DurableObject } from 'cloudflare:workers';

export class MyDurableObject extends DurableObject<Env> {
  // ...
}

export default {
  async fetch(request, env, ctx) {
    await env.MY_QUEUE.send('log');
    return handle(request, env, ctx);
  },
  async queue(batch, _env) {
    const messages = JSON.stringify(batch.messages);
    console.log(`consumed from our queue: ${messages}`);
  },
} satisfies ExportedHandler<Env>;
```

Key differences from v12:

- Import `handle` from `@astrojs/cloudflare/handler` and call it in `fetch()`.
- No more `createExports(manifest)` wrapper - the manifest is created internally by the adapter.
- Export a standard Cloudflare Worker object, plus any Durable Objects / other named exports.

## `wrangler.jsonc` is now optional

For projects without custom bindings, you can delete `wrangler.jsonc` entirely. Astro generates a default config using the `package.json` `name` (or directory name) as the Worker name.

If your only contents were the default scaffolding:

```jsonc
{
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2025-05-21",
  "assets": { "directory": "./dist", "binding": "ASSETS" }
}
```

then it is safe to delete. Otherwise, keep a minimal config for your custom settings:

```jsonc title="wrangler.jsonc"
{
  "name": "my-astro-app",
  "kv_namespaces": [{ "binding": "MY_KV", "id": "<namespace_id>" }]
}
```

## `Astro.locals.runtime` removed

This is the biggest runtime API change. The `Astro.locals.runtime` object is gone; access Cloudflare APIs directly through the standard Workers interfaces.

### Environment variables and bindings

```astro
---
// Before
const { env } = Astro.locals.runtime;
const value = env.MY_VARIABLE;
const kv = env.MY_KV;

// After
import { env } from 'cloudflare:workers';
const value = env.MY_VARIABLE;
const kv = env.MY_KV;
---
```

`cloudflare:workers` is a static, top-level import and works throughout the server code (pages, endpoints, middleware, actions). For public/typed env, `astro:env` also works:

```ts
import { MY_VARIABLE } from 'astro:env/server';
```

Run `wrangler types` after changing `wrangler.jsonc` or `.dev.vars` to refresh the typed `Env`.

### `cf` request metadata

```astro
---
// Before
const { cf } = Astro.locals.runtime;
const country = cf?.country;

// After
const cf = Astro.request.cf;
const country = cf?.country;
---
```

### Cache API

The caches API is now the standard global `caches`:

```ts
// Before
const { caches } = Astro.locals.runtime;
caches.default.put(request, response);

// After
caches.default.put(request, response);
```

### Execution context (`ctx`)

`Astro.locals.runtime.ctx` moves to `Astro.locals.cfContext`:

```astro
---
// Before
const ctx = Astro.locals.runtime.ctx;
ctx.waitUntil(someAsyncOperation());

// After
const ctx = Astro.locals.cfContext;
ctx.waitUntil(someAsyncOperation());

// And for Durable Object exports:
ctx.exports.Greeter.greet('Astro');
---
```

## `cloudflareModules` option removed

The `cloudflareModules` adapter option is gone. Cloudflare natively supports `.sql`, `.wasm`, `.bin`, and `.txt` module imports.

```ts title="astro.config.mjs"
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare({
    // Remove:
    // cloudflareModules: true
  }),
});
```

Supported file module imports (each exports a single default value):

- `.wasm` or `.wasm?module` → `WebAssembly.Module`
- `.bin` → `ArrayBuffer`
- `.txt` → `string`

## Cloudflare Pages now deprecated

The adapter defaults to deploying to Cloudflare Workers. Pages is still possible but requires manual configuration, and Cloudflare recommends Workers for new projects.

### Migrating Pages → Workers (recommended)

Follow [Cloudflare's Pages-to-Workers migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/). Typically:

1. Delete any `_routes.json` / `_worker.js` scaffolding specific to Pages.
2. Ensure `wrangler.jsonc` has a `name` and your bindings.
3. Use `wrangler deploy` (or connect a Git project to a Worker) instead of the Pages CI integration.

### Staying on Pages

If you must stay on Pages, configure the Astro build output and add `_routes.json`:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare(),
  build: {
    client: './',
    server: './_worker.js',
  },
});
```

```jsonc title="public/_routes.json"
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/static/*"]
}
```

See [Cloudflare's Pages routing docs](https://developers.cloudflare.com/pages/functions/routing/#create-a-_routesjson-file).

## Local preview (`astro preview`)

New in v13: `astro preview` runs your built project in `workerd` locally.

```sh
astro build
astro preview
```

For more helpful error messages during local preview, disable Vite minification:

```js title="astro.config.mjs"
export default defineConfig({
  adapter: cloudflare(),
  vite: {
    build: {
      minify: false,
    },
  },
});
```

## Typing your environment

Always generate types from your Wrangler config - **do not augment `Env` manually**:

```sh
wrangler types
```

Recommended `package.json` scripts so types stay fresh:

```json title="package.json"
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "wrangler types && astro check && astro build",
    "preview": "astro preview"
  }
}
```

## Image service recommendations

The adapter's `imageService` option still accepts `'compile' | 'passthrough' | 'cloudflare' | 'cloudflare-binding' | 'custom'`. With SVG rasterization and cropping/upscaling changes in Astro 6, review your image usage (see [behavior-changes.md](behavior-changes.md)).

If you use the `cloudflare-binding` service, note the `imagesBindingName` option (default: `IMAGES`).

## Common errors

| Error / symptom | Fix |
|-----------------|-----|
| `Astro.locals.runtime is undefined` | Replace per the table above (`cloudflare:workers`, `Astro.request.cf`, global `caches`, `Astro.locals.cfContext`). |
| Dev server behaves differently than before | `astro dev` now runs in `workerd`. Remove Node-only code paths or guard them. |
| Build warns about `workerEntryPoint` | Remove from adapter config; use `wrangler.jsonc` `main` and `@astrojs/cloudflare/handler` pattern. |
| `cloudflareModules` unknown option | Delete the option - native imports handle `.wasm`/`.bin`/`.txt`/`.sql`. |
| Type errors on `env` | Run `wrangler types`; import `env` from `cloudflare:workers` (or use `astro:env`). |

## Resources

- [Cloudflare adapter docs - Upgrading to v13](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#upgrading-to-v13-and-astro-6)
- [`@astrojs/cloudflare` CHANGELOG](https://github.com/withastro/astro/blob/main/packages/integrations/cloudflare/CHANGELOG.md)
- [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [Pages → Workers migration](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Cloudflare Node.js compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
- [Cloudflare supported bindings](https://developers.cloudflare.com/workers/wrangler/api/#supported-bindings)

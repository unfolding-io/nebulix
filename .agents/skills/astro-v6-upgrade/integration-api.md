# Integration & Adapter API Changes

This document covers changes for **integration and adapter authors**. If you only consume integrations and adapters, you likely don't need this - but the [Cloudflare adapter v13 upgrade](cloudflare.md) is required for all Cloudflare users.

Astro v6 adopts **Vite 7** and [Vite's Environment API](https://vite.dev/guide/api-environment). That drives most of the API changes here, and enables things like running `astro dev` inside `workerd` for Cloudflare.

## Vite Environment API Integration

### `astro:build:setup` hook

The hook is now called **once** with all environments (`ssr`, `client`, `prerender`) configured, not separately per build target. The `target` parameter is gone.

```ts
// Before (v5)
{
  hooks: {
    'astro:build:setup': ({ target, vite }) => {
      if (target === 'client') {
        vite.build.minify = false;
      }
    },
  },
}

// After (v6)
{
  hooks: {
    'astro:build:setup': ({ vite }) => {
      vite.environments.client.build.minify = false;
    },
  },
}
```

Available environments on `vite.environments`:
- `client` - browser bundle
- `ssr` - on-demand rendered server bundle
- `prerender` - prerendered build

### HMR access

Replace `server.hot.send()` with environment-specific access:

```ts
// Before
server.hot.send(event);
// After
server.environments.client.hot.send(event);
```

This affects custom integrations using HMR and dev toolbar apps.

## `astro:ssr-manifest` virtual module removed

The `astro:ssr-manifest` virtual module is removed entirely. Astro no longer uses it internally; build-time manifest data is passed through integration hooks and adapter APIs instead.

```ts
// Before
import { manifest } from 'astro:ssr-manifest';
const srcDir = manifest.srcDir;

// After - for config values
import { srcDir, outDir, root } from 'astro:config/server';
```

For build-specific manifest data, use the `astro:build:ssr` integration hook, which receives the manifest as a parameter.

## `RouteData.generate()` removed

Route generation is handled internally by Astro now.

```ts
// Before
const generated = route.generate(params);
// After
// Remove the call entirely.
```

## `routes` on `astro:build:done` removed

Use `astro:routes:resolved` for the list of routes, and `assets` on `astro:build:done` for build output locations:

```ts
const integration = () => {
  let routes;
  return {
    name: 'my-integration',
    hooks: {
      'astro:routes:resolved': ({ routes: resolved }) => {
        routes = resolved;
      },
      'astro:build:done': ({ assets }) => {
        for (const route of routes) {
          const distURL = assets.get(route.pattern);
          if (distURL) {
            Object.assign(route, { distURL });
          }
        }
      },
    },
  };
};
```

## `entryPoints` on `astro:build:ssr` removed

The `entryPoints` map was always empty after `functionPerRoute` was deprecated in v5. It is now removed:

```ts
// Before
'astro:build:ssr': ({ entryPoints }) => { /* ... */ },
// After
'astro:build:ssr': (params) => { /* entryPoints no longer available */ },
```

## Percent-encoding in route filenames removed

Filenames containing `%25` are no longer allowed (security hardening). Rename any `src/pages/test%25file.astro` etc.

## `app.render()` signature

The old multi-argument signature is removed. Pass options as an object:

```ts
// Before
app.render(request, routeData, locals);
// After
app.render(request, { routeData, locals });
```

## `app.setManifestData()` removed

Create a new `App` instance if you need a different manifest:

```ts
// Before
app.setManifestData(data);
// After
const newApp = new App(newManifest);
```

## `SSRManifest` Interface Changes

Path properties are now `URL` objects instead of URL strings.

**Affected properties** (now `URL`):

- `srcDir`
- `outDir`
- `cacheDir`
- `publicDir`
- `buildClientDir`
- `buildServerDir`

```ts
// Before - string
const srcPath = manifest.srcDir;        // "file:///path/to/src"
// After - URL
const srcPath = manifest.srcDir.href;   // "file:///path/to/src"
const srcPathname = manifest.srcDir.pathname; // "/path/to/src"
```

**Removed**: `hrefRoot` is no longer available.

**Now async methods**: `serverIslandMappings` and `sessionDriver`:

```ts
// Before
const mappings = manifest.serverIslandMappings;
const driver = manifest.sessionDriver;
// After
const mappings = await manifest.serverIslandMappings?.();
const driver = await manifest.sessionDriver?.();
```

## Adapter API: `NodeApp` deprecated

`NodeApp` from `astro/app/node` is deprecated in favor of `createApp()` plus helpers. This unifies how adapters build a server entrypoint.

```js title="my-adapter/server.js"
// Before
import { NodeApp } from 'astro/app/node';

export function createExports(manifest) {
  const app = new NodeApp(manifest);
  const handler = async (req, res) => {
    const response = await app.render(req);
    await NodeApp.writeResponse(response, res);
  };
  return { handler };
}

// After
import { createApp } from 'astro/app/entrypoint';
import { createRequest, writeResponse } from 'astro/app/node';

const app = createApp();

export const handler = async (req, res) => {
  const request = createRequest(req);
  const response = await app.render(request);
  await writeResponse(response, res);
};
```

Also deprecated: the `NodeAppHeadersJson` type.

## Adapter API: `loadManifest()` and `loadApp()` deprecated

Both are deprecated (they were undocumented). Replace with `createApp()`:

```js
// Before
import { loadManifest, loadApp, NodeApp } from 'astro/app/node';
const manifest = await loadManifest(new URL(import.meta.url));
const app = await loadApp(new URL(import.meta.url));

// After
import { createApp } from 'astro/app/entrypoint';
const app = createApp();
```

## Adapter API: `createExports()` and `start()` deprecated

Adapters now set `entrypointResolution: 'auto'` in `setAdapter()` and write server entrypoints as plain modules (no `createExports()` wrapper). The default `entrypointResolution: 'explicit'` still works for backwards compatibility, but is deprecated and will be removed in a future major.

### Step 1: Update `setAdapter()`

```js title="my-adapter.mjs"
setAdapter({
  // ...
  entrypointResolution: 'auto',   // add this
  // exports: ['handler'],        // remove
  // args: { assets: config.build.assets }  // remove
});
```

### Step 2: Rewrite the server entrypoint

```js title="my-adapter/server.js"
// Before
import { App } from 'astro/app';

export function createExports(manifest) {
  const app = new App(manifest);
  const handler = (event, context) => { /* ... */ };
  return { handler };
}

// After
import { createApp } from 'astro/app/entrypoint';

const app = createApp();

export const handler = (event, context) => { /* ... */ };
```

### Step 3: Replace `start()` with top-level code

```js
// Before
import { App } from 'astro/app';

export function start(manifest) {
  const app = new App(manifest);
  addEventListener('fetch', event => { /* ... */ });
}

// After
import { createApp } from 'astro/app/entrypoint';

const app = createApp();
addEventListener('fetch', event => { /* ... */ });
```

### Step 4: Replace `args` with a virtual module

If you were relying on the second `args` argument of `createExports()`, [expose build-time configuration through a virtual module](https://docs.astro.build/en/reference/adapter-reference/#passing-build-time-configuration) instead:

```js
// Before
export function createExports(manifest, { assets }) { /* ... */ }
// After
import { assets } from 'virtual:@example/my-adapter:config';
```

The Astro core team will attempt to open migration PRs against public adapters that list `astro-adapter` in `package.json` keywords.

## Experimental Flags Removed

If your integration/adapter checks these, update accordingly:

```ts
// All removed / stable:
config.experimental.csp
config.experimental.fonts
config.experimental.liveContentCollections
config.experimental.preserveScriptOrder
config.experimental.staticImportMetaEnv
config.experimental.headingIdCompat
config.experimental.failOnPrerenderConflict
```

For prerender-conflict behavior, check the new config option:

```ts
config.prerenderConflictBehavior;  // 'error' | 'warn'
```

For CSP, check `config.security.csp`.

## Migration Checklist

- [ ] Update `astro:build:setup` to use `vite.environments.{client,ssr,prerender}`
- [ ] Update HMR calls to `server.environments.client.hot`
- [ ] Replace `astro:ssr-manifest` with `astro:config/server`
- [ ] Remove `route.generate()` calls
- [ ] Migrate `astro:build:done` routes to `astro:routes:resolved` + `assets`
- [ ] Remove `entryPoints` usage from `astro:build:ssr`
- [ ] Update `app.render()` to the options-object signature
- [ ] Remove `app.setManifestData()` calls
- [ ] Handle URL objects on `SSRManifest` path properties; drop `hrefRoot`
- [ ] Make `serverIslandMappings` and `sessionDriver` calls async
- [ ] Migrate from `NodeApp` to `createApp()` + `createRequest()`/`writeResponse()`
- [ ] Replace `loadManifest()`/`loadApp()` with `createApp()`
- [ ] Move to `entrypointResolution: 'auto'` and drop `createExports()` / `start()`
- [ ] Replace `args` with a virtual config module
- [ ] Remove experimental flag checks

## Resources

- [Vite Environment API](https://vite.dev/guide/api-environment)
- [Integration API Reference](https://docs.astro.build/en/reference/integrations-reference/)
- [Adapter API Reference](https://docs.astro.build/en/reference/adapter-reference/)
- [astro/app/entrypoint module](https://docs.astro.build/en/reference/modules/astro-app/#imports-from-astroappentrypoint)
- [astro/app/node module](https://docs.astro.build/en/reference/modules/astro-app/#imports-from-astroappnode)

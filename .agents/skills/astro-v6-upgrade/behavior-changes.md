# Behavior Changes

These changes may cause unexpected behavior even if your code still runs. Review if you experience issues.

## Endpoints with File Extensions

Endpoints whose URL ends in a file extension (e.g. `/src/pages/sitemap.xml.ts`) can no longer be accessed with a trailing slash, regardless of `build.trailingSlash`.

| URL | v5 | v6 |
|-----|-----|-----|
| `/sitemap.xml` | Works | Works |
| `/sitemap.xml/` | Works | **404** |

**Fix**: Remove trailing slashes from any links to endpoints with file extensions.

```html
<!-- Before -->
<a href="/sitemap.xml/">Sitemap</a>
<!-- After -->
<a href="/sitemap.xml">Sitemap</a>
```

## getStaticPaths() Params Must Be Strings

Numbers are no longer auto-stringified. `params` must be `string` or `undefined`.

```ts
export function getStaticPaths() {
  return [
    { params: { id: 1 } },    // v5 worked, v6 errors
    { params: { id: "1" } },  // v6 required
  ];
}
```

## `Astro` in `getStaticPaths()` deprecated

Inside `getStaticPaths()`, only `Astro.site` and `Astro.generator` ever worked. Both are now deprecated and will log warnings; any other access throws.

```astro
---
// Before
export async function getStaticPaths() {
  console.log(Astro.generator);
  return getPages(Astro.site);
}

// After
export async function getStaticPaths() {
  // Remove Astro.generator entirely
  return getPages(import.meta.env.SITE);
}
---
```

## `import.meta.env.ASSETS_PREFIX` deprecated

Use `astro:config/server` instead:

```ts
// Before
someLogic(import.meta.env.ASSETS_PREFIX);

// After
import { build } from 'astro:config/server';
someLogic(build.assetsPrefix);
```

## i18n Redirect Default Changed

`i18n.routing.redirectToDefaultLocale` now defaults to `false`, and can only be `true` when `prefixDefaultLocale` is also `true`. This prevents redirect loops previously possible in v5.

- v5 default: visitors to `/` were redirected to `/{defaultLocale}/`
- v6 default: visitors stay at `/`

**To restore old behavior:**

```js title="astro.config.mjs"
export default defineConfig({
  i18n: {
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
```

If using manual routing middleware, update it too:

```js title="src/middleware.js"
import { middleware } from 'astro:i18n';

export const onRequest = middleware({
  prefixDefaultLocale: true,       // was false
  redirectToDefaultLocale: true,
});
```

## Script and Style Rendering Order

Tags now render in source order (v5 reversed them). This was the `experimental.preserveScriptOrder` behavior; it is now default.

```astro
<style>body { background: yellow; }</style>
<style>body { background: red; }</style>
```

- v5: **yellow wins** (reversed)
- v6: **red wins** (source order)

Review `<style>` and `<script>` tags where order matters. You may need to reverse them to keep previous behavior.

## `import.meta.env` Handling

This was the `experimental.staticImportMetaEnv` behavior; it is now default.

**No more coercion**: String values like `"true"` or `"1"` are no longer converted to boolean/number.

```ts
// Before - implicit coercion
const enabled: boolean = import.meta.env.ENABLED;

// After - explicit comparison
const enabled: boolean = import.meta.env.ENABLED === "true";
```

**Always inlined**: Non-public env vars used via `import.meta.env` are inlined at build time, not replaced with `process.env` at runtime.

```ts
// For server secrets that need runtime lookup, use process.env directly
const password = process.env.DB_PASSWORD;
```

Update your `src/env.d.ts` types accordingly:

```ts title="src/env.d.ts"
interface ImportMetaEnv {
  readonly PUBLIC_POKEAPI: string;
  readonly ENABLED: string;  // was: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

namespace NodeJS {
  interface ProcessEnv {
    DB_PASSWORD: string;
  }
}
```

For more control, prefer `astro:env`.

## Image Behavior (Default Image Service)

**Cropping by default**: Images are now cropped automatically when both `width` and `height` are specified. Remove explicit `fit="contain"` (the old default) if you had it:

```astro
---
// Before
<Image src={myImage} width={400} height={300} fit="contain" />
// After (same cropping result)
<Image src={myImage} width={400} height={300} />
---
```

**No upscaling**: The default image service never upscales images beyond their original dimensions. Review images and dimensions, or use a custom image service if upscaling is needed.

**SVG rasterization**: The default (Sharp) image service now converts SVGs when a `format` is specified. Previously, SVGs were silently ignored. If you were relying on the silent skip:

```astro
<!-- Before: SVGs passed through untouched -->
<Image src={imageThatMightBeAnSvg} format="avif" alt="example" />

<!-- After: explicitly guard SVGs -->
<Image
  src={imageThatMightBeAnSvg}
  format={imageThatMightBeAnSvg.src.format === "svg" ? "svg" : "avif"}
  alt="example"
/>
```

Note: SVG rasterization has [known limitations](https://github.com/lovell/sharp/issues?q=is%3Aissue%20state%3Aopen%20svg) (e.g. embedded fonts).

## Responsive Image Styles (CSP-compatible)

Responsive image styles (`fit`, `pos`) are no longer emitted as inline `style=""` attributes. They are now generated at build time into a virtual module, producing hashed classes and `data-*` attributes.

```html
<!-- Before -->
<img style="--fit: cover; --pos: center" />
<!-- After -->
<img class="__a_HaSh350" data-astro-fit="cover" data-astro-pos="center" />
```

This makes responsive images compatible with Astro's Content Security Policy (`security.csp`). Visually inspect responsive images after upgrade; only projects that relied on the inline styles need to adapt.

## Shiki Code Block Styles (CSP-compatible)

Shiki code block styles are no longer emitted as inline `style=""` attributes. They are now emitted as CSS classes via a `<style>` tag in the `<head>`, with hashed class names.

```html
<!-- Before -->
<span style="color: #fffff"></span>
<!-- After -->
<span class="__a_HaSh350"></span>
```

Compatible with `security.csp`. Visually inspect code blocks after upgrade; only projects relying on the inline styles need to adapt.

## Markdown Heading IDs

This was the `experimental.headingIdCompat` behavior; it is now default (uses `github-slugger`).

Trailing hyphens are now preserved when headings end in special characters:

```md
## `<Picture />`
```

- v5: `<h2 id="picture">`
- v6: `<h2 id="picture-">` (trailing hyphen)

Update manual anchor links if they point to affected headings. If `rehypeHeadingIds` was used directly, remove the `headingIdCompat` option:

```js title="astro.config.mjs"
// Before
rehypePlugins: [[rehypeHeadingIds, { headingIdCompat: true }]],
// After
rehypePlugins: [[rehypeHeadingIds]],
```

To keep v5 behavior, write a custom rehype plugin that strips trailing hyphens (see the [upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/#changed-markdown-heading-id-generation) for a full example using `github-slugger` + `hast-util-heading-rank`).

## Testing Astro Components with Vitest

Astro components can no longer be rendered in Vitest client environments (`jsdom`, `happy-dom`). The Container API was allowed in those environments in v5; v6 removes that.

```ts title="vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',  // was 'jsdom' or 'happy-dom'
  },
});
```

Also note: Astro's `getViteConfig()` helper now requires **Vitest v3.2** (Vitest v4 is not yet supported).

## Content Loader Schema (Custom Loaders Only)

If you build a content loader with a **dynamic schema** (a function returning a schema), that signature is removed. Use the new `createSchema()` property instead:

```ts
import type { Loader } from 'astro/loaders';
import { createTypeAlias, zodToTs } from 'zod-to-ts';

function myLoader() {
  return {
    name: 'my-loader',
    load: async (context) => { /* ... */ },
    // Before: schema: async () => await getSchemaFromApi(),
    createSchema: async () => {
      const schema = await getSchemaFromApi();
      const { node } = zodToTs(schema, 'Entry');
      const typeAlias = createTypeAlias(node, 'Entry');
      return { schema, types: `export ${typeAlias}` };
    },
  } satisfies Loader;
}
```

Also note: schema **types are inferred** now, not generated via `zod-to-ts`. Use TypeScript's `satisfies Loader` rather than an explicit return type on the function, so your schema types are preserved for consumers:

```ts
// Before
function myLoader(): Loader { /* ... */ }
// After
function myLoader() {
  return { /* ... */ } satisfies Loader;
}
```

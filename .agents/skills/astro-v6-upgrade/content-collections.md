# Content Collections Migration

This is often the most significant change when upgrading to v6. The legacy Content Collections API (from Astro v2, deprecated in v5) has been **completely removed**, including the automatic backwards-compatibility that v5 applied even without a flag. All collections must use the Content Layer API.

## Quick Check

Your collections need updating if any of these apply:

- Content files in `src/content/**` but no config file at `src/content.config.{js,mjs,ts,mts}`.
- A config file at `src/content/config.*` (old location, now wrong).
- A collection without a `loader` property.
- A collection with `type: 'content'` or `type: 'data'`.
- Code uses `getEntryBySlug()` or `getDataEntryById()`.
- Code uses `entry.slug` or `entry.render()`.

## Temporary Escape Hatch

If you cannot migrate immediately, add this flag to keep v4-style collections working (temporary only):

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';

export default defineConfig({
  legacy: {
    collectionsBackwardsCompat: true,
  },
});
```

This preserves:

- `src/content/config.ts` config location
- `type: 'content'` / `type: 'data'` collections without loaders
- `entry.slug` and `entry.render()`
- Path-based entry IDs (instead of slug-based)

**Note**: The older `legacy.collections: true` flag has been **removed**. Remove it from your config if present.

Migrate to Content Layer as soon as possible and drop this flag.

## Migration Steps

### 1. Rename Config File

```bash
# Before
src/content/config.ts
# After
src/content.config.ts
```

The file must be at `src/content.config.{js,ts,mjs,mts}`, not inside `src/content/`.

If missing, Astro throws `LegacyContentConfigError`.

### 2. Add a Loader to Every Collection

Every collection must define a `loader`. For local Markdown/MDX, use the built-in `glob()` loader:

```ts title="src/content.config.ts"
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
```

#### Common glob patterns

- `'**/*.md'` - all markdown
- `'**/*.{md,mdx}'` - markdown and MDX
- `'**/[^_]*.md'` - all markdown except files starting with `_`
- `'*.json'` - JSON files in the base directory only

Missing loaders throw `ContentCollectionMissingALoaderError`.

### 3. Remove `type`

There is no collection `type` anymore. Delete it:

```ts
const blog = defineCollection({
  type: 'content',   // ❌ Remove
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({ /* ... */ }),
});
```

If left in, Astro throws `ContentCollectionInvalidTypeError`.

### 4. Update Query Methods

Replace deprecated helpers with `getEntry()`:

```ts
// Before
import { getEntryBySlug, getDataEntryById } from 'astro:content';
const post = await getEntryBySlug('blog', 'my-post');
const author = await getDataEntryById('authors', 'john');

// After
import { getEntry } from 'astro:content';
const post = await getEntry('blog', 'my-post');
const author = await getEntry('authors', 'john');
```

Using the removed helpers throws `GetEntryDeprecationError`.

### 5. Replace `.slug` with `.id`

The `slug` property is gone. `id` is now the URL-safe slug. If you need the source filename, use `filePath`.

```astro title="src/pages/[slug].astro"
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },   // ✅ was post.slug
    props: post,
  }));
}
---
```

If a schema references `slug`, Astro throws `ContentSchemaContainsSlugError`.

### 6. Replace `entry.render()` with `render(entry)`

The `render()` method is gone from entries. Import and call `render()` from `astro:content`:

```astro
---
// Before
import { getEntry } from 'astro:content';
const post = await getEntry('pages', 'homepage');
const { Content, headings } = await post.render();

// After
import { getEntry, render } from 'astro:content';
const post = await getEntry('pages', 'homepage');
const { Content, headings } = await render(post);
---
<Content />
```

## Complete Migration Example

### Before (v5 Legacy)

```ts title="src/content/config.ts"
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

```astro title="src/pages/blog/[slug].astro"
---
import { getCollection, getEntryBySlug } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await post.render();
---
<Content />
```

### After (v6 Content Layer)

```ts title="src/content.config.ts"
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

```astro title="src/pages/blog/[slug].astro"
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await render(post);
---
<Content />
```

## Data Collections (JSON, YAML)

Same pattern as content - just a different glob:

```ts title="src/content.config.ts"
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    email: z.email(),       // Zod 4: was z.string().email()
    bio: z.string().optional(),
  }),
});

export const collections = { authors };
```

## Remote / Custom Loaders

For API-backed collections, write an async loader function or a full loader object. A full loader gets full access to the store, incremental sync, and metadata:

```ts title="src/content.config.ts"
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: async () => {
    const response = await fetch('https://api.example.com/products');
    const data = await response.json();
    return data.map((product) => ({
      id: product.slug,
      ...product,
    }));
  },
  schema: z.object({
    name: z.string(),
    price: z.number(),
  }),
});

export const collections = { products };
```

See the [Content Loader reference](https://docs.astro.build/en/reference/content-loader-reference/) for the full `Loader` interface and `createSchema()` (used when a loader needs to expose a dynamically-generated schema).

## Live Content Collections (formerly experimental)

`experimental.liveContentCollections` is now **stable**. Remove the experimental flag if present. See the [content collections guide](https://docs.astro.build/en/guides/content-collections/) for live collections usage.

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `LegacyContentConfigError` | Config at `src/content/config.*` | Rename to `src/content.config.*` |
| `ContentCollectionMissingALoaderError` | Collection has no `loader` | Add `loader: glob({ ... })` |
| `ContentCollectionInvalidTypeError` | Collection has `type: 'content'`/`'data'` | Remove `type` |
| `GetEntryDeprecationError` | Using `getEntryBySlug()` / `getDataEntryById()` | Replace with `getEntry()` |
| `ContentSchemaContainsSlugError` | Schema / queries use `slug` | Use `id`; use `filePath` for original filename |

## Resources

- [Astro v5 upgrade guide - legacy collections](https://docs.astro.build/en/guides/upgrade-to/v5/#legacy-v20-content-collections-api) (full step-by-step for the original v4 → v5 migration)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Content Layer Deep Dive](https://astro.build/blog/content-layer-deep-dive/)
- [Content Loader Reference](https://docs.astro.build/en/reference/content-loader-reference/)

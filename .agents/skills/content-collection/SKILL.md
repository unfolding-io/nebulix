---
name: content-collection
description: Set up and evolve Astro content collections with typed schemas and reliable querying patterns.
---

# Astro Content Collections

Use this skill when creating or refactoring structured content in Astro, such as blogs, docs, changelogs, case studies, team data, or other schema-driven content.

If `astro-best-practices` is available, apply it alongside this skill for naming, accessibility, and performance defaults.

## Workflow

### 1. Decide whether the collection is build-time or live

Most content sites should use build-time collections in `src/content.config.*`. Only reach for live collections in `src/live.config.*` when the data truly needs request-time freshness.

Before coding, decide:

- which collections exist
- which fields are required
- which relationships need references
- whether assets such as images should be validated

Favor a schema that reflects how the site queries content, not just how frontmatter currently looks.

### 2. Define collections in `src/content.config.*`

Use the current Content Layer API. For build-time collections:

- define them in `src/content.config.ts` (or `.js` / `.mjs`)
- give every collection a `loader`
- import `z` from `astro/zod`
- do not use `type: 'content'` or `type: 'data'`

Example:

```ts
import { defineCollection, reference } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: reference('authors'),
    cover: image().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

const authors = defineCollection({
  loader: glob({ base: './src/data/authors', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string(),
    email: z.email().optional(),
    avatar: z.url().optional(),
  }),
})

export const collections = { blog, authors }
```

Useful patterns:

- `glob()` for folders of local entries
- `file()` for a single JSON or other data file
- `z.enum(...)` for controlled values
- `z.coerce.date()` for frontmatter dates
- `reference('collection-name')` for relationships
- `schema: ({ image }) => ...` when image validation matters

### 3. Keep the collection shape current

For Astro 6 and newer:

- use `src/content.config.*`, not `src/content/config.*`
- use `entry.id` as the slug-like identifier in URLs and queries
- use `entry.filePath` only when you truly need the source path
- use `getEntry()` instead of legacy `getEntryBySlug()` or `getDataEntryById()`

Prefer a stable folder structure and predictable IDs. Avoid scattering content across route folders if it is logically a collection.

### 4. Query with intent

Use the content APIs that match the job:

- `getCollection()` for lists
- `getEntry()` for a single known entry
- `getEntries()` for arrays of references
- collection filters for draft/published splits

Example:

```astro
---
import { getCollection } from 'astro:content'

const posts = await getCollection('blog', ({ data }) => !data.draft)
---
```

When rendering entries, keep route generation and content rendering separate enough that each part remains easy to reason about.

### 5. Wire routes and rendering with the current API

For dynamic routes:

- build paths from collection IDs
- pass the entry through props cleanly
- render content with `render(entry)`

Example:

```astro
---
import { getCollection, render } from 'astro:content'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content } = await render(post)
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

### 6. Sync and validate

After changing collections:

- run `npx astro sync` or the repo’s normal Astro workflow
- fix schema mismatches instead of weakening types
- validate at least one real entry per collection
- watch for warnings about missing loaders, legacy config paths, or deprecated imports

## Migration Guidance

When migrating from older content patterns:

1. move `src/content/config.ts` to `src/content.config.ts`
2. add a `loader` to every collection
3. remove any `type: 'content'` or `type: 'data'`
4. replace `import { defineCollection, z } from 'astro:content'` with `import { defineCollection } from 'astro:content'` and `import { z } from 'astro/zod'`
5. replace `post.slug` with `post.id`
6. replace `entry.render()` with `render(entry)`
7. replace `getEntryBySlug()` and `getDataEntryById()` with `getEntry()`

If the project is crossing Astro versions at the same time, verify version-sensitive content APIs in the current official Astro docs before finalizing.

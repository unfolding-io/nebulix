# Zod 4 Changes

Astro v6 upgrades to Zod 4, which has breaking changes to schema definitions. This applies if you use Zod schemas in content collections, Astro Actions, or other configuration.

A [community codemod](https://github.com/nicoespeon/zod-v3-to-v4) can automate many of these changes.

## Import Change

`astro:schema` and `z` from `astro:content` are both **deprecated**. Use `astro/zod` directly:

```ts
// Before (deprecated)
import { z } from 'astro:schema';
import { defineCollection, z } from 'astro:content';

// After
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
```

Importing from `astro/zod` guarantees the same Zod version Astro uses internally.

## String Format Methods

Many string format methods were deprecated in Zod 4 and moved to the top-level `z` namespace:

```ts
// Before (Zod 3)
z.string().email()
z.string().url()
z.string().uuid()
z.string().cuid()
z.string().emoji()
z.string().ip()

// After (Zod 4)
z.email()
z.url()
z.uuid()
z.cuid()
z.emoji()
z.ip()
```

`z.string().regex(/pattern/)` is unchanged.

## Error Messages

The `message` key became `error`:

```ts
// Before (Zod 3)
z.string().min(5, { message: "Too short." });
// After (Zod 4)
z.string().min(5, { error: "Too short." });
```

The custom `errorsMap`/`errorMap` option for redefining or translating errors is no longer supported. Use per-schema `error` messages or Zod 4's new [error customization](https://zod.dev/v4/changelog#error-customization) APIs.

## Default Values with Transforms

In Zod 4, `.default()` must match the **output** type (after transforms), not the input type. Defaults now short-circuit parsing when the input is `undefined`:

```ts
// Before (Zod 3) - default matched input type, was still parsed
z.string().transform(Number).default("0")

// After (Zod 4) - default must match output type
z.string().transform(Number).default(0)
```

For the old behavior where the default is parsed through the transform, use `.prefault()`:

```ts
z.string().transform(Number).prefault("0")
```

## Content Schema Example

```ts title="src/content.config.ts"
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Before: z.string().email()
    authorEmail: z.email(),
    // Before: z.string().url().optional()
    website: z.url().optional(),
    pubDate: z.coerce.date(),
    // Before: z.string().transform(Number).default("0")
    views: z.string().transform(Number).default(0),
  }),
});

export const collections = { blog };
```

## Actions Schema Example

```ts title="src/actions/index.ts"
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  subscribe: defineAction({
    input: z.object({
      // Before: z.string().email()
      email: z.email(),
      // Before: z.string().min(5, { message: 'Too short.' })
      name: z.string().min(5, { error: 'Too short.' }),
    }),
    handler: async (input) => {
      // ...
    },
  }),
};
```

## Resources

- [Zod 4 Changelog](https://zod.dev/v4/changelog)
- [`astro/zod` module reference](https://docs.astro.build/en/reference/modules/astro-zod/)
- [Community codemod: zod-v3-to-v4](https://github.com/nicoespeon/zod-v3-to-v4)

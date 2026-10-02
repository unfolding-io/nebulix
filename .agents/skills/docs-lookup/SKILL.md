---
name: docs-lookup
description: Look up official Astro documentation and answer version-sensitive Astro questions accurately.
---

# Astro Docs Lookup

Use this skill when answering Astro questions that depend on current documentation, exact API names, integration setup, upgrade paths, or version-sensitive behavior.

## Workflow

### 1. Define the exact question

Reduce the request to a specific topic before searching:

- integrations
- content collections
- routing
- assets and images
- rendering modes
- deployment adapters
- migrations or upgrade guides

If the user includes an error message, search that message directly as part of the lookup.

### 2. Prefer official Astro sources

Start with the official Astro documentation and related official references. If the agent has Astro docs tooling or an MCP available, use it. If not, search the official docs site directly.

Avoid relying on blog posts or community snippets when the question is about syntax, configuration, or breaking changes.

### 3. Search with version awareness

Use specific search terms, not broad ones:

- `content collections schema`
- `view transitions`
- `netlify adapter output server`
- `upgrade guide`

When version drift is possible, verify the current version behavior instead of assuming older examples still apply.

### 4. Answer with usable output

When replying:

- start with a direct answer
- include a minimal working snippet when useful
- call out caveats, version constraints, or migration notes
- link the relevant Astro doc page when the topic is deep or likely to change

### 5. If the first search fails

Try one of these before giving up:

- narrower search terms
- the feature’s official package or adapter name
- the exact config key
- the upgrade or migration guide instead of the feature page

## Response Shape

A good answer usually includes:

1. the short answer
2. the relevant example
3. the important caveat
4. the official reference

If you cannot verify the behavior from current official docs, say so explicitly instead of guessing.

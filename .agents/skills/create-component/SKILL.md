---
name: create-component
description: Create Astro components, pages, and layouts with accessible markup and minimal client-side JavaScript.
---

# Create Astro Component

Use this skill when scaffolding a new Astro component, page, layout, or route from a feature request, design, or static markup.

If `astro-best-practices` is available, apply it alongside this skill for project-wide conventions and review criteria.

## Workflow

### 1. Pick the right file type

Choose the simplest primitive that fits the requirement:

- component: reusable UI in `src/components/`
- page: route entry in `src/pages/`
- layout: shared shell in `src/layouts/`
- framework island: React, Vue, or similar only when interactivity is required

Start with `.astro` unless there is a real need for client-side framework state.

### 2. Clarify the contract

Before scaffolding, determine:

- what props the file accepts
- whether it renders children or named slots
- whether it fetches data
- whether any interactivity is required
- which styling approach the project already uses

Keep the public surface small. If a prop does not change rendering in a meaningful way, it probably should not exist.

### 3. Scaffold with strong defaults

Use typed props and semantic structure:

```astro
---
interface Props {
  title: string
  variant?: 'primary' | 'secondary'
}

const { title, variant = 'primary' } = Astro.props
---

<section class:list={['card', variant]}>
  <h2>{title}</h2>
  <slot />
</section>

<style>
  .card {
    padding: 1rem;
  }
</style>
```

Good defaults:

- semantic elements over generic `div`s
- logical heading structure
- sensible prop defaults
- scoped styles unless the project uses another pattern intentionally
- `class:list` for conditional classes when it keeps markup clear

### 4. Add interactivity only when needed

If the component needs client-side behavior:

- keep the interactive part as small as possible
- isolate it in a framework component if that is the project pattern
- choose the lightest hydration directive that works

Example:

```astro
---
import SearchBox from './SearchBox.tsx'
---

<SearchBox client:visible />
```

Avoid turning large sections of a page into islands when a small interactive leaf component is enough.

### 5. Review accessibility and resilience

Before calling the component done, check:

- semantic HTML is appropriate
- interactive elements are keyboard reachable
- visible labels and accessible names exist
- images have correct `alt` behavior
- heading levels make sense in context
- focus states remain visible

### 6. Fit the component into the project

Align with the existing codebase:

- follow naming conventions
- preserve the established layout and styling approach
- keep imports relative and readable
- do not introduce a framework dependency just to mimic static HTML

## Use This Skill For

- converting static HTML into Astro components
- scaffolding new routes or layouts
- breaking large Astro files into smaller pieces
- turning a design into accessible Astro markup

---
name: astro-best-practices
description: Apply performant, accessible, and maintainable defaults when building or reviewing Astro projects.
---

# Astro Best Practices

Use this skill as the baseline when designing, implementing, or reviewing Astro work. It translates Astro-specific architectural guidance into portable instructions that can be applied across agents.

## Core Principles

- prefer static generation when request-time rendering is not necessary
- keep client-side JavaScript minimal
- use framework islands only for real interactivity
- preserve clear project structure and predictable routing
- optimize for accessibility and maintainability, not just output parity

## Architecture Defaults

### Prefer `.astro` first

- use `.astro` components for static and mostly static UI
- reach for React, Vue, or another framework only when local state or client-side behavior is genuinely needed
- keep interactive islands small and leaf-like

### Use hydration deliberately

- `client:visible` for deferred UI
- `client:idle` for lower-priority enhancement
- `client:load` for critical immediate interactivity only
- `client:only` only when skipping server rendering is intentional

Default away from hydrating broad layout regions.

### Keep the project shape predictable

Typical structure:

```text
src/
  components/
  layouts/
  pages/
  content/
  styles/
  assets/
public/
```

Do not invent novel folder structure without a clear project-specific reason.

## Content and Data

- use content collections for structured content
- define schemas instead of accepting loose frontmatter
- fetch server-side data in Astro frontmatter unless there is a clear reason not to
- keep data flow obvious and close to the component or page that owns it

## Accessibility

- use semantic landmarks such as `header`, `nav`, `main`, `article`, and `footer`
- ensure keyboard access for all interactive controls
- provide meaningful labels and accessible names
- maintain correct heading hierarchy
- use appropriate image alt text
- preserve visible focus states
- treat color contrast as a non-negotiable baseline

## Performance

- use `astro:assets` or the project’s chosen image pipeline intentionally
- prevent layout shift by providing image dimensions or stable containers
- avoid unnecessary client hydration
- keep CSS and JavaScript scoped to the features that need them
- prefer simple server-rendered markup over client complexity

## Styling

- default to scoped component styles unless the project has a defined styling system
- use CSS custom properties for reusable tokens
- favor maintainable layout patterns over one-off utility sprawl when the project is not already utility-first
- keep responsive behavior intentional and testable

## Review Checklist

Before finalizing Astro work, check:

- is any hydrated code unnecessary
- does the HTML stay semantic
- is the route/layout structure still clear
- are content schemas strong enough
- is the result accessible by keyboard and assistive tech
- does the implementation match the existing project conventions

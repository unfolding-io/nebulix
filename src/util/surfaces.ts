export type CmsSurface = {
  name: string;
  slug: string;
  light_bg: string;
  light_fg: string;
  dark_bg: string;
  dark_fg: string;
};

/** Normalize CMS / content values to a `surface-*` class. */
export function surfaceClass(value?: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  const first = trimmed.split(/\s+/)[0] ?? "";
  if (first.startsWith("surface-")) return first;

  // Leave Tailwind utilities / arbitrary values untouched
  if (
    trimmed.includes("[") ||
    trimmed.includes(":") ||
    /^(bg|text|from|to|via|border|ring|shadow)-/.test(first)
  ) {
    return trimmed;
  }

  // Single CMS slug token → surface-{slug}
  if (/^[a-z0-9-]+$/i.test(trimmed)) return `surface-${trimmed}`;

  return trimmed;
}

function normalizeSlug(slug: string): string {
  return slug.trim().replace(/^surface-/, "").toLowerCase();
}

/** Build CSS for CMS-defined surfaces (light/dark bg+fg). */
export function buildSurfaceStyles(surfaces: CmsSurface[] = []): string {
  if (!surfaces.length) return "";

  const rootVars: string[] = [];
  const darkVars: string[] = [];
  const rules: string[] = [];

  for (const surface of surfaces) {
    if (!surface?.slug) continue;
    const slug = normalizeSlug(surface.slug);
    if (!slug) continue;

    const cls = `surface-${slug}`;
    const bg = `--${cls}-bg`;
    const fg = `--${cls}-fg`;

    rootVars.push(`${bg}:${surface.light_bg};${fg}:${surface.light_fg};`);
    darkVars.push(`${bg}:${surface.dark_bg};${fg}:${surface.dark_fg};`);
    rules.push(
      `.${cls}{background-color:var(${bg});color:var(${fg});}`,
      `.${cls} a:not([class]){color:inherit;text-decoration-color:currentColor;}`,
    );
  }

  return [
    `:root{${rootVars.join("")}}`,
    `html[data-theme="dark"]{${darkVars.join("")}}`,
    rules.join(""),
  ].join("");
}

/** Container max-widths matching `--w-*` in global.css (1rem = 16px). */
export const CONTAINER_MAX_REM = {
  sm: 40,
  md: 55,
  lg: 65,
  xl: 75,
  full: null,
  none: null,
} as const;

export type ContainerKey = keyof typeof CONTAINER_MAX_REM;

const WIDTH_LADDER = [
  320, 480, 640, 750, 828, 960, 1080, 1200, 1280, 1440, 1536, 1920, 2048, 2560,
] as const;

function containerRem(container?: string): number | null {
  if (!container) return CONTAINER_MAX_REM.md;
  if (container in CONTAINER_MAX_REM) {
    return CONTAINER_MAX_REM[container as ContainerKey];
  }
  return CONTAINER_MAX_REM.md;
}

/** Generate srcset widths covering 1x–2x DPR up to `maxCssPx`. */
export function widthsForDisplay(maxCssPx: number): number[] {
  const maxSrc = Math.min(2560, Math.max(320, Math.ceil(maxCssPx * 2)));
  const widths: number[] = WIDTH_LADDER.filter((w) => w <= maxSrc);
  if (!widths.length || widths[widths.length - 1]! < maxSrc) {
    widths.push(maxSrc);
  }
  return widths;
}

export function widthsFixed(cssPx: number): number[] {
  return widthsForDisplay(cssPx);
}

export function widthsViewport(max = 1920): number[] {
  return widthsForDisplay(max);
}

export function widthsContainer(container = "md"): number[] {
  const rem = containerRem(container);
  if (!rem) return widthsViewport(1920);
  return widthsForDisplay(rem * 16);
}

/** Column image: fraction of container (e.g. 66 → ~2/3). */
export function widthsColumn(container = "md", imageSize: string | number = 50): number[] {
  const rem = containerRem(container);
  const fraction = columnFraction(imageSize);
  const maxCss = rem ? rem * 16 * fraction : 1920 * fraction;
  // Mobile stacks full container width — that can be larger than the column
  const mobile = Math.min(768, (rem ?? 55) * 16);
  return widthsForDisplay(Math.max(maxCss, mobile));
}

export function widthsGallery(container = "md"): number[] {
  const rem = containerRem(container);
  // Tightest common cell ≈ container / 2 on mobile; desktop can be /3–/5
  const maxCell = rem ? (rem * 16) / 2 : 960;
  return widthsForDisplay(maxCell);
}

export function widthsGridCard(container = "md"): number[] {
  const rem = containerRem(container);
  const maxCell = rem ? (rem * 16) / 2 : 960;
  return widthsForDisplay(maxCell);
}

function columnFraction(imageSize: string | number = 50): number {
  const n = parseInt(String(imageSize), 10);
  if (!Number.isFinite(n) || n <= 0) return 0.5;
  return Math.min(1, Math.max(0.15, n / 100));
}

/** Full-bleed / hero. */
export function sizesViewport(): string {
  return "100vw";
}

/**
 * TextImage column layout: full content width below md, then a fraction of the
 * container (minus gap-8 = 2rem).
 */
export function sizesTextImageColumn(
  container = "md",
  imageSize: string | number = 50,
): string {
  const fraction = columnFraction(imageSize);
  const rem = containerRem(container);
  const desktop = rem
    ? `calc((min(${rem}rem, 100vw - 4rem) - 2rem) * ${fraction})`
    : `calc((100vw - 4rem - 2rem) * ${fraction})`;
  return `(max-width: 767px) calc(100vw - 4rem), ${desktop}`;
}

/** TextImage row: near full-bleed of the container. */
export function sizesTextImageRow(container = "md"): string {
  const rem = containerRem(container);
  if (!rem || container === "none" || container === "full") return "100vw";
  return `min(${rem}rem + 4rem, 100vw)`;
}

/** Banner / parallax cover. */
export function sizesBanner(): string {
  return "100vw";
}

/**
 * Gallery grids: 2-col mobile, 3-col from sm, 4-col from lg (xl/full),
 * 5-col from 2xl (full).
 */
export function sizesGallery(container = "md"): string {
  const rem = containerRem(container);
  const c = rem ?? 75;
  const box = rem ? `min(${c}rem, 100vw - 4rem)` : `calc(100vw - 4rem)`;

  if (container === "full" || container === "none") {
    return [
      `(min-width: 1536px) calc((${box} - 2rem) / 5)`,
      `(min-width: 1024px) calc((${box} - 1.5rem) / 4)`,
      `(min-width: 640px) calc((${box} - 1rem) / 3)`,
      `calc((100vw - 4rem - 0.5rem) / 2)`,
    ].join(", ");
  }

  if (container === "xl") {
    return [
      `(min-width: 1024px) calc((${box} - 1.5rem) / 4)`,
      `(min-width: 640px) calc((${box} - 1rem) / 3)`,
      `calc((100vw - 4rem - 0.5rem) / 2)`,
    ].join(", ");
  }

  return [
    `(min-width: 640px) calc((${box} - 1rem) / 3)`,
    `calc((100vw - 4rem - 0.5rem) / 2)`,
  ].join(", ");
}

/**
 * Auto-grid cards (RecentItems / archive grid) matching `.auto-grid-*`.
 */
export function sizesGridCard(container = "md"): string {
  const rem = containerRem(container);
  const c = rem ?? 55;
  const box = rem ? `min(${c}rem, 100vw - 4rem)` : `calc(100vw - 4rem)`;

  if (container === "full" || container === "none") {
    return [
      `(min-width: 1536px) calc((${box} - 2rem) / 5)`,
      `(min-width: 1024px) calc((${box} - 1.5rem) / 4)`,
      `(min-width: 768px) calc((${box} - 1rem) / 3)`,
      `(min-width: 640px) calc((${box} - 0.5rem) / 2)`,
      `calc(100vw - 4rem)`,
    ].join(", ");
  }

  if (container === "xl") {
    return [
      `(min-width: 1024px) calc((${box} - 1.5rem) / 4)`,
      `(min-width: 768px) calc((${box} - 1rem) / 3)`,
      `(min-width: 640px) calc((${box} - 0.5rem) / 2)`,
      `calc(100vw - 4rem)`,
    ].join(", ");
  }

  if (container === "sm") {
    return [
      `(min-width: 640px) calc((${box} - 0.5rem) / 2)`,
      `calc(100vw - 4rem)`,
    ].join(", ");
  }

  // md / lg → 2 cols from sm, 3 from md
  return [
    `(min-width: 768px) calc((${box} - 1rem) / 3)`,
    `(min-width: 640px) calc((${box} - 0.5rem) / 2)`,
    `calc(100vw - 4rem)`,
  ].join(", ");
}

/** Fixed CSS pixel thumbnails (ItemCardSmall / Flex). */
export function sizesFixed(cssPx: number): string {
  return `${Math.round(cssPx)}px`;
}

/** Contact dialog side image. */
export function sizesContactDialog(): string {
  return "(max-width: 767px) calc(100vw - 2rem), min(40vw, 32rem)";
}

/**
 * Split layout hero: full width < md, ~50vw from md, 40vw from 2xl.
 * Matches `.page-split__grid`.
 */
export function sizesSplitHero(): string {
  return "(max-width: 767px) 100vw, (min-width: 96rem) 40vw, 50vw";
}

/** Menu list thumbs in multi-column layout. */
export function sizesMenuThumb(): string {
  return [
    "(min-width: 768px) calc((min(55rem, 100vw - 4rem) - 1rem) / 3)",
    "(min-width: 640px) calc((min(55rem, 100vw - 4rem) - 0.5rem) / 2)",
    "calc(100vw - 4rem)",
  ].join(", ");
}

/** MDX body images inside richtext containers. */
export function sizesMdx(): string {
  return "min(40rem, calc(100vw - 4rem))";
}

import "astro";

declare module "astro" {
  interface AstroClientDirectives {
    "client:interaction"?: boolean | number | { timeout?: number };
  }
}

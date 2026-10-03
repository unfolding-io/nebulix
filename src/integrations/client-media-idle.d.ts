import "astro";

declare module "astro" {
  interface AstroClientDirectives {
    "client:media-idle"?: string;
  }
}

import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";

/**
 * Registers `client:media-idle` — hydrate only when a media query matches,
 * preferring first interaction, with an 8s idle fallback.
 */
export default function clientMediaIdle(): AstroIntegration {
  return {
    name: "client:media-idle",
    hooks: {
      "astro:config:setup": ({ addClientDirective }) => {
        addClientDirective({
          name: "media-idle",
          entrypoint: fileURLToPath(new URL("./media-idle.js", import.meta.url)),
        });
      },
    },
  };
}

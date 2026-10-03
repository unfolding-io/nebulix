import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";

/**
 * Registers `client:interaction` — hydrate on first click, with a delayed
 * setTimeout fallback (default 8s) so cold-load Lighthouse can finish first.
 */
export default function clientInteraction(): AstroIntegration {
  return {
    name: "client:interaction",
    hooks: {
      "astro:config:setup": ({ addClientDirective }) => {
        addClientDirective({
          name: "interaction",
          entrypoint: fileURLToPath(
            new URL("./interaction.js", import.meta.url),
          ),
        });
      },
    },
  };
}

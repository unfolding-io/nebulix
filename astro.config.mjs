import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import fauxRemarkEmbedder from "@remark-embedder/core";
import fauxOembedTransformer from "@remark-embedder/transformer-oembed";
import remarkUnwrapImages from "remark-unwrap-images";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import clientMediaIdle from "./src/integrations/clientMediaIdle.ts";

// Default adapter: Netlify (powers Astro Actions for contact/newsletter).
// Swap for another host: `npx astro add cloudflare` or `npx astro add vercel`.
import netlify from "@astrojs/netlify";

const remarkEmbedder = fauxRemarkEmbedder.default ?? fauxRemarkEmbedder;
const oembedTransformer = fauxOembedTransformer.default ?? fauxOembedTransformer;

// https://astro.build/config
export default defineConfig({
  site: "https://nebulix.unfolding.io",

  fonts: [
    {
      name: "Inter Tight",
      cssVariable: "--font-inter-tight",
      provider: fontProviders.fontsource(),
      styles: ["normal", "italic"],
      weights: ["100 900"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],

  integrations: [
    icon(),
    mdx({}),
    sitemap(),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
    clientMediaIdle(),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [
        [
          remarkEmbedder,
          {
            transformers: [oembedTransformer],
          },
        ],
        remarkUnwrapImages,
      ],
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            rel: ["nofollow"],
            target: ["_blank"],
          },
        ],
      ],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: [
          "/_pagefind/pagefind.js",
          "/_pagefind/pagefind-ui.js",
          "/_pagefind/pagefind-ui.css",
        ],
      },
      assetsInlineLimit: 10096,
    },
  },

  build: {
    inlineStylesheets: "always",
  },

  scopedStyleStrategy: "attribute",

  prefetch: {
    defaultStrategy: "viewport",
  },

  adapter: netlify(),
});
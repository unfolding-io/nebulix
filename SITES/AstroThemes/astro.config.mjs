import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import m2dx from "astro-m2dx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import fauxRemarkEmbedder from "@remark-embedder/core";
import fauxOembedTransformer from "@remark-embedder/transformer-oembed";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";

const remarkEmbedder = fauxRemarkEmbedder.default ?? fauxRemarkEmbedder;
const oembedTransformer = fauxOembedTransformer.default ?? fauxOembedTransformer;

/** @type {import('astro-m2dx').Options} */
const m2dxOptions = {
  exportComponents: true,
  unwrapImages: true,
  autoImports: true,
};

// https://astro.build/config
export default defineConfig({
  site: "https://nebulix.unfolding.io",
  integrations: [
    icon(),
    mdx({}),
    sitemap(),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
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
        [m2dx, m2dxOptions],
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
});

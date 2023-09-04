import { defineConfig } from "astro-imagetools/config";

export default defineConfig({
  format: ["webp"],

  formatOptions: {
    jpg: {
      quality: 70,
      chromaSubsampling: "4:4:4",
      mozjpeg: true,
      trellisQuantisation: true,
      overshootDeringing: true,
      optimiseScans: true,
    },
    png: {
      quality: 70,
      adaptiveFiltering: true,
      compressionLevel: 9,
      palette: true,
    },
    webp: {
      quality: 50,
      effort: 6.0,
    },
    avif: {
      chromaSubsampling: "4:4:4",
      effort: 9.0,
    },
    gif: {
      effort: 10.0,
    },
  },
});

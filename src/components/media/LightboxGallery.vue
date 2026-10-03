<template>
  <div :class="className" ref="gallery" data-pswp-gallery>
    <slot />
  </div>
</template>

<script setup>
import { shallowRef, onMounted, onBeforeUnmount } from "vue";

let lightbox = null;
const gallery = shallowRef(null);

defineProps({
  className: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: false,
  },
});

async function ensureStyles() {
  if (document.getElementById("pswp-css")) return;
  const cssUrl = (await import("photoswipe/style.css?url")).default;
  await new Promise((resolve) => {
    const link = document.createElement("link");
    link.id = "pswp-css";
    link.rel = "stylesheet";
    link.href = cssUrl;
    link.onload = resolve;
    link.onerror = resolve;
    document.head.appendChild(link);
  });
}

onMounted(async () => {
  if (lightbox || !gallery.value) return;

  await ensureStyles();
  const { default: PhotoSwipeLightbox } = await import("photoswipe/lightbox");

  lightbox = new PhotoSwipeLightbox({
    gallery: gallery.value,
    children: "a[data-pswp-width]",
    pswpModule: () => import("photoswipe"),
  });
  lightbox.init();
});

onBeforeUnmount(() => {
  lightbox?.destroy?.();
  lightbox = null;
});
</script>

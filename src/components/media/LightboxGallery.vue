<template>
  <div :class="className" ref="gallery" data-pswp-gallery>
    <slot />
  </div>
</template>

<script setup>
import { shallowRef, onMounted, onBeforeUnmount } from "vue";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

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

onMounted(() => {
  if (!lightbox && gallery.value) {
    lightbox = new PhotoSwipeLightbox({
      gallery: gallery.value,
      children: "a[data-pswp-width]",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  }
});

onBeforeUnmount(() => {
  lightbox?.destroy?.();
  lightbox = null;
});
</script>

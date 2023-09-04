<template>
  <div
    ref="container"
    class="z-20 grid h-full max-h-screen w-full place-items-center justify-center overflow-hidden"
  >
    <div @wheel="panzoom.zoomWithWheel">
      <img
        ref="zoom"
        :src="image"
        :alt="alt"
        class="block max-h-screen w-auto"
      />
    </div>
  </div>
</template>
<script setup>
import Panzoom from "@panzoom/panzoom";
import { ref, onMounted } from "vue";
const zoom = ref(null);
const container = ref(null);
const panzoom = ref(null);
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
});
onMounted(() => {
  panzoom.value = Panzoom(zoom.value, {
    maxScale: 5,
    minScale: 0.9,
    overflow: "visible",
  });
});
</script>

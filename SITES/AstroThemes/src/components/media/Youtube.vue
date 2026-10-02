<template>
  <div class="yt bg-black">
    <iframe
      class="h-full w-full"
      v-if="loaded"
      width="1920"
      height="1080"
      :src="`https://www.youtube.com/embed/${videoId}`"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope;"
      allowfullscreen
    >
    </iframe>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  videoId: String,
});

const loaded = ref(false);
onMounted(() => {
  loaded.value = true;
});
</script>

<style lang="postcss">
.yt {
  aspect-ratio: 16 / 9;
}
</style>

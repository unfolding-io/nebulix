<template>
  <div
    v-intersection-observer="[onIntersectionObserver, { rootMargin }]"
    :class="`${className || ''} ${isVisible ? 'in-screen' : 'out-of-screen'} ${
      firstVisible ? 'is-active' : 'is-inactive'
    }`"
  >
    <slot v-if="show" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import { vIntersectionObserver } from "@vueuse/components";
const isVisible = ref(false);
const rootMargin = "10%";
const firstVisible = ref(false);

function onIntersectionObserver([{ isIntersecting }]) {
  isVisible.value = isIntersecting;
  if (isIntersecting) firstVisible.value = true;
}

const props = defineProps({
  className: String,
  noSsr: Boolean,
});
const show = computed(() => {
  if (!!props?.noSsr && !firstVisible.value) return false;
  return true;
});
</script>

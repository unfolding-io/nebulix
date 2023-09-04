<template>
  <button
    class="fade-in absolute right-0 top-0 z-50 m-4 h-10 w-10"
    :aria-label="translations.close"
    @click="closeWindow"
  >
    <slot name="close" />
  </button>
  <div
    class="fade-in pointer-events-none absolute bottom-1/2 right-0 z-50 flex w-full justify-between p-2"
  >
    <a
      :href="prev"
      :aria-label="translations.prev"
      v-if="prev"
      class="pointer-events-auto m-4"
    >
      <slot name="prev" />
    </a>
    <a
      :href="next"
      :aria-label="translations.next"
      v-if="next"
      class="pointer-events-auto m-4 ml-auto"
    >
      <slot name="next"
    /></a>
  </div>
  <slot />
</template>

<script setup>
import { ref, onMounted } from "vue";
const showButtons = ref(false);
const gallery = ref(null);
const historyLength = ref(1);
const next = ref(null);
const prev = ref(null);

const closeWindow = () => {
  if (window.history.length < 1) window.location.url = "/";
  history.go(historyLength.value * -1);
};
onMounted(() => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const index = parseInt(urlParams.get("index"));
  gallery.value = urlParams.get("gallery")
    ? urlParams.get("gallery").split(",")
    : [];
  historyLength.value = urlParams.get("history")
    ? parseInt(urlParams.get("history"))
    : 1;

  if (index + 1 < gallery.value.length) {
    next.value = `${gallery.value[index + 1]}?index=${index + 1}&history=${
      historyLength.value + 1
    }&gallery=${urlParams.get("gallery")}`;
  }
  if (index > 0) {
    prev.value = `${gallery.value[index - 1]}?index=${index - 1}&history=${
      historyLength.value + 1
    }&gallery=${urlParams.get("gallery")}`;
  }
  setTimeout(() => {
    showButtons.value = true;
  }, 500);
});
const props = defineProps({
  gallery: {
    type: Array,
    required: false,
  },
  translations: {
    type: Object,
    required: false,
  },
});
</script>

<style>
.fade-in2 {
  animation: fadeIn 0.5s;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

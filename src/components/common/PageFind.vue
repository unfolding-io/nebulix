<template>
  <transition name="slide-fade">
    <div
      v-show="show"
      class="search-modal surface-dark search-scroll text-left"
    >
      <div class="container-md py-md">
        <div id="search" ref="search"></div>
      </div>
      <div class="absolute right-0 top-0 inline-block">
        <button class="btn-icon btn-close m-4" @click="show = !show">
          <slot name="btn-close" :aria-label="translations.close" />
        </button>
      </div>
    </div>
  </transition>

  <button
    @click="openSearchUi()"
    class="grid h-full place-items-center"
    :aria-label="translations.search"
  >
    <slot name="btn-search" />
  </button>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  translations: Object,
});

const show = ref(false);
const search = ref(null);
const results = ref([]);

const loaded = ref(false);

const openSearchUi = async () => {
  if (!loaded.value) {
    loadCSS();
    LoadJS();
    show.value = true;
    loaded.value = true;
  } else {
    show.value = true;
  }
};

function scriptLoaded() {
  setTimeout(() => {
    new PagefindUI({
      element: "#search",
      resetStyles: false,
      showEmptyFilters: false,
      translations: {
        placeholder: props.translations.search,
        clear_search: props.translations.clear,
      },
    });
  }, 100);

  setTimeout(() => {
    const input = search.value.querySelector(".pagefind-ui__search-input");
    input.focus();
  }, 300);
}

function LoadJS() {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/_pagefind/pagefind-ui.js";
  document.head.appendChild(script);
  script.addEventListener("load", scriptLoaded);
}

function loadCSS() {
  const head = document.getElementsByTagName("head")[0];
  let style = document.createElement("link");
  style.href = "/_pagefind/pagefind-ui.css";
  style.type = "text/css";
  style.rel = "stylesheet";
  head.append(style);
}
</script>

<style lang="postcss">
.search-modal {
  @apply fixed inset-0;
  z-index: 99999999;

  .pagefind-ui__search-clear {
    @apply mr-8;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.search-scroll {
  @apply h-full overflow-x-hidden overflow-y-scroll py-4;

  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: var(--scroll-behavior);

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

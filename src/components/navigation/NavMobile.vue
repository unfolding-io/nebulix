<template>
  <button
    :aria-label="show ? translations.close : translations.menu"
    @click="toggleMenu()"
    :class="` nav-mobile-btn relative  ml-auto flex  text-primary md:hidden ${
      show ? 'bg-transparent ' : ''
    }`"
  >
    <slot name="menu" class="w-7 text-dark" v-if="!show" />

    <slot name="close" class="w-7" v-if="show" />
  </button>
  <transition name="nested">
    <div
      class="surface-menu nav-mobile fixed inset-0 grid h-full auto-rows-min place-items-center gap-4 px-4 pt-4"
      v-show="show"
    >
      <div class="mx-auto max-w-[12rem] pt-10">
        <slot name="logo" />
      </div>
      <slot name="links" />
      <slot name="social" />
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useScrollLock } from "@vueuse/core";
const show = ref(false);
const body = ref(null);
const props = defineProps({
  translations: Object,
});
const toggleMenu = () => {
  show.value = !show.value;
  isLocked.value = show.value;
};
let isLocked;

onMounted(() => {
  body.value = document.getElementsByTagName("body")[0];

  isLocked = useScrollLock(body.value);
});
</script>

<style lang="postcss">
.nav-mobile {
  @apply overflow-x-hidden overflow-y-scroll;
  z-index: 999998;
  scrollbar-width: none;
  padding-bottom: calc(2em + env(safe-area-inset-bottom));
  &-btn {
    z-index: 999999;
  }
}

.nested-enter-active,
.nested-leave-active {
  transition: all 0.7s ease-in-out;
}

.nested-leave-active {
  transition-delay: 0.25s;
}
.inner {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateX(100%);
  transform-origin: right center;
  opacity: 1;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-active .inner {
  transition-delay: var(--animation-delay, 0.25s);
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(200px);
  opacity: 0.001;
}
</style>

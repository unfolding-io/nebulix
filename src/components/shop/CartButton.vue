<template>
  <transition name="fade">
    <button
      :aria-label="label"
      class="cart-btn grid h-full place-items-center"
      @click="openCart()"
      ref="btn"
      :data-count="count"
      v-if="count > 0"
    >
      <slot />
    </button>
  </transition>

  <div class="hidden">
    {{ shoppingState }}
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  label: String,
});

const btn = ref(null);
const count = ref(0);
const shoppingState = ref(null);
const setValue = () => {
  if (!btn.value) return;
  btn.value.setAttribute(props.option, message.value);
};

const openCart = () => {
  if (window.Snipcart) {
    window.Snipcart.api.theme.cart.open();
  }
};

onMounted(() => {
  document.addEventListener("snipcart.ready", () => {
    Snipcart.store.subscribe(() => {
      count.value = Snipcart.store.getState().cart.items.count;
      shoppingState.value = Snipcart.store.getState();
    });
  });
});
</script>

<style lang="postcss">
.cart-btn {
  @apply relative;
  &:after {
    content: attr(data-count);
    font-size: 0.58rem;
    @apply absolute -right-2 top-0 grid h-4 w-4 place-items-center rounded-full border-2 border-current bg-opacity-70 font-bold md:top-1;
  }
}
</style>

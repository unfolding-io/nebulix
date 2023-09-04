<template>
  <div
    class="product-image col-start-1 row-start-1 h-full w-full"
    :class="className"
    v-show="active"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { useStore } from "@nanostores/vue";
import { productVariations } from "@src/store";
const props = defineProps({
  id: String,
});

const className = ref("z-50");
const $productVariations = useStore(productVariations);
const active = computed(() => {
  return $productVariations.value.some((product) => product.id === props.id);
});

watch($productVariations, (value, oldValue) => {
  if (oldValue && oldValue.some((product) => product.id === props.id)) {
    className.value = "-z-10";
  } else {
    className.value = "z-50";
  }
});
</script>

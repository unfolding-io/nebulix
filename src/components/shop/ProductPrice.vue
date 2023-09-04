<template>
  <div class="grid gap-0 text-right leading-none">
    <span :class="offer > 0 ? 'muted text-xs text-danger line-through' : ''">
      {{ Price }}
    </span>
    <span v-if="offer > 0">{{ OfferPrice }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "@nanostores/vue";

import { productExtraPrice, productVariations } from "@src/store";
import { formatPrice } from "@util/toLocale";

const $productExtraPrice = useStore(productExtraPrice);

const props = defineProps({
  price: Number,
  offer: {
    type: Number,
    required: false,
    default: 0,
  },
});

const Price = computed(() => {
  return formatPrice($productExtraPrice.value + props.price);
});

const OfferPrice = computed(() => {
  return formatPrice($productExtraPrice.value + props.offer);
});

onMounted(() => {
  /* CLEAR STATE */
  productExtraPrice.set(0);
  productVariations.set([]);
});
</script>

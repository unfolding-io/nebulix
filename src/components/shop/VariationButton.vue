<template>
  <button
    :class="`${className} ${
      active ? 'bg-primary bg-opacity-10 hover:text-light' : 'border-0'
    }`"
    @click="setValue"
  >
    <slot />
  </button>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "@nanostores/vue";
import { productExtraPrice, productVariations } from "@src/store";

const btn = ref(null);
const $productVariations = useStore(productVariations);

const active = computed(() => {
  return $productVariations.value.some((product) => product.id === props.id);
});

const props = defineProps({
  option: String,
  value: String,
  className: String,
  price: Number,
  hasImage: Boolean,
  id: String,
  group: String,
});

function addOrRemoveProduct(object) {
  let arr = JSON.parse(JSON.stringify($productVariations.value));
  const existingGroupIndex = arr.findIndex((obj) => obj.group === props.group);
  const existingIndex = arr.findIndex((obj) => obj.id === props.id);

  if (existingGroupIndex !== -1 && existingIndex === -1) {
    arr[existingGroupIndex] = object;
    btn.value.setAttribute(props.option, object.value);
    productVariations.set(arr);
    return;
  }

  if (existingIndex !== -1) {
    arr.splice(existingIndex, 1);
    btn.value.removeAttribute(props.option);
    productVariations.set(arr);
    return;
  }

  arr.push(object);
  btn.value.setAttribute(props.option, object.value);
  productVariations.set(arr);
  return;
}

const setValue = () => {
  if (!btn.value) return;

  addOrRemoveProduct({
    hasImage: props.hasImage,
    value: props.value,
    price: props.price,
    group: props.group,
    id: props.id,
    hasImage: false,
  });
};

watch($productVariations, (value) => {
  const total = value.reduce((accumulator, currentObject) => {
    return accumulator + currentObject.price;
  }, 0);

  productExtraPrice.set(total);
});

onMounted(() => {
  btn.value = document.querySelector("#add-to-card");
});
</script>

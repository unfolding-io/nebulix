<template>
  <input
    type="text"
    placeholder="..."
    class="p-2"
    v-model="message"
    @input="setValue()"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  option: String,
});

const btn = ref(null);
const message = ref(null);
const setValue = () => {
  if (!btn.value) return;
  btn.value.setAttribute(props.option, message.value);
};

onMounted(() => {
  btn.value = document.querySelector("#add-to-card");
});
</script>

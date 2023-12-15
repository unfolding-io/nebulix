<script setup>
import {register} from 'swiper/element/bundle';
register();

// Props
const props = defineProps({
  slides: {
    type: Object,
    default: () => ({})
  },
});

</script>
<style>
.swiper-slide {
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 10px;
  height: 200px;
  width: 200px;
  color: red;
}
</style>

<template>
  <swiper-container
      :slides-per-view="1"
      :scrollbar="false"
      :navigation="false"
      :centered-slides="true"
      :pagination="true"
      :breakpoints="{
        768: {
          slidesPerView: 1,
          navigation: true,
        },
      }"
  >
    <swiper-slide v-for="slide in props.slides" :key="slide.id" v-html="slide.content"/>
  </swiper-container>
</template>

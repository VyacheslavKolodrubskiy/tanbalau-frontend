<template>
  <img alt="" :src="imgUrl">
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    src: { type: String, required: true },
  },
  setup(props) {
    const imgUrl = computed(() => new URL(`/src/assets/images/${props.src}`, import.meta.url));

    return { imgUrl };
  },
};
</script>

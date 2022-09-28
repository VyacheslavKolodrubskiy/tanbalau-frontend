<template>
  <div :class="classes">
    <iframe
      allowfullscreen
      :src="src"
      :title="title"
    />
  </div>
</template>

<script>
export default {
  name: 'QVideo',
  props: {
    title: {
      type: String,
      default: '',
    },
    ratio: {
      type: String,
      default: '16x9',
    },
    src: {
      type: String,
      required: true,
    },
  },
  computed: {
    classes() {
      return `ratio ratio-${this.ratio}`;
    },
  },
};
</script>

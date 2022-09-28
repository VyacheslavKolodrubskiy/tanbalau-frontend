<template>
  <Component :is="iconName" />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'outlined',
    },
  },
  data() {
    return {};
  },
  computed: {
    iconName() {
      return `${this.type}-${this.theme}`;
    },
  },
};
</script>

<template>
  <span class="status-tag" :class="statusVariant">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'StatusTag',
  props: {
    variant: {
      type: String,
      default: '',
    },
  },
  computed: {
    statusVariant() {
      return this.variant && `status-tag--${this.variant}`;
    },
  },
};
</script>

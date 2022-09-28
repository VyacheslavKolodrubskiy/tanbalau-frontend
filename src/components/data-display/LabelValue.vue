<template>
  <div>
    <div v-if="label" class="show-label show-label--bold mb-1">
      {{ label }}
    </div>
    <div v-if="$slots.default" class="fz-16 text-gray-600">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabelValue',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
};
</script>

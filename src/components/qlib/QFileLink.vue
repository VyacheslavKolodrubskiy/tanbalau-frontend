<template>
  <div>
    <QIcon class="mr-2 fz-16 text-gray-600" type="paper-clip" />
    <a :download="download" :href="url">
      <slot />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    download: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

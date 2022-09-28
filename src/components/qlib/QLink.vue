<template>
  <Component
    :is="$attrs.href ? 'a' : 'RouterLink'"
    v-bind="$attrs"
    class="ant-btn"
    :class="[btnClass,btnSize]"
  >
    <slot />
  </Component>
</template>

<script>
const antBtnTypes = ['primary', 'ghost', 'dashed', 'danger', 'link'];
const antBtnSize = { small: 'sm', default: '', large: 'lg' };
export default {
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'primary',
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnClass() {
      return antBtnTypes.includes(this.type) ? `ant-btn-${this.type}` : `btn--${this.type}`;
    },
    btnSize() {
      return antBtnSize[this.size] ? `ant-btn-${antBtnSize[this.size]}` : null;
    },
  },
};
</script>

<template>
  <AButton
    v-bind="$attrs"
    :class="btnClass"
    :type="getType"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{...slotData}" />
    </template>
  </AButton>
</template>

<script>
const antBtnTypes = ['primary', 'dashed', 'text', 'link'];
export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    getType() {
      return this.customType ? null : this.type;
    },
    customType() {
      return !antBtnTypes.includes(this.type);
    },
    btnClass() {
      return this.type && this.customType ? `btn--${this.type}` : null;
    },
  },
};
</script>

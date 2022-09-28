<template>
  {{ test }}
  <AInput
    v-model:value="test"
    v-imask="{ mask: '+{7} (000) 000 00 00' }"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{...slotData}" />
    </template>
  </AInput>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {

    mask: {
      type: [String, Object, Array],
      default: null,
      // validator: maskPresetValidator,
    },
  },
  emits: ['update:value', 'blur', 'mask-complete'],
  data() {
    return {
      test: '',
      maskState: {
        originalValue: null,
        value: null,
      },
    };
  },
  computed: {
    inputAttrs() {
      const { ...otherAttrs } = this.$attrs;

      console.log(this.$attrs);
      if (this.mask) {
        otherAttrs.onAccept = this.onAccept;
        otherAttrs.onComplete = this.onComplete;
        otherAttrs.onInput = this.onInput;
      } else {
        otherAttrs.onInput = this.onInput;
      }
      otherAttrs.onBlur = this.onBlur;

      return otherAttrs;
    },
  },
  methods: {
    onBlur(ev) {
      this.$emit('blur');
    },
    onInput(e) {
      this.$emit('update:value', e.target.value);
    },

    getMaskValue(maskRef) {
      return this.mask.unmask ? maskRef.unmaskedValue : maskRef.value;
    },

    onAccept(ev) {
      console.log(ev.detail);
      this.maskState.originalValue = ev.detail.value;
      this.maskState.value = this.getMaskValue(ev.detail);
      // handleChange(maskState.value, isInvalid.value);
      this.$emit('update:value', this.maskState.value);
    },
    onComplete(ev) {
      this.maskState.originalValue = ev.detail.value;
      this.maskState.value = this.getMaskValue(ev.detail);
      this.$emit('mask-complete', this.maskState.value);
    },

  },
};
</script>

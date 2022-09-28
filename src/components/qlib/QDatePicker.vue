<template>
  <ADatePicker
    v-bind="$attrs"
    :format="format"
    :value="dateValue"
    @update:value="updateValue"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{...slotData}" />
    </template>
  </ADatePicker>
</template>

<script>
import dayjs from 'dayjs';

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
    format: {
      type: String,
      default: 'DD.MM.YYYY',
    },
  },
  emits: ['update:value'],
  computed: {
    dateValue() {
      return this.value ? dayjs(this.value) : null;
    },
  },
  methods: {
    updateValue(date) {
      let val;

      if (!date)
        val = null;
      else
        val = dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ');

      this.$emit('update:value', val);
    },
  },
};
</script>

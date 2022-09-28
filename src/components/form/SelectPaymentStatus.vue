<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="false"
    :options="options"
  />
</template>

<script>
import { extendForSelect } from '@/utils/utils';
import { fastClone } from '@/utils/object';
import { PAYMENT_STATUSES } from '@/config/types';

export default {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: 'title',
    },
  },
  data() {
    return {
      options: [],
    };
  },
  created() {
    const newPaymentType = [];
    for (const payment in PAYMENT_STATUSES) {
      const tempItem = fastClone(PAYMENT_STATUSES[payment]);
      newPaymentType.push(tempItem);
    }
    this.options = newPaymentType.map(item => extendForSelect(item, this.title, 'id'));
  },
};
</script>

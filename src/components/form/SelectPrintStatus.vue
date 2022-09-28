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
import { PRINT_STATUSES } from '@/config/types';

export default {
  inheritAttrs: false,
  data() {
    return {
      options: [],
    };
  },
  created() {
    this.statuses();
  },
  methods: {
    statuses() {
      const statuses = Object.values(PRINT_STATUSES);
      this.options = statuses.map(item => extendForSelect(item, 'title'));
    },
  },
};
</script>

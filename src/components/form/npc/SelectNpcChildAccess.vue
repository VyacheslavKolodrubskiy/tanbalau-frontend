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

export default {
  inheritAttrs: false,
  data() {
    return {
      options: [{ id: 0, title: 'Нет' }, { id: 1, title: 'Да' }],
    };
  },
  created() {
    this.options = this.options.map(item => extendForSelect(item, 'title', 'id'));
  },
};
</script>

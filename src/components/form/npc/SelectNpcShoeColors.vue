<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="filterOption"
    :not-found-content="null"
    :options="options"
    show-search
  />
</template>

<script>
import { getAxios } from '@/services/http/request';
import { extendForSelect } from '@/utils/utils';

export default {
  inheritAttrs: false,
  data() {
    return {
      options: [],
    };
  },
  created() {
    this.getOptions();
  },
  methods: {
    filterOption(input, option) {
      return option.title.toLowerCase().includes(input.toLowerCase());
    },
    getOptions() {
      getAxios('nkt/lib/shoe-colors').then((res) => {
        this.options = res.data.map(item => extendForSelect(item, 'title'));
      });
    },
  },
};
</script>

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
  props: {
    filters: {
      type: Object,
      default: () => {},
    },
    optionValue: {
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
    this.getOptions();
  },
  methods: {
    filterOption(input, option) {
      return option[this.optionValue].toLowerCase().includes(input.toLowerCase());
    },
    getOptions(params = {}) {
      getAxios('/lib/countries', { sort: 'title', sort_by: 'asc', ...params, ...this.filters }).then((res) => {
        this.options = res.data.map(item => extendForSelect(item, this.optionValue));
      });
    },
  },
};
</script>

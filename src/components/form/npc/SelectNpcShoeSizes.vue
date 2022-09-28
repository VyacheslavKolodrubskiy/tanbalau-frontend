<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="filterOption"
    :not-found-content="null"
    :options="options"
    show-search
    @search="handleSearch"
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
  emits: ['search'],
  data() {
    return {
      options: [],
    };
  },
  created() {
    this.getOptions();
  },
  methods: {
    handleSearch(val) {
      this.$emit('search', val);
      if (!val)
        return;
      this.getOptions({ id: val });
    },
    filterOption(input, option) {
      return option[this.optionValue].toLowerCase().includes(input.toLowerCase());
    },
    getOptions(params = {}) {
      getAxios('nkt/lib/shoe-sizes', { ...params, ...this.filters }).then((res) => {
        this.options = res.data.map(item => extendForSelect(item, this.optionValue));
      });
    },
  },
};
</script>

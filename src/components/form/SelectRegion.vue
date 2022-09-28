<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="false"
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
      this.getOptions({ name: val });
    },
    getOptions(params = {}) {
      getAxios('/regions', { sort: 'name', sort_by: 'asc', ...params, ...this.filters }).then((res) => {
        this.options = res.data.map(item => extendForSelect(item, 'name'));
      });
    },
  },
};
</script>

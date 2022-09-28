<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="false"
    :options="options"
  />
</template>

<script>
import { getAxios } from '@/services/http/request';
import { extendForSelect } from '@/utils/utils';

export default {
  inheritAttrs: false,
  props: {
    kpved: {
      type: [String, Number],
      default: '',
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
    getOptions() {
      getAxios(`nkt/lib/tnved/${this.kpved}`).then((res) => {
        this.options = res.data.map((item) => {
          item.title = `${item.code} - ${item.title}`;
          return extendForSelect(item, 'title');
        });
      });
    },
  },
};
</script>

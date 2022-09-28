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
      getAxios('nkt/lib/shoe-materials-down').then((res) => {
        this.options = res.data.map(item => extendForSelect(item, 'title'));
      });
    },
  },
};
</script>

<template>
  <ATable
    v-bind="$attrs"
    :pagination="getPagination"
    row-key="id"
    :scroll="{ x: $isMobile ? 1024 : true}"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{...slotData}" />
    </template>
    <template v-if="pagination" #footer>
      <span>Показано {{ getDataLength }} из <strong>{{ pagination.total }}</strong></span>
    </template>
  </ATable>
</template>

<!--<script>-->
<!--export default { inheritAttrs: false };-->
<!--</script>-->
<script>
// import { TableAction } from '@/types';
//
// interface Props {
//   pagination
//   actions: TableAction[];
// }
// const props = withDefaults(defineProps<Props>(), {
//   pagination: null,
//   actions: () => [],
// });
export default {
  inheritAttrs: false,
  props: {
    pagination: {
      type: Object,
      default: null,
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    getDataLength() {
      return this.$attrs['data-source']?.length || 0;
    },
    getPagination() {
      // todo убрать snake_case после того как переписаны все компоненты под usePagination()
      if (!this.pagination || this.pagination.last_page === 1 || this.pagination.lastPage === 1)
        return false;

      return {
        pageSize: this.pagination.per_page || this.pagination.perPage || 20,
        total: this.pagination.total || 1,
        current: this.pagination.current_page || this.pagination.page || 1,
        showSizeChanger: false,
      };
    },
  },
};
</script>

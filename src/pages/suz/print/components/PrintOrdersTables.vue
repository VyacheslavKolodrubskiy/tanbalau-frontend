<template>
  <ATable
    :columns="columns"
    :data-source="printOrders"
    :pagination="false"
    row-key="order_item_id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'toPrint'">
        <AInputNumber
          v-model:value="record.toPrint"
          :max="record.totalCodes"
          :min="0"
        />
      </template>
    </template>
  </ATable>
</template>

<script>
export default {
  props: {
    printOrders: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          dataIndex: 'order_item_id',
        },
        {
          title: 'GTIN',
          dataIndex: 'gtin',
        },
        {
          title: 'Общее кол-во КМ',
          dataIndex: 'totalCodes',
        },
        {
          title: 'Использовано',
          dataIndex: 'usedCodes',
        },
        {
          title: 'Осталось',
          dataIndex: 'leftCodes',
        },
        {
          title: 'На печать из остатков',
          dataIndex: 'toPrint',
        },
      ],
    };
  },
};
</script>

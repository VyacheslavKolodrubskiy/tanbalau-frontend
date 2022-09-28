<template>
  <div>
    <APageHeader title="Справочник “ГРЗ/Область”">
      <template #extra>
        <AddLink v-if="$canUse(['admin'])" :to="{ name: 'CatalogRegionAdd' }" />
      </template>
    </APageHeader>

    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="regions"
      :pagination="pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableActions :actions="actions" :record="record" />
        </template>
      </template>
    </QTable>
  </div>
</template>

<script>
import { getAxios } from '@/services/http/request';

export default {
  name: 'CatalogRegion',
  data() {
    return {
      filterData: {
        page: 1,
      },
      regions: [],
      pagination: {},
      actions: [
        {
          to: record => ({
            name: 'CatalogRegionEdit',
            params: { id: record.id },
          }),
          title: 'Редактировать',
        },
      ],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Наименование',
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          dataIndex: 'action',
          fixed: 'right',
          width: 60,
        },
      ],
    };
  },
  created() {
    this.fetchRegions();
  },
  methods: {
    changeTable(pagination) {
      this.filterData.page = pagination.current;
      this.fetchRegions(this.filterData);
    },
    fetchRegions(params = {}) {
      return getAxios('/regions', { ...params }).then((res) => {
        this.regions = res.data;
        this.pagination = res.meta;
      });
    },
  },
};
</script>

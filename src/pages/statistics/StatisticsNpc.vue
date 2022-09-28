<template>
  <div>
    <APageHeader title="Статистика по НКТ" />
    <QTable
      :columns="columns"
      :data-source="npc"
      :pagination="pagination"
      @change="changeTable"
    />
  </div>
</template>

<script>
import { getAxios } from '@/services/http/request';

export default {
  name: 'StatisticsNpc',
  data() {
    return {
      filters: {
        page: 1,
      },
      pagination: null,
      npc: [],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '№',
          width: 70,
          children: [{
            dataIndex: 'id',
          }],
        },
        {
          title: 'Организация',
          children: [{
            dataIndex: 'title',
          }],
        },
        {
          title: 'Код упаковки (GTIN)',
          dataIndex: 'status',
          className: 'text-left',
          children: [
            {
              title: 'Общее',
              dataIndex: 'total',
            },
            {
              title: 'На модерации',
              dataIndex: 'moderation',
              className: 'text-warning',
            },
            {
              title: 'Требует изменений',
              dataIndex: 'errors',
              className: 'text-danger',
            },
            {
              title: 'Ожидает подписания',
              dataIndex: 'notsigned',
              className: 'text-primary',
            },
            {
              title: 'Опубликовано',
              dataIndex: 'published',
              className: 'text-purple',
            },
            {
              title: 'Черновик',
              dataIndex: 'draft',
              className: 'text-gray-600',
            },
          ],
        },
      ];
    },
  },
  created() {
    this.fetchNpc();
  },
  methods: {
    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.fetchNpc(this.filters);
    },
    fetchNpc(params = {}) {
      return getAxios('/statistics/nkt', { ...params }).then((res) => {
        this.pagination = res.meta;
        this.npc = res.data;
      });
    },
  },
};
</script>

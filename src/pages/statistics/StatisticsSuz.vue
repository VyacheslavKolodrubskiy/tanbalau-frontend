<template>
  <div>
    <APageHeader title="Статистика по СУЗ / Печать" />
    <QTable
      :columns="columns"
      :data-source="suz"
      :pagination="pagination"
      @change="changeTable"
    />
  </div>
</template>

<script>
import { getAxios } from '@/services/http/request';

export default {
  name: 'StatisticsSuz',
  data() {
    return {
      filters: {
        page: 1,
      },
      pagination: {},
      suz: [],
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
          title: 'КМ в СУЗ',
          className: 'text-left',
          children: [
            {
              title: 'Общее',
              dataIndex: ['status', 'total'],
            },
            {
              title: 'Создан',
              dataIndex: ['status', 'created'],
              className: 'text-gray-500',
            },
            {
              title: 'Отклонен',
              dataIndex: ['status', 'declined'],
              className: 'text-danger',
            },
            {
              title: 'Ожидает',
              dataIndex: ['status', 'pending'],
              className: 'text-warning',
            },
            {
              title: 'Одобрен',
              dataIndex: ['status', 'approved'],
              className: 'text-purple',
            },
            {
              title: 'Доступен',
              dataIndex: ['status', 'ready'],
              className: 'text-success',
            },
            {
              title: 'Закрыт',
              dataIndex: ['status', 'closed'],
              className: 'text-gray-600',
            },
          ],
        },
        {
          title: 'Печать КМ',
          className: 'text-left',
          children: [
            {
              title: 'Распечатано',
              dataIndex: ['print', 'printed'],
              className: 'text-success',
            },
            {
              title: 'Осталось',
              dataIndex: ['print', 'left'],
              className: 'text-warning',
            },
            {
              title: 'Повторно распечатано',
              dataIndex: ['print', 'reprinted'],
              className: 'text-primary',
            },
          ],
        },
      ];
    },

  },
  created() {
    this.fetchSuz();
  },
  methods: {
    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.fetchSuz(this.filters);
    },
    fetchSuz(params = {}) {
      return getAxios(
        '/statistics/suz',
        { ...params },
      ).then((res) => {
        this.suz = res.data;
        this.pagination = res.meta;
      });
    },
  },
};
</script>

<template>
  <div>
    <APageHeader title="Статистика по Заявкам" />
    <QTable
      :columns="columns"
      :data-source="applications"
      :pagination="pagination"
      @change="changeTable"
    />
  </div>
</template>

<script>
import { getAxios } from '@/services/http/request';

export default {
  name: 'StatisticsApplication',
  data() {
    return {
      filters: {
        page: 1,
      },
      pagination: null,
      applications: [],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '№',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Организация',
          dataIndex: 'title',
        },
        {
          title: 'Общее',
          dataIndex: 'total',
        },
        {
          title: 'Новый',
          dataIndex: 'new',
          className: 'text-success',
        },
        {
          title: 'Отвечен',
          dataIndex: 'responded',
          className: 'text-warning',
        },
        {
          title: 'Не отвечен',
          dataIndex: 'not_responded',
          className: 'text-danger',
        },
        {
          title: 'Закрыт',
          dataIndex: 'closed',
          className: 'text-gray-500',
        },

      ];
    },
  },
  created() {
    this.fetchApplication();
  },
  methods: {
    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.fetchApplication(this.filters);
    },
    fetchApplication(params = {}) {
      return getAxios('/statistics/applications', { ...params }).then((res) => {
        this.pagination = res.meta;
        this.applications = res.data;
      });
    },
  },
};
</script>

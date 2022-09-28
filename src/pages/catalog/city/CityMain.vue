<template>
  <div>
    <APageHeader title="Справочник  &quot;Город&quot;">
      <template #extra>
        <AddLink v-if="$canUse(['admin'])" :to="{ name: 'CatalogCityAdd' }" />
      </template>
    </APageHeader>
    <AForm class="page-filter" layout="vertical">
      <ARow
        :gutter="24"
      >
        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Поиск по ГРЗ/Область">
            <SelectRegion
              v-model:value="filters.region_id"
              placeholder="ГРЗ/Область"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Поиск по городу">
            <AInput
              v-model:value="filters.name"
              placeholder="Город"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          class="page-filter__reset"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <ResetButton @click="resetFilter" />
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="cities"
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
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';

export default {
  name: 'CatalogCity',
  data() {
    return {
      filters: {
        name: '',
        region_id: null,
        page: 1,
      },
      actions: [
        {
          to: record => ({
            name: 'CatalogCityEdit',
            params: { id: record.id },
          }),
          title: 'Редактировать',
        },
      ],
      cities: [],
      pagination: {},
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
          width: '20%',
        },
        {
          title: 'ГРЗ/Область',
          dataIndex: ['region', 'name'],
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
    this.fetchCities();
  },
  methods: {
    debouncedSearch: debounce(function() {
      this.submitFilter();
    }, INPUT_DELAY),

    resetFilter() {
      this.filters = {
        name: '',
        region_id: null,
        page: 1,
      };
      this.submitFilter();
    },
    submitFilter() {
      this.fetchCities(this.filters);
    },
    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },
    fetchCities(params = {}) {
      getAxios('/cities', { ...params }).then((res) => {
        this.cities = res.data;
        this.pagination = res.meta;
      });
    },
  },
};
</script>

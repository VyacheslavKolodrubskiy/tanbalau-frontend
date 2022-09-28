<template>
  <div>
    <APageHeader title="Организации Клиентов" />
    <AForm class="page-filter" layout="vertical">
      <ARow :gutter="24">
        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Поиск по наименованию">
            <AInput
              v-model:value="state.filters.title"
              placeholder="Наименование организации"
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
          <AFormItem label="Поиск по БИН/ИИН">
            <AInput
              v-model:value="state.filters.bin"
              placeholder="БИН/ИИН"
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
          <AFormItem label="Поиск по юр.адресу">
            <AInput
              v-model:value="state.filters.legal_address"
              placeholder="Юр.адрес"
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
          <AFormItem label="Поиск по email">
            <AInput
              v-model:value="state.filters.email"
              placeholder="E-mail"
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
          <AFormItem label="Поиск по телефону">
            <AInputNumber
              v-model:value="state.filters.phone"
              placeholder="Телефон"
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
      :data-source="state.counterpartyList"
      :pagination="pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          {{ $format(record.title, 'truncate', { length: 90 }) }}
        </template>
        <template v-if="column.dataIndex === 'legal_address'">
          {{ $format(record.legal_address, 'truncate', { length: 70 }) }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableActions :actions="actions" :record="record" />
        </template>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/lib/table/interface';
import type { TableAction } from '@/types';
import { debounce } from '@/utils/lodash';
import { Executor } from '@/network/executor';
import { INPUT_DELAY } from '@/config/constants';
import type { Organization } from '@/models/organization.model';
import type { Pagination } from '@/network/pagination.response';
import { usePagination } from '@/composables/usePagination';
import type { OrganizationFilter } from '@/services/organization.service';
import { OrganizationService } from '@/services/organization.service';

const state = reactive({
  filters: {
    id: '',
    bin: '',
    page: 1,
    title: '',
    email: '',
    phone: '',
    legal_address: '',
  } as OrganizationFilter,
  counterpartyList: [] as Organization[],
});

const actions: TableAction<Organization>[] = ([
  {
    to: record => ({
      name: 'CatalogOrganizationsView',
      params: { id: record.id },
    }),
    title: 'Просмотр',
  },
]);

const columns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 70,
  },
  {
    title: 'Наименование',
    dataIndex: 'title',
    width: 300,
  },
  {
    title: 'БИН/ИИН',
    dataIndex: 'bin',
    width: 127,
  },
  {
    title: 'Юр.адрес',
    dataIndex: 'legalAddress',
    width: 240,
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
  },
  {
    title: 'Телефон',
    dataIndex: 'phone',
  },
  {
    dataIndex: 'action',
    width: 60,
    fixed: 'right',
  },

];

const { pagination } = usePagination();

function changeTable(pagination: TablePaginationConfig) {
  state.filters.page = pagination.current;
  submitFilter();
}

function fetchOrganizations(params?: OrganizationFilter) {
  Executor.run<Pagination<Organization>>({
    request: OrganizationService.fetchOrganization(params),
    onResult(data) {
      state.counterpartyList = data.list;
      pagination.total = data.total;
      pagination.lastPage = data.lastPage;
    },
  });
}

function submitFilter() {
  fetchOrganizations(state.filters);
}

const debouncedSearch = debounce(() => {
  submitFilter();
}, INPUT_DELAY);

function resetFilter() {
  state.filters.id = '';
  state.filters.bin = '';
  state.filters.page = 1;
  state.filters.title = '';
  state.filters.email = '';
  state.filters.phone = '';
  state.filters.legal_address = '';

  submitFilter();
}

fetchOrganizations();
</script>

<template>
  <div>
    <APageHeader title="Онлайн оплата" />
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
          <AFormItem label="ФИО">
            <AInput
              v-model:value="state.filters.name"
              placeholder="ФИО"
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
          <AFormItem label="Поиск по организации">
            <AInput
              v-model:value="state.filters.counterparty"
              placeholder="Организация"
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
          <AFormItem label="Сумма оплаты">
            <AInputNumber
              v-model:value="state.filters.amount"
              placeholder="Сумма оплаты"
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
          <AFormItem label="Статус оплаты">
            <SelectPaymentStatus
              v-model:value="state.filters.status"
              placeholder="Не выбрано"
              size="large"
              title="accessTitle"
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
          <AFormItem label="Дата">
            <QDatePicker
              v-model:value="state.filters.created_at"
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
          <ResetButton @click="resetFilters" />
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :columns="columns"
      :data-source="state.usersPay"
      :pagination="state.pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <div class="lh-sm fz-12">
            <div><span class="text-gray-500">Пользователь:</span> {{ record.name }}</div>
            <div><span class="text-gray-500">Организация:</span> {{ record.counterparty }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'paid_up_to'">
          {{ record.paid_up_to ? $format(record.paid_up_to, 'date') : '' }}
        </template>
        <template v-if="column.dataIndex === 'created_at'">
          {{ $format(record.created_at, 'datetime') }}
        </template>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/lib/table/interface';
import { getAxios } from '@/services/http/request';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';

interface Filters {
  name: string
  counterparty?: string
  amount: string
  created_at: string | null
  status: string
  page: number | null | undefined
}

const columns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 30,
  },
  {
    title: 'Пользователь / Организация',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: 'Сумма',
    dataIndex: 'amount',
    width: 60,
  },
  {
    title: 'Оплачено до',
    dataIndex: 'paid_up_to',
    width: 60,
  },
  {
    title: 'Статус',
    dataIndex: ['status', 'name'],
    width: 60,
  },
  {
    title: 'Номер заказа',
    dataIndex: 'pg_payment_id',
    width: 60,
  },
  {
    title: 'Назначение',
    dataIndex: 'sub_type',
    width: 90,
  },
  {
    title: 'Создано',
    dataIndex: 'created_at',
    width: 90,
  },
];

const state = reactive({
  filters: {
    name: '',
    counterparty: '',
    amount: '',
    status: '',
    created_at: null,
    page: 1,
  } as Filters,
  usersPay: [],
  pagination: {},
});

function fetchOrders(params: Filters = { name: '', counterparty: '', amount: '', status: '', created_at: '', page: 1 }) {
  return getAxios('/users/admin/payments', { ...params }).then((res) => {
    state.usersPay = res.data;
    state.pagination = res.meta;
  });
}

function submitFilter() {
  fetchOrders(state.filters);
}

function changeTable(pagination: TablePaginationConfig) {
  state.filters.page = pagination.current;
  submitFilter();
}

function resetFilters() {
  state.filters = {
    name: '',
    counterparty: '',
    amount: '',
    status: '',
    created_at: '',
    page: 1,
  };
  submitFilter();
}

const debouncedSearch = debounce(() => {
  submitFilter();
}, INPUT_DELAY);

submitFilter();

</script>

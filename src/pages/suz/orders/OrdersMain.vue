<template>
  <div>
    <APageHeader title="Система управления заказами (СУЗ)">
      <template #extra>
        <AddLink v-if="$canUse(['client'])" :to="{ name: 'OrderAdd' }" />
      </template>
    </APageHeader>
    <AForm class="page-filter" layout="vertical">
      <ARow :gutter="24">
        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Наименование">
            <AInput
              v-model:value="state.filters.title"
              placeholder="Наименование"
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
          <AFormItem label="ID Заказа в ИС МПТ">
            <AInput
              v-model:value="state.filters.suz_order_id"
              placeholder="ID Заказа в ИС МПТ"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          v-if="$canUse(['admin', 'manager'])"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Автор">
            <SelectCustomer
              v-model:value="state.filters.manager"
              placeholder="Автор"
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
          <AFormItem label="GTIN товара">
            <AInputNumber
              v-model:value="state.filters.gtin"
              placeholder="GTIN товара"
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
          <AFormItem label="Дата заказа">
            <QDatePicker
              v-model:value="state.filters.date"
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
          <AFormItem label="Способ изготовления">
            <SelectCreatedMethod
              v-model:value="state.filters.manufacture"
              placeholder="Способ изготовления"
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
          <AFormItem label="Страна производства">
            <SelectCountry
              v-model:value="state.filters.country"
              placeholder="Страна производства"
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
          <AFormItem label="Способ выпуска товаров">
            <SelectReleaseMethod
              v-model:value="state.filters.release"
              placeholder="Способ выпуска товаров"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="12"
          :md="16"
          :xs="24"
          :xxl="8"
        >
          <AFormItem label="Статус">
            <SelectMarkingStatus
              v-model:value="state.filters.status"
              :max-tag-count="2"
              mode="multiple"
              placeholder="Статус"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          class="page-filter__reset"
          :lg="12"
          :xl="8"
          :xs="24"
          :xxl="4"
        >
          <ResetButton @click="resetFilters" />
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :actions="state.actions"
      :columns="state.columns"
      :data-source="state.orders"
      :pagination="state.pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <div class="lh-sm fz-14">
            <div>
              <span class="text-gray-500">Наименование:</span>
              {{ record.title }}
            </div>
            <div>
              <span class="text-gray-500">ID Заказа в ИС МПТ:<br></span>
              {{ record.suz_order_id }}
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'org'">
          <div class="lh-sm fz-12">
            <div>
              <span class="text-gray-500">Организация:</span>
              {{ record.counterparty.title }}
            </div>
            <div>
              <span class="text-gray-500">Автор заказа:</span>
              {{ record.contactPerson }}
            </div>
            <div>
              <span class="text-gray-500">Дата:</span>
              {{ $format(record.created_at, 'datetime') }}
            </div>
          </div>
        </template>
        <TableActions
          v-else-if="column.dataIndex === 'action'"
          :actions="state.actions"
          :record="record"
        />
        <StatusTag
          v-else-if="column.dataIndex === 'status'"
          :variant="getOrderStatusVariant(record.status.id)"
        >
          {{ record.status.title }}
        </StatusTag>
      </template>
    </QTable>
  </div>
</template>
<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/lib/table/interface';
import { getOrderStatusVariant } from '@/utils/utils';
import { getAxios } from '@/services/http/request';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';
import { canUse } from '@/utils/permissions';

interface Status {
  id: number
  title: string
}

interface Link {
  url: string | null
  label: string
  active: boolean
}

interface Meta {
  current_page: number
  from: number
  last_page: number
  links: Link[]
  path: string
  per_page: number
  to: number
  total: number
}

interface Counterparty {
  bank: string
  bik: string
  bin: number
  phone: string
  title: string
  email: string
  fact_address: string
  id: number
  iik: string
  legal_address: string
  oms_id?: string
  client_token?: string
  comment?: string
  api_key?: string
}

interface SuzSelectData {
  created_at?: string
  deleted_at?: string
  description?: string
  id: number
  slug: string
  status_id: number
  title: string
  type: number
  updated_at?: string
}

interface Log {
  created_at: string
  id: number
  loggable_id: number
  loggable_type: string
  new_data?: Log[]
  previous_data?: Log[]
  title: string
  type: number
  updated_at: string
  user_id: number
}

interface Branch {
  address: string
  email: string
  id: number
  is_active?: boolean
  location: string
  note?: string
  phone: number
  title: string
}

interface Role {
  id: number
  title: string
}

interface User {
  created_at: string
  deleted_at: string
  email: string
  id: number
  iin: number
  is_active: boolean
  name: string
  note?: string
  phone: number
  role: Role
  status: Status
  updated_at: string
}

interface UserClient extends User {
  counterpartyUser: Counterparty
}

interface UserManager extends User {
  branchUser: Branch
}

  type CurrentUser = User | UserClient | UserManager;

interface OrderItem {
  id?: number
  index?: number
  gtin: string | number
  quantity: string | number
  key?: number
  block_id?: string
  codes?: string[]
  comment?: string
  leftCodes?: number | string
  serialNumberType?: string
  status?: Status
  templateId?: string | number
  totalCodes?: string | number
  usedCodes?: number
}

interface Order {
  contactPerson: string
  counterparty: Counterparty
  country: SuzSelectData
  createMethodType: SuzSelectData
  created_at: string
  declineReason?: string
  deleted_at?: string
  id: number
  km_count: number
  logs: Log[]
  orderItems: OrderItem[]
  productionOrderId?: number
  releaseMethodType: SuzSelectData
  status: Status
  suz_order_id: string
  title: string
  updated_at: string
  user: CurrentUser
}

interface Filters {
  date?: string | null | undefined
  title?: string
  suz_order_id?: string | number
  manager?: string | null
  gtin?: string
  manufacture?: string
  country?: string
  release?: string
  status?: string[]
  page?: number | null | undefined
}

const state = reactive({
  filters: {
    date: null,
    title: '',
    suz_order_id: '',
    manager: null,
    gtin: '',
    manufacture: '',
    country: '',
    release: '',
    status: [],
    page: 1,
  } as Filters,

  actions: [
    {
      to: record => ({
        name: 'OrderView',
        params: { id: record.id },
      }),
      title: 'Просмотр',
      condition: () => canUse(['admin', 'manager', 'client']),
    },
    {
      to: record => ({
        name: 'OrderEdit',
        params: { id: record.id },
      }),
      title: 'Редактировать',
      condition: record => record.status.id === 0 && canUse(['client']),
    },
  ],
  orders: [] as Order[],
  pagination: {},
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
    },
    {
      title: 'Наименование / ID Заказа в ИС МПТ',
      dataIndex: 'title',
      width: 450,
    },
    {
      title: 'Общее кол-во КМ',
      dataIndex: 'km_count',
    },
    {
      title: 'Организация / Автор заказа / Дата',
      dataIndex: 'org',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
    },
    {
      dataIndex: 'action',
      fixed: 'right',
      width: 60,
    },
  ] as TableColumnProps[],
});

onMounted(() => submitFilter());

const debouncedSearch = debounce(() => {
  submitFilter();
}, INPUT_DELAY);

function fetchOrders(params: Filters = {}) {
  return getAxios('/orders', { ...params }).then((res: { data: Order[]; meta: Meta }) => {
    state.orders = res.data;
    state.pagination = res.meta;
  },
  );
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
    date: null,
    title: '',
    suz_order_id: '',
    manager: null,
    gtin: '',
    manufacture: '',
    country: '',
    release: '',
    status: [],
    page: 1,
  };
  submitFilter();
}
</script>

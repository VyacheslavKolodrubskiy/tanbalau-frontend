<template>
  <div>
    <APageHeader title="Пользователи &quot;Менеджер&quot;">
      <template #extra>
        <AddLink
          v-if="$canUse(['admin'])"
          :to="{ name: 'UsersManagerAdd' }"
        />
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
          <AFormItem label="Поиск по ФИО">
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
          <AFormItem label="Поиск по филиалу">
            <AInput
              v-model:value="state.filters.branch"
              placeholder="Филиал"
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
          <AFormItem label="Поиск по почте">
            <AInput
              v-model:value="state.filters.email"
              placeholder="Почта"
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
          <AFormItem label="Активен">
            <ARadioGroup v-model:value="state.filters.status" @change="debouncedSearch">
              <ARadio :value="1">
                Да
              </ARadio>
              <ARadio :value="0">
                Нет
              </ARadio>
            </ARadioGroup>
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
      :actions="actions"
      :columns="columns"
      :data-source="state.managerList"
      :pagination="pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'isActive'">
          {{ $format(record.isActive, 'yesno') }}
        </template>
        <TableActions
          v-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record"
        />
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/lib/table/interface';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';
import { canUse } from '@/utils/permissions';
import type { Pagination } from '@/network/pagination.response';
import { usePagination } from '@/composables/usePagination';
import type { TableAction } from '@/types';
import type { Manager } from '@/models/manager.model';
import { Executor } from '@/network/executor';
import type { ManagerFilters } from '@/services/manager.service';
import { ManagerService } from '@/services/manager.service';

const columns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 70,
  },
  {
    title: 'ФИО',
    dataIndex: 'name',
  },
  {
    title: 'Филиал',
    dataIndex: ['branchUser', 'title'],
    width: 289,
  },
  {
    title: 'Почта',
    dataIndex: 'email',
    ellipsis: true,
  },
  {
    title: 'Телефон',
    dataIndex: 'phone',
  },
  {
    title: 'Активность',
    dataIndex: 'isActive',
    width: 120,
  },
  {
    dataIndex: 'action',
    width: 60,
  },
];

const state = reactive({
  filters: {
    name: '',
    branch: '',
    email: '',
    active: '',
    status: null,
    page: 1,
  } as ManagerFilters,
  managerList: [] as Manager[],
});

const { pagination } = usePagination();

const actions: TableAction<Manager>[] = [
  {
    to: record => ({
      name: 'UsersManagerView',
      params: { id: record.id },
    }),
    title: 'Просмотр',
    condition: () => canUse(['admin', 'manager']),
  },
  {
    to: record => ({
      name: 'UsersManagerEdit',
      params: { id: record.id },
    }),
    title: 'Редактировать',
    condition: () => canUse(['admin']),
  },
];

function fetchManagers() {
  Executor.run<Pagination<Manager>>({
    request: ManagerService.fetchManager(state.filters),
    onResult(data) {
      state.managerList = data.list;
      pagination.total = data.total;
      pagination.perPage = data.perPage;
      pagination.page = state.filters.page;
      pagination.lastPage = data.lastPage;
    },
  });
}

function changeTable(pagination: TablePaginationConfig) {
  state.filters.page = pagination.current;
  fetchManagers();
}

function resetFilters() {
  state.filters = {
    name: '',
    branch: '',
    email: '',
    active: '',
    status: null,
    page: 1,
  };
  fetchManagers();
}

const debouncedSearch = debounce(() => {
  fetchManagers();
}, INPUT_DELAY);

fetchManagers();

</script>

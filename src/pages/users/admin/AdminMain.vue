<template>
  <APageHeader title="Пользователи &quot;Администратор&quot;">
    <template #extra>
      <AddLink v-if="$canUse(['admin'])" :to="{ name: 'UsersAdminAdd' }" />
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
    :data-source="state.adminsList"
    :pagination="pagination"
    @change="changeTable"
  >
    <template #bodyCell="{ column, record }">
      <template
        v-if="column.dataIndex === 'note'"
      >
        {{ $format(record.note, 'truncate', { length: 90 }) }}
      </template>
      <template v-if="column.dataIndex === 'action'">
        <TableActions :actions="actions" :record="record" />
      </template>
    </template>
  </QTable>
</template>

<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/lib/table/interface';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';
import { canUse } from '@/utils/permissions';
import type { AdminFilter } from '@/services/admin.service';
import { AdminService } from '@/services/admin.service';
import { Executor } from '@/network/executor';
import { usePagination } from '@/composables/usePagination';
import type { Admin } from '@/models/admin.model';
import type { Pagination } from '@/network/pagination.response';
import type { TableAction } from '@/types';

const columns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 70,
  },
  {
    title: 'ФИО',
    dataIndex: 'name',
    width: 289,
  },
  {
    title: 'Почта',
    dataIndex: 'email',
  },
  {
    title: 'Комментарий',
    dataIndex: 'note',
  },
  {
    dataIndex: 'action',
    width: 60,
  },
];

const state = reactive({
  filters: {
    name: '',
    email: '',
    page: 1,
  } as AdminFilter,
  adminsList: [] as Admin[],
});

const { pagination } = usePagination();

const actions: TableAction<Admin>[] = [
  {
    to: record => ({
      name: 'UsersAdminView',
      params: { id: record.id },
    }),
    title: 'Просмотр',
    condition: () => canUse(['admin']),
  },
  {
    to: record => ({
      name: 'UsersAdminEdit',
      params: { id: record.id },
    }),
    title: 'Редактировать',
    condition: () => canUse(['admin']),
  },
];

function fetchAdmins(params?: AdminFilter) {
  Executor.run<Pagination<Admin>>({
    request: AdminService.fetchAdmin(params),
    onResult(data) {
      state.adminsList = data.list;
      pagination.total = data.total;
      pagination.lastPage = data.lastPage;
    },
  });
}

function submitFilter() {
  fetchAdmins(state.filters);
}

function resetFilters() {
  state.filters = {
    name: '',
    email: '',
    page: 1,
  };
  submitFilter();
}

function changeTable(pagination: TablePaginationConfig) {
  state.filters.page = pagination.current;
  submitFilter();
}

const debouncedSearch = debounce(() => {
  submitFilter();
}, INPUT_DELAY);

submitFilter();

</script>

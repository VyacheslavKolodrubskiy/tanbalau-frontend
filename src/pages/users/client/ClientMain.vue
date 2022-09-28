<template>
  <div>
    <APageHeader title="Пользователи &quot;Клиент&quot;" />
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
          <AFormItem label="Поиск по организации">
            <AInput
              v-model:value="state.filters.company"
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
          <AFormItem label="Поиск по ИИН">
            <AInput
              v-model:value="state.filters.iin"
              placeholder="ИИН"
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
          :lg="12"
          :md="16"
          :xs="24"
          :xxl="8"
        >
          <AFormItem label="Статус">
            <SelectPaymentStatus
              v-model:value="state.filters.subStatus"
              placeholder="Не выбрано"
              :show-arrow="true"
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
          <div class="h-100 d-flex align-items-end">
            <AFormItem>
              <ACheckbox v-model:checked="state.filters.transfer_application" @change="debouncedSearch">
                Передать доступ
              </ACheckbox>
            </AFormItem>
          </div>
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
      :data-source="state.clients"
      :pagination="pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <TableActions
          v-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record"
        />
        <StatusTagSubscription
          v-if="column.dataIndex === 'subscription'"
          :subscription="record.subscription"
        />
      </template>
    </QTable>
  </div>
  <AModal
    v-if="state.showTransferModal"
    v-model:visible="state.showTransferModal"
    destroy-on-close
    title="Передать доступ к тарифу"
  >
    <AForm layout="vertical">
      <AFormItem label="От пользователя">
        <AInput
          v-model:value="state.modalForm.userNameFrom"
          disabled
          size="large"
        />
      </AFormItem>

      <AFormItem label="Доступ к тарифу будет передан пользователю ">
        <AInput
          v-model:value="state.modalForm.userNameTo"
          disabled
          size="large"
        />
      </AFormItem>
    </AForm>
    <template #footer>
      <div class="d-flex justify-content-center">
        <QBtn
          danger
          size="large"
          type="primary"
          @click="onCancel"
        >
          Отмена
        </QBtn>
        <SubmitButton @click="grantTariffAccess">
          Продолжить
        </SubmitButton>
      </div>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/lib/table/interface';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';
import { canUse } from '@/utils/permissions';
import type { TableAction } from '@/types';
import { usePagination } from '@/composables/usePagination';
import type { Client } from '@/models/client.model';
import { Executor } from '@/network/executor';
import type { ClientFilters } from '@/services/client.service';
import { ClientService } from '@/services/client.service';
import type { Pagination } from '@/network/pagination.response';
import StatusTagSubscription from '@/pages/profile/components/StatusTagSubscription.vue';

interface ModalForm {
  userNameFrom: string
  userNameTo: string
  clientId: number | null
}

const columns = computed((): TableColumnProps[] => {
  return [
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
      title: 'Организация',
      dataIndex: ['counterpartyUser', 'title'],
      width: 250,
    },
    {
      title: 'ИИН',
      dataIndex: 'iin',
      ellipsis: true,
    },
    {
      title: 'Почта',
      dataIndex: 'email',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Статус оплаты',
      dataIndex: 'subscription',
      width: 170,
    },
    {
      dataIndex: 'action',
      width: 60,
    },
  ];
});
const state = reactive({
  filters: {
    name: '',
    company: '',
    iin: '',
    email: '',
    active: '',
    subStatus: [],
    transfer_application: undefined,
    page: 1,
  } as ClientFilters,
  showTransferModal: false,
  modalForm: {
    userNameFrom: '',
    userNameTo: '',
    clientId: null,
  } as ModalForm,
  clients: [] as Client[],
});
const { pagination } = usePagination();
const actions: TableAction<Client>[] = [
  {
    to: record => ({
      name: 'UsersClientView',
      params: { id: record.id },
    }),
    title: 'Просмотр',
    condition: () => canUse(['admin', 'manager']),
  },
  {
    title: 'Передать доступ',
    condition: record => canUse(['admin']) && record.subscription?.transferApplication as boolean,
    click: onTransferAccessClick,
  },
];

function onCancel() {
  state.showTransferModal = false;
}

function grantTariffAccess() {
  Executor.run({
    request: ClientService.transferTariff(state.modalForm.clientId as number),
    onResult(data) {
      state.showTransferModal = false;
      message.success(data.message);
    },
  });
}

function onTransferAccessClick(record) {
  state.modalForm.userNameFrom = record.name;
  state.modalForm.clientId = record.id;
  fetchClient(record.subscription.transferInfo);
}

function fetchClients() {
  state.filters.transfer_application = state.filters.transfer_application ? +state.filters.transfer_application : undefined;

  Executor.run<Pagination<Client>>({
    request: ClientService.fetchClients(state.filters),
    onResult(data) {
      state.clients = data.list;
      pagination.total = data.total;
      pagination.perPage = data.perPage;
      pagination.page = state.filters.page;
      pagination.lastPage = data.lastPage;
    },
  });
}

function fetchClient(id) {
  Executor.run<Client>({
    request: ClientService.readClient(id),
    globalLoading: true,
    onResult(data) {
      state.modalForm.userNameTo = data.name as string;
      state.showTransferModal = true;
    },
  });
}

const debouncedSearch = debounce(() => {
  fetchClients();
}, INPUT_DELAY);

function changeTable(pagination: TablePaginationConfig) {
  state.filters.page = pagination.current;
  fetchClients();
}

function resetFilters() {
  state.filters = {
    name: '',
    company: '',
    iin: '',
    email: '',
    active: '',
    status: [],
    transfer_application: undefined,
    page: 1,
  } as ClientFilters;
  fetchClients();
}

fetchClients();
</script>

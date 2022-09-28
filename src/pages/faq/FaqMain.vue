<template>
  <div>
    <APageHeader title="Вопрос ответ">
      <template #extra>
        <AddLink
          v-if="$canUse(['admin', 'manager'])"
          :to="{ name: 'FaqAdd' }"
        />
      </template>
    </APageHeader>
    <AForm class="page-filter" layout="vertical">
      <ARow
        :gutter="24"
      >
        <ACol
          :lg="12"
          :md="16"
          :sm="24"
        >
          <AFormItem label="Поиск по вопросу">
            <AInput
              v-model:value="state.filters.question"
              placeholder="По вопросу"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="state.faqList"
      :pagination="pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'question'">
          {{ $format(record.question, 'truncate', { length: 75 }) }}
        </template>
        <template v-if="column.dataIndex === 'answer'">
          <div class="inlined-html" v-html="$format(record.answer, 'truncate', { length: 150 })" />
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
import { Modal } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/lib/table/interface';
import { debounce } from '@/utils/lodash';
import { canUse } from '@/utils/permissions';
import { INPUT_DELAY } from '@/config/constants';
import type { RequestParamValue, TableAction } from '@/types';
import { Executor } from '@/network/executor';
import type { Pagination } from '@/network/pagination.response';
import type { FaqFilters } from '@/services/faq.service';
import { FaqService } from '@/services/faq.service';
import type { Faq } from '@/models/faq.models';
import { usePagination } from '@/composables/usePagination';

const columns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 20,
  },
  {
    title: 'Вопрос',
    dataIndex: 'question',
    width: 250,
  },
  {
    title: 'Ответ',
    dataIndex: 'answer',
    width: 400,
  },
  {
    title: 'Дата',
    dataIndex: 'createdAt',
    width: 20,
  },
  {
    dataIndex: 'action',
    width: 20,
  },
];
const state = reactive({
  filters: {
    question: '',
    page: 1,
  } as FaqFilters,
  faqList: [] as Faq[],
});
const { pagination } = usePagination();
const actions: TableAction<Faq>[] = [
  {
    to: record => ({
      name: 'FaqView',
      params: { id: record.id },
    }),
    title: 'Просмотр',
  },
  {
    to: record => ({
      name: 'FaqEdit',
      params: { id: record.id },
    }),
    title: 'Редактировать',
    condition: () => canUse(['admin', 'manager']),
  },
  {
    click: record => openModal(record),
    title: 'Удалить',
    condition: () => canUse(['admin']),
  },
];

function fetchFaq() {
  Executor.run<Pagination<Faq>>({
    request: FaqService.fetchPolls(state.filters),
    onResult(data) {
      state.faqList = data.list;
      pagination.total = data.total;
      pagination.lastPage = data.lastPage;
    },
  });
}

function deleteFaq(id: RequestParamValue) {
  Executor.run({
    request: FaqService.deletePoll(id),
    onResult() {
      fetchFaq();
    },
  });
}

function openModal(item: Faq) {
  Modal.confirm({
    title: `Вы действительно хотите удалить запись - "${item.question}" ?`,
    okText: 'Да',
    okType: 'danger',
    cancelText: 'Нет',
    onOk: () => deleteFaq(item.id as number),
  });
}

function changeTable(pagination: TablePaginationConfig) {
  state.filters.page = pagination.current;
  fetchFaq();
}

const debouncedSearch = debounce(() => {
  fetchFaq();
}, INPUT_DELAY);
fetchFaq();
</script>

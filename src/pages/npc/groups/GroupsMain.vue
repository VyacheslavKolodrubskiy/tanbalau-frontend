<template>
  <div class="providers">
    <APageHeader title="Группы товаров">
      <template #extra>
        <AddLink v-if="$canUse(['client'])" :to="{ name: 'GroupsAdd' }" />
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
              v-model:value="filters.title"
              placeholder="Наименование"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>
        <ACol
          v-if="!$canUse('client')"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Организация">
            <SelectCounterparty
              v-model:value="filters.counterparty"
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
          <AFormItem label="Дата">
            <QDatePicker
              v-model:value="filters.created_at"
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
              v-model:value="filters.gtin"
              placeholder="GTIN товара"
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
            <SelectGroupsStatus
              v-model:value="filters.status"
              :max-tag-count="2"
              mode="multiple"
              placeholder="Статус"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="24"
          :xl="10"
          :xs="24"
          :xxl="4"
        >
          <ResetButton class="page-filter__reset" @click="resetFilter" />
        </ACol>
      </ARow>
    </AForm>

    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="groupList"
      :pagination="pagination"
      :row-class-name="coloredRow"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <div class="lh-sm fz-12">
            <div><span class="text-gray-500">Наименование:</span> {{ record.title }}</div>
            <div><span class="text-gray-500">Дата:</span> {{ $format(record.created_at, 'datetime') }}</div>
            <div><span class="text-gray-500">Организация:</span> {{ record.counterparty.title }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'countOfGtins'">
          <div>{{ record.products.length }}</div>
        </template>
        <template v-if="column.dataIndex === 'onModeration'">
          <div>{{ getProductsStatusCount(record.products, 'moderation') }}</div>
        </template>
        <template v-if="column.dataIndex === 'requiredChange'">
          <div>{{ getProductsStatusCount(record.products, 'errors') }}</div>
        </template>
        <template v-if="column.dataIndex === 'signAwaiting'">
          <div>{{ getProductsStatusCount(record.products, 'notsigned') }}</div>
        </template>
        <TableActions
          v-else-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record"
        />
        <StatusTag v-else-if="column.dataIndex === 'status_id'" :variant="getGroupStatusVariant(record.status.id)">
          {{ record.status.title }}
        </StatusTag>
      </template>
    </QTable>
  </div>
</template>
<script>
import { getAxios } from '@/services/http/request';
import { getGroupStatusVariant } from '@/utils/utils';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';
import { PRODUCT_STATUSES } from '@/config/types';

export default {
  name: 'GroupsMain',
  data() {
    return {
      filters: {
        created_at: null,
        title: '',
        gtin: '',
        status: [],
        page: 1,
      },
      groupList: [],
      pagination: {},
      actions: [
        {
          to: record => ({ name: 'ProductGroupEdit', params: { id: record.id } }),
          title: 'Просмотр',
          condition: () => this.$canUse(['admin', 'manager', 'client']),
        },
      ],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Наименование / Дата / Организация',
          dataIndex: 'title',
          width: 320,
        },
        {
          title: 'Общее кол-во GTIN',
          dataIndex: 'countOfGtins',
        },
        {
          title: 'На модерации',
          dataIndex: 'onModeration',
        },
        {
          title: 'Требует изменений',
          dataIndex: 'requiredChange',
        },
        {
          title: 'Ожидает подписания',
          dataIndex: 'signAwaiting',
        },
        {
          title: 'Статус',
          dataIndex: 'status_id',
        },
        {
          fixed: 'right',
          dataIndex: 'action',
          width: 60,
        },
      ],
    };
  },
  created() {
    this.fetchGroupsList();
  },
  methods: {
    coloredRow(record) {
      return this.getProductsStatusCount(record.products, 'errors') > 0 ? 'colored__row' : '';
    },
    debouncedSearch: debounce(function() {
      this.submitFilter();
    }, INPUT_DELAY),
    getProductsStatusCount(products, status) {
      const statusChack = products.filter(product => product.status.id === PRODUCT_STATUSES[status].id);
      return statusChack.length;
    },
    fetchGroupsList(params = {}) {
      return getAxios('/nkt/product-groups', { ...params }).then((res) => {
        this.groupList = res.data;
        this.pagination = res.meta;
      },
      );
    },
    submitFilter() {
      this.fetchGroupsList(this.filters);
    },
    getGroupStatusVariant,
    resetFilter() {
      this.filters = {
        created_at: null,
        title: '',
        gtin: '',
        status: [],
        page: 1,
      };
      this.submitFilter();
    },
    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },
  },
};
</script>

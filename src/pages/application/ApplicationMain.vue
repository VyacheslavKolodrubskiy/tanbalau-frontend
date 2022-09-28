<template>
  <div>
    <APageHeader title="Заявки">
      <template #extra>
        <AddLink v-if="$canUse(['client'])" :to="{ name: 'ApplicationAdd' }" />
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
          <AFormItem label="Номер заявки">
            <AInputNumber
              v-model:value="filters.id"
              placeholder="Номер заявки"
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
          <AFormItem label="Заголовок">
            <AInput
              v-model:value="filters.title"
              placeholder="Заголовок"
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
          <AFormItem label="Категория">
            <SelectApplicationCategory
              v-model:value="filters.category"
              placeholder="Категория"
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
          <AFormItem label="Дата заявки">
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
          <AFormItem label="Автор заявки">
            <AInput
              v-model:value="filters.author"
              placeholder="Автор заявки"
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
          <AFormItem label="Менеджер">
            <SelectManager
              v-model:value="filters.manager"
              placeholder="Менеджер"
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
            <SelectApplicationStatus
              v-model:value="filters.status"
              :max-tag-count="2"
              mode="multiple"
              placeholder="Статус"
              :show-arrow="true"
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
          <ResetButton class="page-filter__reset" @click="resetFilters" />
        </ACol>
      </ARow>
    </AForm>

    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="applications"
      :pagination="pagination"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <div class="lh-sm fz-14">
            <div><span class="text-gray-500">Заголовок:</span> <span :title="record.title">{{ $format(record.title, 'truncate', { length: 100 }) }} </span></div>
            <div><span class="text-gray-500">Категория:</span> {{ record.category }}</div>
            <div><span class="text-gray-500">Дата:</span> {{ $format(record.created_at, 'datetime') }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'orgAuthor'">
          <div class="lh-sm fz-12">
            <div><span class="text-gray-500">Организация:</span> {{ record.counterparty.title }}</div>
            <div><span class="text-gray-500">Автор заявки:</span> {{ record.author.name }}</div>
          </div>
        </template>
        <TableActions
          v-else-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record"
        />

        <StatusTag v-else-if="column.dataIndex === 'status'" :variant="getApplicationStatusVariant(record.status.id)">
          {{ record.status.title }}
        </StatusTag>
      </template>
    </QTable>
  </div>
</template>
<script>
import { getApplicationStatusVariant } from '@/utils/utils';
import { getAxios } from '@/services/http/request';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';

export default {
  name: 'Application',
  data() {
    return {
      filters: {
        id: '',
        title: '',
        category: null,
        counterparty: null,
        created_at: null,
        manager: null,
        status: [],
        author: '',
        page: 1,
      },
      applications: [],
      pagination: {},
      actions: [
        {
          title: 'Просмотр',
          to: record => ({ name: 'ApplicationView', params: { id: record.id } }),
        },
      ],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Заголовок / Категория / Дата',
          dataIndex: 'title',
          width: 400,
        },
        {
          title: 'Организация / Автор заявки',
          dataIndex: 'orgAuthor',
        },
        {
          title: 'Менеджер',
          dataIndex: ['manager', 'name'],
          className: 'fz-12',
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
      ];
    },
  },
  created() {
    this.submitFilter();
  },
  methods: {
    debouncedSearch: debounce(function() {
      this.submitFilter();
    }, INPUT_DELAY),

    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },

    fetchApplications(params = {}) {
      return getAxios('/application', { ...params }).then((res) => {
        this.applications = res.data;
        this.pagination = res.meta;
      });
    },

    submitFilter() {
      this.fetchApplications(this.filters);
    },

    resetFilters() {
      this.filters = {
        id: '',
        title: '',
        counterparty: null,
        category: null,
        created_at: null,
        manager: null,
        status: [],
        page: 1,
      };
      this.submitFilter();
    },
    getApplicationStatusVariant,
  },
};
</script>

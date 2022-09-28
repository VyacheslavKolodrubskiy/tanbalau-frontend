<template>
  <div class="orders">
    <APageHeader title="Печать КМ">
      <template #extra>
        <AddLink v-if="$canUse(['client'])" :to="{ name: 'PrintAdd' }" />
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
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="ID Заказа в ИС МПТ">
            <AInput
              v-model:value="filters.suz_order_id"
              placeholder="ID Заказа в ИС МПТ"
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
          <AFormItem label="Планируемая дата поставки">
            <QDatePicker
              v-model:value="filters.date"
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
          <AFormItem label="Адрес поставки">
            <AInput
              v-model:value="filters.address"
              placeholder="Адрес поставки"
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
          <AFormItem label="БИН/ИИН организации">
            <AInputNumber
              v-model:value="filters.bin"
              placeholder="БИН/ИИН организации"
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
          <AFormItem label="Менеджер">
            <AInput
              v-model:value="filters.manager"
              placeholder="Менеджер"
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
          <AFormItem label="GTIN">
            <AInputNumber
              v-model:value="filters.gtin"
              placeholder="GTIN"
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
          <AFormItem label="КМ">
            <AInput
              v-model:value="filters.barcode"
              placeholder="КМ"
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
            <SelectPrintStatus
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
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Закрыт">
            <ARadioGroup v-model:value="filters.is_closed" @change="debouncedSearch">
              <ARadio :value="1">
                Да
              </ARadio>
              <ARadio :value="0">
                Нет
              </ARadio>
            </ARadioGroup>
          </AFormItem>
        </ACol>

        <ACol>
          <ResetButton class="mt-6" @click="resetFilters" />
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="printGroups"
      :pagination="pagination"
      @change="change"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <div class="lh-sm fz-14">
            <div>
              <span class="text-gray-500">Наименование:</span>
              {{ record.title }}
            </div>
            <div>
              <span class="text-gray-500">Клиент:</span>
              {{ record.counterparty.title }}
            </div>
            <div>
              <span class="text-gray-500">Дата:</span>
              {{ record.created_at }}
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'managerDeliveryDate'">
          <div class="lh-sm fz-12">
            <div>
              <span class="text-gray-500">Менеджер:</span>
              {{ record.manager.name }}
            </div>
            <div>
              <span class="text-gray-500">План.дата поставки:</span>
              {{ record.date_planned_delivery }}
            </div>
          </div>
        </template>
        <TableActions
          v-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record"
        />
        <template
          v-if="column.dataIndex === 'is_closed'"
        >
          {{ $format(record.is_closed, 'yesno') }}
        </template>
        <StatusTag
          v-if="column.dataIndex === 'status'"
          :variant="getPrintStatusVariant(record.status.id)"
        >
          {{ record.status.title }}
        </StatusTag>
      </template>
    </QTable>
  </div>
</template>
<script>
import { getPrintStatusVariant } from '@/utils/utils';
import { getAxios } from '@/services/http/request';
import { PRINT_STATUSES } from '@/config/types';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';
import SelectPrintStatus from '@/components/form/SelectPrintStatus.vue';

export default {
  name: 'PrintMain',
  components: {
    SelectPrintStatus,
  },
  data() {
    return {
      printGroups: null,
      pagination: {},
      filters: {
        title: '',
        date: '',
        address: '',
        suz_order_id: null,
        status: [],
        bin: '',
        manager: '',
        barcode: '',
        gtin: '',
        is_closed: null,
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Наименование / Клиент / Дата заказа',
          dataIndex: 'title',
        },
        {
          title: 'Менеджер / План.дата поставки',
          dataIndex: 'managerDeliveryDate',
        },
        {
          title: 'Количество КМ',
          dataIndex: 'km_count',
        },
        {
          title: 'Закрыт',
          dataIndex: 'is_closed',
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
      ],
    };
  },

  computed: {
    actions() {
      return [
        {
          title: 'Просмотр',
          to: record => ({ name: 'PrintView', params: { id: record.id } }),
        },
        {
          title: 'Редактировать',
          to: record => ({ name: record.parent ? 'RePrintEdit' : 'PrintEdit', params: { id: record.id } }),
          condition: record => this.$canUse('manager') && PRINT_STATUSES.new.id === record.status.id,
        },
      ];
    },
  },
  created() {
    this.fetchPrintGroups();
  },

  methods: {
    debouncedSearch: debounce(function() {
      this.submitFilter();
    }, INPUT_DELAY),

    fetchPrintGroups(params = {}) {
      return getAxios('/print-groups', { ...params }).then((res) => {
        this.printGroups = res.data;
        this.printGroups.forEach((el) => {
          el.created_at = this.$format(el.created_at, 'datetime');
          el.date_planned_delivery = this.$format(el.date_planned_delivery, 'date');
        });
        this.pagination = res.meta;
      },
      );
    },
    submitFilter() {
      this.fetchPrintGroups(this.filters);
    },

    change(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },

    resetFilters() {
      this.filters = {
        title: '',
        date: '',
        address: '',
        suz_order_id: null,
        status: [],
        bin: '',
        manager: '',
        barcode: '',
        gtin: '',
        is_closed: null,
        page: 1,
      };
      this.submitFilter();
    },
    getPrintStatusVariant,
  },
};
</script>

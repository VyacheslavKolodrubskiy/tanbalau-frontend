<template>
  <AForm
    id="reprint_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem label="Организация клиента" name="counterparty_id">
          <AInput
            disabled
            size="large"
            :value="form.counterparty_id?.label"
          />
        </AFormItem>
      </ACol>
      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem label="Наименование" name="title">
          <AInput
            v-model:value="form.title"
            disabled
            size="large"
          />
        </AFormItem>
      </ACol>

      <ADivider />

      <ACol
        :xs="24"
        :xxl="18"
      >
        <AFormItem label="Комментарий" name="comment">
          <ATextarea
            v-model:value="form.comment"
            placeholder="Комментарий"
            rows="4"
            size="large"
          />
        </AFormItem>
      </ACol>
    </ARow>

    <ADivider />

    <ARow :gutter="24">
      <ACol
        :xs="18"
      >
        <AFormItem>
          <AInput
            v-model:value="searchQuery"
            allow-clear
            placeholder="Введите код маркировки для поиска"
            size="large"
          >
            <template #prefix>
              <QIcon type="search" />
            </template>
          </AInput>
        </AFormItem>

        <ATable
          :columns="columns"
          :data-source="filteredOrders"
          expand-row-by-click
          :indent-size="0"
          :pagination="false"
          row-key="id"
          :row-selection="{ selectedRowKeys: selectedCodes, onChange: onRowChange, fixed: true, checkStrictly: false }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'id'">
              {{ record.uiIndex }}
            </template>
            <template v-else-if="column.dataIndex === 'gtin'">
              <div
                v-if="record.code"
                class="break-all"
                v-html="record.code"
              />
            </template>
          </template>
        </ATable>
      </ACol>

      <ACol
        v-if="selectedCodesRowsFiltered.length"
        :xs="6"
      >
        <AAffix class="ant-affix--overflow-visible">
          <div class="ant-transfer-list w-100" style="height:300px">
            <div class="ant-transfer-list-header">
              <span class="ant-transfer-list-header-selected"><span class="ant-transfer-list-header-title">Выбрано: {{ selectedCodesRowsFiltered.length }}</span></span>
            </div>
            <div class="ant-transfer-list-body">
              <ul class="ant-transfer-list-content">
                <li
                  v-for="selected in selectedCodesRowsFiltered"
                  :key="selected.id"
                  class="ant-transfer-list-content-item cursor-default"
                  :title="selected.code"
                >
                  <span class="ant-transfer-list-content-item-text">{{ selected.code }}</span>
                </li>
              </ul>
            </div>
            <!--          <a href="#" @click.prevent>-->
            <!--            <QIcon class="text-danger" type="close" />-->
            <!--          </a>-->
          </div>
        </AAffix>
      </ACol>
    </ARow>
  </AForm>
</template>

<script>
import { vvRequired } from '@/utils/form-validators';
import { getAxios } from '@/services/http/request';
import { normalizeRePrintOrders } from '@/pages/suz/print/print-utils';
import { getTextWithHighlights } from '@/utils/utils';
import { PRINT_STATUSES } from '@/config/types';
import { fastClone } from '@/utils/object';

const formRules = {
  counterparty_id: vvRequired,
  title: vvRequired,
};
export default {
  props: {
    dataId: {
      type: String,
      default: '',
    },
  },
  emits: ['submit', 'restricted'],
  data() {
    this.formRules = formRules;
    return {
      form: {
        title: '',
        counterparty_id: null,
        comment: '',
      },
      parent: null,
      searchQuery: '',
      orders: [],
      selectedCodes: [],
      selectedCodesRows: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 100,
        },
        {
          title: 'GTIN/КМ',
          dataIndex: 'gtin',
        },
      ],
    };
  },
  computed: {
    isEditing() {
      return !!this.parent;
    },
    filteredOrders() {
      if (!this.searchQuery)
        return this.orders;

      const searchableArr = fastClone(this.orders.reduce((acc, order) => acc.concat(order.children), []));

      return searchableArr.filter((order) => {
        const found = order.code.includes(this.searchQuery);
        if (!found)
          return false;

        order.code = getTextWithHighlights(order.code, this.searchQuery);
        return true;
      });
    },
    selectedCodesRowsFiltered() {
      return this.selectedCodesRows.filter(this.isOrderHasCode);
    },
  },
  created() {
    this.readPrint();
  },
  methods: {
    isOrderHasCode(order) {
      return !!order.code;
    },

    onRowChange(selectedRowKeys, selectedRows) {
      this.selectedCodes = selectedRowKeys;
      this.selectedCodesRows = selectedRows;
    },

    readPrint() {
      getAxios(`reprint-groups/${this.dataId}`).then(({ data }) => {
        const isEditing = !!data.parent;
        if (isEditing) { // Если есть родитель - то это редактирование
          if (data.status.id !== PRINT_STATUSES.new.id) {
            // Можно редактировать "Повторную печать КМ" только со статусом "Новый"
            return this.$emit('restricted');
          }

          this.parent = data.parent;

          this.orders = normalizeRePrintOrders(data.parent.parent_print_orders);
          const selected = normalizeRePrintOrders(data.print_orders);
          this.selectedCodesRows = selected.reduce((acc, order) => acc.concat(order.children), []);
          this.selectedCodes = this.selectedCodesRows.map(row => row.id);
        } else {
          this.orders = normalizeRePrintOrders(data.print_orders);
        }

        this.form.title = isEditing ? data.title : `Повторная печать “${data.title}”`;
        this.form.counterparty_id = { label: data.counterparty.title, value: data.counterparty.id };
        this.form.comment = data.comment;
      });
    },

    serializeOrders() {
      return this.selectedCodesRowsFiltered
        .map(row => ({ id: row.id, order_id: row.order_id }));
    },
    handleFinish(values) {
      values.counterparty_id = values.counterparty_id.value;
      const data = {
        ...values,
        print_barcodes: this.serializeOrders(),
      };
      if (!this.isEditing)
        data.parent_id = this.dataId;

      this.$emit('submit', data);
    },

  },
};
</script>

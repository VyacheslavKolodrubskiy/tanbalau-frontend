<template>
  <AForm
    id="print_form"
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
        <AFormItem label="Организация клиента">
          <AInput
            disabled
            size="large"
            :value="form.counterparty_id.label"
          />
        </AFormItem>
      </ACol>
      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem label="Наименование" name="title">
          <AInput v-model:value="form.title" size="large" />
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

    <ADivider>Добавить новый заказ</ADivider>

    <template v-if="form.counterparty_id">
      <div
        v-for="(order, index) in orders"
        :key="order.id"
        class="mb-5"
      >
        <ARow :gutter="24">
          <ACol
            :xs="18"
          >
            <AFormItem label="Заказ на формирование КМ">
              <div class="bg-gray-200 rounded py-2 px-3 fz-16">
                #{{ order.id }} | {{ order.title }}
              </div>
            </AFormItem>
          </ACol>
          <ACol
            class="input-aligned"
            :xs="6"
          >
            <QBtn
              class="border-0 shadow-none fz-18"
              danger
              size="large"
              @click="tryRemoveFromOrders(index, order.originalId)"
            >
              <QIcon type="close" />
            </QBtn>
          </ACol>

          <ACol
            :xl="18"
            :xs="24"
          >
            <PrintOrdersTables :print-orders="order.items" />
          </ACol>
        </ARow>
      </div>

      <ARow :gutter="24">
        <ACol
          :sm="16"
          :xs="24"
          :xxl="18"
        >
          <AFormItem label="Заказ на формирование КМ">
            <SelectOrder
              v-model:value="orderSelectedId"
              :disabled="!form.counterparty_id"
              :filters="searchOrderFilters"
              size="large"
              @change="handleOrderChange"
            />
          </AFormItem>
        </ACol>
        <ACol
          class="input-aligned"
          :sm="8"
          :xs="24"
          :xxl="6"
        >
          <QBtn
            :disabled="!orderSelected"
            size="large"
            type="success"
            @click="addToOrders"
          >
            Добавить заказ
          </QBtn>
        </ACol>
      </ARow>
    </template>
    <AEmpty v-else>
      <template #description>
        Добавление заказа будет доступно после выбора организации клиента
      </template>
    </AEmpty>
    <ABackTop />
  </AForm>
</template>

<script>
import { mapState } from 'pinia';
import { vvRequired } from '@/utils/form-validators';
import { ORDER_STATUSES, PRINT_STATUSES } from '@/config/types';
import { deleteAxios, getAxios } from '@/services/http/request';
import { normalizeOrder, normalizePrintOrders } from '@/pages/suz/print/print-utils';
import PrintOrdersTables from '@/pages/suz/print/components/PrintOrdersTables.vue';
import { numOr0 } from '@/utils/utils';
import { useUserStore } from '@/stores/user.store';

const formRules = {
  title: vvRequired,
};
export default {
  components: { PrintOrdersTables },
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
      orderSelectedId: null,
      orderSelected: null,

      orders: [],
    };
  },
  computed: {
    ...mapState(useUserStore, {
      user: 'current',
    }),
    isEditing() {
      return !!this.dataId;
    },
    searchOrderFilters() {
      return {
        available: 1,
        status: [ORDER_STATUSES.closed.id, ORDER_STATUSES.ready.id],
      };
    },
  },
  created() {
    this.setClientCounterpartyId();

    if (this.isEditing)
      this.readPrint();
  },
  methods: {
    setClientCounterpartyId() {
      if (this.$canUse('client'))
        this.form.counterparty_id = { value: this.user.counterparty?.id, label: this.user.counterparty?.title };
    },
    readPrint() {
      getAxios(`print-groups/${this.dataId}`).then(({ data }) => {
        if (data.status.id !== PRINT_STATUSES.new.id) {
          // Можно редактировать "Печать КМ" только со статусом "Новый"
          return this.$emit('restricted');
        }
        this.form.title = data.title;
        this.form.counterparty_id = { label: data.counterparty.title, value: data.counterparty.id };
        this.form.comment = data.comment;

        this.orders = normalizePrintOrders(data.print_orders);
      });
    },

    removeFromOrders(index) {
      this.orders.splice(index, 1);
    },

    tryRemoveFromOrders(index, orderId) {
      if (this.isEditing) {
        deleteAxios(`print-groups/${this.$route.params.id}/orders/${orderId}`).then((res) => {
          this.$message.success('Заказ удалён');
          this.removeFromOrders(index);
        });
      } else {
        this.removeFromOrders(index);
      }
    },

    addToOrders() {
      if (this.orders.some(order => order.id === this.orderSelected.id))
        return this.$message.warning('Вы уже добавили этот заказ');

      this.orders.push(this.orderSelected);
      this.orderSelectedId = null;
      this.orderSelected = null;
    },

    handleOrderChange(value, fullValue) {
      this.orderSelected = normalizeOrder(fullValue);
    },

    // Send to backend
    serializeOrders() {
      return this.orders.reduce((acc, order) => {
        const orderItems = order.items
          .filter(orderItem => numOr0(orderItem.toPrint) > 0)
          .map(orderItem => ({
            order_id: orderItem.order_id,
            order_item_id: orderItem.order_item_id,
            gtin: orderItem.gtin,
            to_print: orderItem.toPrint,
            ...this.isEditing && { id: orderItem.originalId },
          }));
        acc.push(...orderItems);
        return acc;
      }, []);
    },

    getToPrintTotal(items) {
      return items.reduce((acc, item) => numOr0(item.toPrint) + acc, 0);
    },

    validateOrders() {
      let msg;
      if (this.orders.length) {
        const totalToPrint = this.orders.reduce((acc, item) => this.getToPrintTotal(item.items) + acc, 0);
        if (totalToPrint === 0)
          msg = 'Вы не добавили ни одного GTIN на печать';
      } else {
        msg = 'Вы не добавили ни одного заказа на печать';
      }

      if (!msg)
        return true;

      this.$message.warning(msg);

      return false;
    },

    handleFinish(values) {
      values.counterparty_id = this.form.counterparty_id.value;
      if (!this.validateOrders())
        return;
      this.$emit('submit', {
        ...values,
        orders: this.serializeOrders(),
      });
    },

  },
};
</script>

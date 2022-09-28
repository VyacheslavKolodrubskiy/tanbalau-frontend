<template>
  <div v-if="state.order">
    <APageHeader
      :title="`Просмотр “#${state.order.id} | ${state.order.title} (${state.order.suz_order_id})”`"
      @back="() => $router.go(-1)"
    >
      <template #tags>
        <StatusTag :variant="getOrderStatusVariant(state.order.status.id)">
          {{ state.order.status.title }}
        </StatusTag>
      </template>
      <template #extra>
        <template v-if="showEdit">
          <RouterLink class="ant-btn ant-btn-primary ant-btn-lg" :to="{ name: 'OrderEdit' }">
            Редактировать
          </RouterLink>
          <QBtn
            size="large"
            type="success"
            @click="readOrderStatuses"
          >
            Сформировать КМ
          </QBtn>
        </template>

        <QBtn
          v-if="showClose"
          danger
          size="large"
          type="primary"
          @click="readOrderClose"
        >
          Закрыть заказ
        </QBtn>
      </template>
    </APageHeader>

    <ARow :gutter="[24, 20]">
      <ACol
        :lg="14"
        :xs="24"
        :xxl="16"
      >
        <ACard>
          <div v-if="state.order.declineReason" class="mb-6">
            <h2 class="section-title">
              Причина отклонения
            </h2>
            <div class="rejected-reason">
              {{ state.order.declineReason }}
            </div>
          </div>
          <h2 class="section-title">
            Товары
          </h2>
          <QTable
            class="marking-code-view-table table--total-row"
            :columns="columns"
            :data-source="orderItemsWithTotal"
            row-key="id"
          >
            <template #index="_, record">
              <template v-if="isLastRow(record)">
                Итого
              </template>
              <template v-else>
                {{ record.index + 1 }}
              </template>
            </template>
            <template
              v-for="col in ['number', 'gtin', 'quantity']"
              :key="col"
              #[col]="text, record"
            >
              <AInput v-if="record.editable" style="margin: -5px 0" />
              <template v-else>
                {{ text }}
              </template>
            </template>
          </QTable>
        </ACard>
      </ACol>

      <ACol
        :lg="10"
        :xs="24"
        :xxl="8"
      >
        <ACard>
          <h2 class="block-info__title">
            Данные производства
          </h2>
          <div class="block-info__items">
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Способ формирования индивидуального серийного номера
              </h3>
              <h5 class="block-info__item-subtitle">
                Автоматически
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Способ изготовления
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ state.order.createMethodType.title }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Страна производства
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ state.order.country.title }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Способ выпуска товаров в оборот
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ state.order.releaseMethodType.title }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Организация
              </h3>
              <h5 class="block-info__item-subtitle">
                <RouterLink
                  :to="{
                    name: organizationLinkName,
                    params: { id: state.order.counterparty.id },
                  }"
                >
                  {{ `“${state.order.counterparty.title}”` }}
                </RouterLink>
                ({{ state.order.counterparty.email }} | {{ $format(state.order.counterparty.phone, "phone") }})
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Контактное лицо
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ state.order.contactPerson }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Автор
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ state.order.user.name }} ({{ state.order.user.email }} |
                {{ $format(state.order.user.phone, "phone") }})
              </h5>
            </div>
            <ATimeline class="mt-7">
              <ATimelineItem v-for="orderLog in state.order.logs" :key="orderLog.id">
                <div class="fz-12 text-gray-500">
                  {{ $format(orderLog.created_at, "datetime") }}
                </div>
                <div>{{ `“${orderLog.title}”` }}</div>
              </ATimelineItem>
            </ATimeline>
          </div>
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import { ORDER_STATUSES, ROLES } from '@/config/types';
import { getOrderStatusVariant, numOr0 } from '@/utils/utils';
import { getAxios } from '@/services/http/request';
import { canUse } from '@/utils/permissions';
import { useUserStore } from '@/stores/user.store';

interface Status {
  id: number
  title: string
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
  counterparty: Counterparty
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

const state = reactive({
  order: null as Order | null,
  columnsOne: [
    {
      title: '№',
      dataIndex: 'index',
      width: '8%',
    },
    {
      title: 'GTIN',
      dataIndex: 'gtin',
      width: '30%',
    },
    {
      title: 'Количество КМ',
      dataIndex: 'quantity',
      width: '30%',
    },
  ] as TableColumnProps[],
  columnsTwo: [
    {
      title: '№',
      dataIndex: 'index',
      width: '8%',
    },
    {
      title: 'GTIN',
      dataIndex: 'gtin',
      width: '30%',
    },
    {
      title: 'Кол-во КМ в заказе',
      dataIndex: 'quantity',
      width: '30%',
    },
    {
      title: 'Сформировано',
      dataIndex: 'usedCodes',
    },
    {
      title: 'Отклонено',
      dataIndex: 'leftCodes',
    },
  ] as TableColumnProps[],
  columnsThree: [
    {
      title: '№',
      dataIndex: 'index',
      width: '8%',
    },
    {
      title: 'GTIN',
      dataIndex: 'gtin',
      width: '30%',
    },
    {
      title: 'Количество КМ/Список КМ',
      dataIndex: 'quantity',
      width: '30%',
    },
  ] as TableColumnProps[],
});

const route = useRoute();
const userStore = useUserStore();

const organizationLinkName = computed(() => {
  return userStore.current?.role?.id === ROLES.client.id ? 'OrganizationsView' : 'CatalogOrganizationsView';
});

const orderItems = computed((): OrderItem[] => state.order?.orderItems ?? []);

const totalRow = computed((): OrderItem => {
  return {
    id: 0,
    index: orderItems.value.length,
    gtin: orderItems.value.length,
    quantity: getTotal('quantity'),
    usedCodes: getTotal('usedCodes'),
    leftCodes: getTotal('leftCodes'),
  };
});

const orderItemsWithTotal = computed(() => {
  return orderItems.value.concat(totalRow.value);
});

const showEdit = computed(() => {
  return state.order?.status.id === ORDER_STATUSES.created.id && canUse(['manager', 'client']);
});

const showClose = computed(() => {
  return state.order?.status.id === ORDER_STATUSES.ready.id && canUse(['manager', 'client']);
});

const columns = computed(() => {
  switch (state.order?.status.id) {
    case 0:
    case 1:
    case 3:
      return state.columnsOne;
    case 2:
      return state.columnsTwo;
    case 4:
    case 5:
      return state.columnsThree;
    default:
      return state.columnsOne;
  }
});

onMounted(() => readOrder());

function readOrder() {
  return getAxios(`/orders/${route.params.id}`).then((res) => {
    state.order = res.data;
    if (state.order) {
      state.order.orderItems = state.order.orderItems.map((el, idx) => {
        if (Object.prototype.hasOwnProperty.call(el, 'usedCodes')) {
          if (el.usedCodes === 0 && el.leftCodes === 0)
            el.leftCodes = el.quantity;
        }

        return {
          ...el,
          index: idx + 1,
        };
      });
    }
  });
}

function readOrderStatuses() {
  getAxios(`/orders/${route.params.id}/manual-update`).then(() => {
    notification.success({
      message: 'КМ сформирован',
    });
    readOrder();
  });
}

function readOrderClose() {
  getAxios(`/orders/${route.params.id}/close`).then(() => {
    notification.success({
      message: 'Заказ закрыт',
    });
    readOrder();
  });
}

function getTotal(key) {
  return orderItems.value.reduce((acc, item) => numOr0(item[key]) + acc, 0);
}

function isLastRow(record) {
  return orderItems.value.length === record.index;
}
</script>

<style scoped lang="scss">
.block-info {
  &__title {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 29px;
    color: #323136;
  }
  &__items {
    margin-top: 28px;
  }
  &__item {
    &:not(:last-child) {
      margin-bottom: 21px;
    }
  }
  &__item-title {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #262626;
  }
  &__item-subtitle {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #4f4f4f;
    margin: 0;
    span {
      color: #2d9cdb;
    }
  }
}
.rejected-reason {
  font-family: SFProText;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #333333;
}
.total {
  width: 100%;
  max-width: 80.47px;
}
.total-gtin {
  width: 100%;
  max-width: 301.8px;
}
.total-km {
  width: 100%;
  max-width: 301.8px;
}
.cell {
  font-style: normal;
  font-weight: 900;
  font-size: 14px;
  line-height: 22px;
  color: #262626;
}
</style>

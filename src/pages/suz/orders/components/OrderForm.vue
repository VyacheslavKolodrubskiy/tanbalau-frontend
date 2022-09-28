<template>
  <AForm
    id="order_form"
    layout="vertical"
    :model="state.form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Организация Клиента">
          <SelectCounterparty
            v-model:value="state.form.counterparty_id"
            disabled
            label-in-value
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="18"
        :xs="0"
      />

      <ACol
        :lg="16"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Наименование" name="title">
          <AInput v-model:value="state.form.title" size="large" />
        </AFormItem>
      </ACol>

      <ADivider />

      <ACol
        :xs="24"
      >
        <h2 class="section-title">
          Данные производства
        </h2>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Контактное лицо" name="contactPerson">
          <AInput v-model:value="state.form.contactPerson" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Способ формирования индивидуального серийного номера" required>
          <AInput
            disabled
            placeholder="Автоматически"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :xs="0"
      />

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Способ изготовления" name="create_method_type_id">
          <SelectCreatedMethod
            v-model:value="state.form.create_method_type_id"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Страна производства" name="country_id">
          <SelectCountry v-model:value="state.form.country_id" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem
          label="Способ выпуска товаров в оборот"
          name="release_method_type_id"
        >
          <SelectReleaseMethod
            v-model:value="state.form.release_method_type_id"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ADivider />

      <ACol
        :xs="24"
      >
        <h2 class="section-title">
          Товары
        </h2>
      </ACol>
    </ARow>
    <QTable
      :columns="columns"
      :data-source="state.formData"
      :row-class-name="'marking-code-add-table'"
    >
      <template #bodyCell="{ column, record, index }">
        <AFormItem
          v-if="column.dataIndex === 'gtin'"
          v-maska="'0#############'"
          :name="['products', index, 'gtin']"
          :rules="gtinRule"
        >
          <AInput
            v-model:value="record.gtin"
          />
        </AFormItem>
        <AFormItem
          v-if="column.dataIndex === 'quantity'"
          :name="['products', index, 'quantity']"
          :rules="quantityRule"
        >
          <AInput
            v-model:value="record.quantity"
          />
        </AFormItem>
        <AFormItem v-if="column.dataIndex === 'operation'">
          <div class="text-right">
            <a @click="onDelete(record.key)">
              <QIcon style="color: red" type="close" />
            </a>
          </div>
        </AFormItem>
      </template>
      <template #footer>
        <QBtn
          v-if="!isGtinLimitReached"
          class="mt-3"
          type="primary"
          @click="handleAdd"
        >
          <QIcon type="plus" />
          Добавить
        </QBtn>
      </template>
    </QTable>
  </AForm>
</template>

<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue';
import type { Rule, RuleObject } from 'ant-design-vue/es/form';
import type { LabeledValue } from 'ant-design-vue/es/select';
import type { ValidationRules } from '@/types';
import { canUse } from '@/utils/permissions';
import { getAxios } from '@/services/http/request';
import { vvRequired } from '@/utils/form-validators';
import { useUserStore } from '@/stores/user.store';

interface Form {
  counterparty_id: LabeledValue | null
  title: string
  contactPerson: string
  release_method_type_id: string | number
  create_method_type_id: string | number
  country_id: string | number
  products: object[]
}

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
  counterparty: {
    id: number
    title: string
  }
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

interface Props {
  dataId?: string | string[]
}
// FIX ME
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataId = '' } = defineProps<Props>();

const emit = defineEmits<{ (e: 'submit', values: object[]): void }>();

const state = reactive({
  form: {
    counterparty_id: null,
    title: '',
    contactPerson: '',
    release_method_type_id: '',
    create_method_type_id: '',
    country_id: '',
    products: [] as OrderItem[],
  } as Form,
  count: 1,
  formData: [] as OrderItem[],
});

const userStore = useUserStore();
const user = computed(() => userStore.current);
const isEditing = computed(() => !!dataId);

const columns = computed((): TableColumnProps[] => {
  return [
    {
      title: '№',
      dataIndex: 'key',
      width: 65,
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
    {
      dataIndex: 'operation',
    },
  ];
});

const isGtinLimitReached = computed(() => {
  return state.form.products.length >= 100;
});

const gtinRule = computed((): Rule[] => {
  return [
    vvRequired,
    {
      len: 14,
      message: 'Поле gtin должно состоять из 14 знаков',
    },
    {
      validator: gtinValidator,
      trigger: 'change',
    },
  ];
});

const quantityRule = computed((): Rule[] => {
  return [
    vvRequired,
    {
      validator: quantityValidator,
      trigger: 'change',
    },
  ];
});

const formRules = computed((): ValidationRules => {
  return {
    title: vvRequired,
    contactPerson: vvRequired,
    release_method_type_id: vvRequired,
    create_method_type_id: vvRequired,
    country_id: vvRequired,
  };
});

function setClientCounterpartyId() {
  if (canUse('client') && user.value && 'counterparty' in user.value)
    state.form.counterparty_id = { value: user.value?.counterparty?.id as number, label: user.value?.counterparty?.title };
}

function readOrder() {
  getAxios(`orders/${dataId}`).then(({ data }: { data: Order }) => {
    state.form.counterparty_id = { value: data?.counterparty?.id, label: data?.counterparty?.title };
    state.form.title = data?.title;
    state.form.contactPerson = data?.contactPerson;
    state.form.release_method_type_id = data?.releaseMethodType?.id;
    state.form.create_method_type_id = data?.createMethodType?.id;
    state.form.country_id = data?.country?.id;
    state.form.products = data.orderItems ?? [];
    state.formData = data.orderItems ?? [];
    state.formData.forEach((el, i) => {
      el.key = i + 1;
      el.quantity = `${el.quantity}`;
    });
  });
}

function handleFinish(values) {
  values.products = state.form.products;
  values.counterparty_id = state.form.counterparty_id?.value;
  emit('submit', values);
}

function handleAdd() {
  const newData = {
    key: state.formData?.length + 1,
    templateId: 1,
    gtin: '',
    quantity: '',
    serialNumberType: 'OPERATOR',
  };
  state.formData = [...state.formData, newData] ?? [newData];
  state.form.products = state.formData;
}

async function gtinValidator(_rule: RuleObject, value: string) {
  // eslint-disable-next-line prefer-promise-reject-errors
  return state.formData.filter(el => el.gtin === value).length > 1 ? Promise.reject('Поле gtin должно быть уникальным') : Promise.resolve();
}

async function quantityValidator(_rule: RuleObject, value: number) {
  // eslint-disable-next-line prefer-promise-reject-errors
  return value > 150000 ? Promise.reject('Количество кодов маркировки не может превышать 150000') : Promise.resolve();
}

function onDelete(key: number) {
  const dataSource = [...state.formData];
  state.formData = dataSource.filter(item => item.key !== key);
  state.formData.forEach((el, i) => {
    state.count = i + 1;
    el.key = state.count;
  });
  state.form.products = state.formData;
}

onMounted(() => {
  state.form.counterparty_id = { value: user.value?.counterparty?.id as number, label: user.value?.counterparty?.title };

  setClientCounterpartyId();

  if (isEditing.value)
    readOrder();
});
</script>

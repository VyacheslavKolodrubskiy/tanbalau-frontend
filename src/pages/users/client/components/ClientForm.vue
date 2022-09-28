<template>
  <AForm
    id="client_form"
    layout="vertical"
    :model="state.form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Организация" name="counterparty_id">
          <SelectCounterparty
            v-model:value="state.form.counterparty_id"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="ФИО" name="name">
          <AInput v-model:value="state.form.name" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="ИИН" name="iin">
          <AInput
            v-model:value="state.form.iin"
            v-maska="'############'"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :xs="0"
      />

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Почта" name="email">
          <AInput v-model:value="state.form.email" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Пароль" name="password">
          <AInputPassword v-model:value="state.form.password" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Телефон" name="phone">
          <AInput
            v-model:value="state.form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="state.formattedPhone = $event.target.dataset.maskRawValue"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="12"
        :md="16"
        :xs="24"
      >
        <AFormItem label="Комментарий" name="note">
          <ATextarea
            v-model:value="state.form.note"
            :rows="4"
            size="large"
          />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import { mask } from 'maska';
import { getAxios } from '@/services/http/request';
import { vvBinIin, vvPhone, vvRequired } from '@/utils/form-validators';
import type { ValidationRules } from '@/types';

interface Form {
  counterparty_id: number | null
  name: string
  iin: string
  email: string
  password: string
  phone: string | number
  note: string
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
    name: '',
    iin: '',
    email: '',
    password: '',
    phone: '',
    note: '',
  } as Form,
  formattedPhone: '',
});

const isEditing = computed(() => !!dataId);
const formRules = computed<ValidationRules>(() => {
  return {
    counterparty_id: vvRequired,
    name: vvRequired,
    iin: [
      vvRequired,
      vvBinIin,
    ],
    email: vvRequired,
    phone: [
      vvRequired,
      vvPhone,
    ],
    password: {
      required: !isEditing.value,
      message: vvRequired.message,
    },
  };
});

function readClient() {
  return getAxios(`users/customer/${dataId}`).then(({ data }) => {
    state.form.counterparty_id = data.counterpartyUser?.id;
    state.form.name = data.name;
    state.form.iin = data.iin;
    state.form.email = data.email;
    state.form.phone = mask(`${data.phone}`, '+7 (###) ### ## ##', undefined);
    state.form.note = data.note;
  });
}

function handleFinish(values) {
  values.phone = state.formattedPhone ? `7${state.formattedPhone}` : values.phone;
  emit('submit', values);
}

onMounted(() => {
  if (isEditing.value)
    readClient();
});
</script>

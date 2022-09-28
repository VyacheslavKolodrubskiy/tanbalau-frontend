<template>
  <AForm
    id="profile_form"
    ref="profileForm"
    layout="vertical"
    :model="state.form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="ФИО" name="name">
          <AInput v-model:value="state.form.name" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
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

      <ACol :md="8" :xs="0" />

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="Почта" name="email">
          <AInput v-model:value="state.form.email" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="Пароль" name="password">
          <AInputPassword v-model:value="state.form.password" size="large" />
        </AFormItem>
      </ACol>

      <ACol :md="16" :xs="24">
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
import type { FormExpose } from 'ant-design-vue/lib/form/Form';
import { getAxios } from '@/services/http/request';
import { vvPhone, vvRequired } from '@/utils/form-validators';
import type { ValidationRules } from '@/types';

interface Form {
  name: string
  email: string
  password: string
  phone: string
  note: string
}

const emit = defineEmits<{ (e: 'submit', values: object[]): void }>();

const state = reactive({
  form: {
    name: '',
    email: '',
    password: '',
    phone: '',
    note: '',
  } as Form,
  formattedPhone: '',
});

const profileForm = ref();

onMounted(() => {
  readProfile();
});

const isEmptyInputPassword = computed((): boolean => {
  return !state.form.password;
});

const formRules = computed((): ValidationRules => {
  return {
    name: vvRequired,
    email: vvRequired,
    phone: [
      vvRequired,
      vvPhone,
    ],
    password: {
      required: !isEmptyInputPassword.value,
      message: vvRequired.message,
    },
  };
});

watch(() => state.form.password, (newVal) => {
  if (newVal)
    return;

  nextTick()
    .then(() => (profileForm?.value as FormExpose).clearValidate('password'));
});

function readProfile() {
  return getAxios('profile').then(({ data }) => {
    state.form.name = data.name;
    state.form.email = data.email;
    state.form.phone = mask(`${data.phone}`, '+7 (###) ### ## ##', undefined);
    state.form.note = data.note;
  });
}

function handleFinish(values: any) {
  values.phone = state.formattedPhone ? `7${state.formattedPhone}` : values.phone;
  emit('submit', values);
}
</script>

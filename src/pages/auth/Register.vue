<template>
  <ACard class="auth__register">
    <AForm
      ref="formRef"
      layout="vertical"
      :model="state.form"
      :rules="formRules"
      @finish="handleFinish"
    >
      <h1 class="text-center fz-24 mb-5">
        Регистрация
      </h1>
      <ARow :gutter="60">
        <ACol :lg="12">
          <AFormItem label="ФИО" name="name">
            <AInput
              v-model:value="state.form.name"
              :disabled="loadingState.isLoading.value"
              placeholder="Иванов Иван"
              size="large"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="ИИН" name="iin">
            <AInput
              v-model:value="state.form.iin"
              v-maska="'############'"
              :disabled="loadingState.isLoading.value"
              placeholder="960306123123"
              size="large"
              @input="onInput"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="E-mail" name="email">
            <AInput
              v-model:value="state.form.email"
              :disabled="loadingState.isLoading.value"
              placeholder="erp@mail.ru"
              size="large"
              @input="onInput"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="Телефон" name="phone">
            <AInput
              v-model:value="state.form.phone"
              v-maska="'+7 (###) ### ## ##'"
              :disabled="loadingState.isLoading.value"
              placeholder="+7 (###) ### ## ##"
              size="large"
              @input="onInput"
              @maska="state.formattedPhone = $event.target.dataset.maskRawValue"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="Пароль" name="password">
            <AInputPassword
              v-model:value="state.form.password"
              :disabled="loadingState.isLoading.value"
              placeholder="Пароль"
              size="large"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="Повторите пароль" name="password_confirmation">
            <AInputPassword
              v-model:value="state.form.password_confirmation"
              :disabled="loadingState.isLoading.value"
              placeholder="Повторите пароль"
              size="large"
            />
          </AFormItem>
        </ACol>
      </ARow>
      <ARow
        align="middle"
        :gutter="24"
        justify="space-between"
        type="flex"
      >
        <ACol>
          <RouterLink
            v-if="state.showRecoverLink"
            class="text-underline font-italic"
            :to="{ name: 'Recover'}"
          >
            Восстановить пароль
          </RouterLink>
        </ACol>
        <ACol>
          <QBtn
            v-if="loadingState.isLoading"
            html-type="submit"
            :loading="loadingState.isLoading.value"
            size="large"
            type="primary"
          >
            Сохранить
          </QBtn>
        </ACol>
      </ARow>
    </AForm>
  </ACard>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { Button } from 'ant-design-vue';
import { vvBinIin, vvPhone, vvRequired } from '@/utils/form-validators';
import type { ValidationRules } from '@/types';
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';
import type { IAuth } from '@/models/auth.model';
import { Executor } from '@/network/executor';
import { AuthService } from '@/services/auth.service';
import { useLoading } from '@/composables/useLoading';

interface Errors {
  email: string[]
  iin: string[]
  phone: string[]
}

const formRef = ref<FormInstance>();

const formRules: ValidationRules = {
  counterparty_id: vvRequired,
  name: vvRequired,
  iin: [
    vvRequired,
    vvBinIin,
    {
      validator: validateUniqueFields,
    },
  ],
  email: [
    vvRequired,
    {
      validator: validateUniqueFields,
    },
  ],
  phone: [
    vvRequired,
    vvPhone,
    {
      validator: validateUniqueFields,
    },
  ],
  password: vvRequired,
  password_confirmation: [
    vvRequired,
    {
      validator: validatePassword,
    },
  ],
};
const state = reactive({
  form: {
    name: '',
    iin: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  } as IAuth,
  showRecoverLink: false,
  formattedPhone: '',
  errors: null as Errors | null,
});

const route = useRoute();
const router = useRouter();
const loadingState = useLoading();

async function validatePassword(_rule: any, value: string) {
  // eslint-disable-next-line prefer-promise-reject-errors
  return state.form.password !== value ? Promise.reject('Пароли не совпадают') : Promise.resolve();
}

async function validateUniqueFields(_rule: any) {
  switch (_rule.field) {
    case 'iin':
      // eslint-disable-next-line prefer-promise-reject-errors
      return state.errors?.iin ? Promise.reject() : Promise.resolve();
    case 'phone':
      // eslint-disable-next-line prefer-promise-reject-errors
      return state.errors?.phone ? Promise.reject() : Promise.resolve();
    case 'email':
      // eslint-disable-next-line prefer-promise-reject-errors
      return state.errors?.email ? Promise.reject() : Promise.resolve();
  }
}

function onInput() {
  if (state.errors) {
    state.errors = null;
    formRef.value?.validate();
  }
}

function handleFinish(values: IAuth) {
  values.phone = state.formattedPhone ? `7${state.formattedPhone}` : values.phone;

  Executor.run({
    request: AuthService.register(values),
    loadingState,
    notificationConfig: {
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => router.push({ name: 'Recover' }),
          },
          { default: () => 'Восстановить пароль' },
        ),
    },
    onResult() {
      const routeLocation = route.query.redirect ? { path: route.query.redirect } : { name: DEFAULT_LOGGED_OUT_ROUTE_NAME };
      router.push(routeLocation);
    },
    onError(err) {
      state.errors = err?.error?.data?.errors;
      formRef.value?.validate();
      state.showRecoverLink = true;
    },
  });
}
</script>

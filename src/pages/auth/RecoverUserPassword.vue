<template>
  <ACard class="auth__recover">
    <h1 class="text-center fz-24 mb-4 pb-5">
      Восстановление пароля Пользователя
    </h1>

    <AForm
      ref="formRef"
      layout="vertical"
      :model="state.form"
      :rules="formRules"
      @finish="handleFinish"
    >
      <AFormItem class="mb-5 pb-5" label="Сброс пароля">
        <ARadioGroup v-model:value="state.isRememberEmail" :disabled="state.isSuccessRecovery">
          <ARadio :value="true">
            Я помню e-mail
          </ARadio>
          <ARadio :value="false">
            Мой ИИН есть в системе, но я не помню e-mail
          </ARadio>
        </ARadioGroup>
      </AFormItem>

      <AFormItem
        v-if="state.isRememberEmail"
        name="email"
      >
        <AInput
          v-model:value="state.form.email"
          :disabled="state.isSuccessRecovery"
          placeholder="Введите email"
          size="large"
          @input="onInput"
        />
      </AFormItem>

      <AFormItem
        v-else
        name="iin"
      >
        <AInput
          v-model:value="state.form.iin"
          v-maska="'############'"
          :disabled="state.isSuccessRecovery"
          placeholder="Введите ИИН"
          size="large"
          @input="onInput"
        />
      </AFormItem>

      <div class="d-flex justify-content-end align-items-center mt-5">
        <QBtn
          :disabled="state.isSuccessRecovery"
          html-type="submit"
          size="large"
          type="primary"
        >
          Восстановить пароль
        </QBtn>
      </div>
      <div class="text-center mt-5">
        <span class="fz-12">
          Если у Вас не получается сбросить пароль, <br>
          обратитесь в Техническую поддержку <a href="mailto:support@tanbalau.kz">support@tanbalau.kz</a>
        </span>
      </div>
    </AForm>
  </ACard>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { vvBinIin, vvRequired } from '@/utils/form-validators';
import { Executor } from '@/network/executor';
import { AuthService } from '@/services/auth.service';
import { useLoading } from '@/composables/useLoading';

interface Form {
  email: string
  iin: string
}

const formRules = {
  email: [
    vvRequired,
    {
      validator: validateUniqueFields,
    },
  ],
  iin: [
    vvRequired,
    vvBinIin,
    {
      validator: validateUniqueFields,
    },
  ],
};

const formRef = ref<FormInstance>();

const state = reactive({
  form: {
    email: '',
    iin: '',
  } as Form,
  isRememberEmail: true,
  isSuccessRecovery: false,
  iinError: false,
  emailError: false,
});

const loadingState = useLoading();

async function validateUniqueFields(_rule: any) {
  switch (_rule.field) {
    case 'iin':
      // eslint-disable-next-line prefer-promise-reject-errors
      return state.iinError ? Promise.reject() : Promise.resolve();
    case 'email':
      // eslint-disable-next-line prefer-promise-reject-errors
      return state.emailError ? Promise.reject() : Promise.resolve();
  }
}

function onInput() {
  if (state.iinError || state.emailError) {
    state.iinError = false;
    state.emailError = false;
    formRef.value?.validate();
  }
}

function handleFinish(values: Form) {
  if (state.isRememberEmail) {
    Executor.run({
      request: AuthService.recoverByEmail({ email: values.email }),
      loadingState,
      onResult() {
        state.isSuccessRecovery = true;
      },
      onError(err) {
        state.emailError = !!err.error.data.errors;
        formRef.value?.validate();
      },
    });
  } else {
    Executor.run({
      request: AuthService.recoverByIin({ iin: values.iin }),
      loadingState,
      onResult() {
        state.isSuccessRecovery = true;
      },
      onError(err) {
        state.emailError = !!err.error.data.errors;
        formRef.value?.validate();
      },
    });
  }
}

</script>

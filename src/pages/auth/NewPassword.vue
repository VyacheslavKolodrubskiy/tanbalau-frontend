<template>
  <ACard class="auth__recover auth_recover-new">
    <h1 class="text-center fz-24">
      Восстановление пароля Пользователя
    </h1>

    <div class="fz-16 text-center mb-5">
      Введите новый пароль для почты {{ state.email }}
    </div>

    <AForm
      ref="formRef"
      layout="vertical"
      :model="state.form"
      :rules="formRules"
      @finish="handleFinish"
    >
      <ARow :gutter="60">
        <ACol :lg="12">
          <AFormItem
            class="font-italic"
            label="Пароль"
            name="password"
          >
            <AInputPassword
              v-model:value="state.form.password"
              placeholder="123123123"
              size="large"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem
            class="font-italic"
            label="Повторите пароль"
            name="password_confirmation"
          >
            <AInputPassword
              v-model:value="state.form.password_confirmation"
              placeholder="Повторите пароль"
              size="large"
            />
          </AFormItem>
        </ACol>
      </ARow>

      <div class="d-flex justify-content-end align-items-center my-5">
        <QBtn
          :disabled="state.isSuccessRecovery"
          html-type="submit"
          size="large"
          type="primary"
        >
          Сохранить
        </QBtn>
      </div>
      <div class="text-center mt-5 pb-3">
        <span class="fz-12">
          Если у Вас не получается сбросить пароль, <br>
          обратитесь в Техническую поддержку <a href="mailto:support@tanbalau.kz">support@tanbalau.kz</a>
        </span>
      </div>
    </AForm>
  </ACard>
</template>

<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form';
import { vvRequired } from '@/utils/form-validators';
import type { ValidationRules } from '@/types';
import { Executor } from '@/network/executor';
import { AuthService } from '@/services/auth.service';

interface Form {
  password: string
  password_confirmation: string
}

const formRules: ValidationRules = {
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
    password: '',
    password_confirmation: '',
  } as Form,
  token: '',
  email: '',
  isSuccessRecovery: false,
});

async function validatePassword(_rule: RuleObject, value: string) {
  // eslint-disable-next-line prefer-promise-reject-errors
  return state.form.password !== value ? Promise.reject('Пароли не совпадают') : Promise.resolve();
}

const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (route.query.token)
    state.token = route.query.token as string;

  state.email = route.query.email as string;
});

function handleFinish(values: Form) {
  Executor.run({
    request: AuthService.changePassword({
      token: state.token,
      password: values.password,
      password_confirmation: values.password_confirmation,
    }),
    onResult() {
      state.isSuccessRecovery = true;
      router.push({ name: 'Login' });
    },
  });
}
</script>

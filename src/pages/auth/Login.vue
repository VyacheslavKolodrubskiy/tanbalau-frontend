<template>
  <ACard class="auth__login">
    <AForm
      layout="vertical"
      :model="state.form"
      :rules="formRules"
      @finish="handleFinish"
    >
      <h1 class="text-center fz-24" :class="{ 'm-0': state.isFieldsInvalid }">
        Авторизация
      </h1>
      <div v-if="state.isFieldsInvalid" class="text-danger text-center fz-16 mb-2">
        Неверный логин или пароль
      </div>
      <AFormItem
        label="E-mail"
        name="email"
        :validate-status="checkValidateStatus"
      >
        <AInput
          v-model:value="state.form.email"
          placeholder="Логин"
          size="large"
          @input="onInput"
        />
      </AFormItem>

      <AFormItem
        label="Пароль"
        name="password"
        :validate-status="checkValidateStatus"
      >
        <AInputPassword
          v-model:value="state.form.password"
          placeholder="Пароль"
          size="large"
          @input="onInput"
        />
      </AFormItem>

      <div class="d-flex justify-content-between align-items-center mt-4">
        <div class="d-flex flex-column">
          <RouterLink class="text-underline font-italic" :to="{ name: 'Register'}">
            Регистрация
          </RouterLink>
          <RouterLink class="text-underline font-italic" :to="{ name: 'Recover'}">
            Забыли пароль?
          </RouterLink>
          <a
            class="text-underline font-italic mt-2"
            href="https://docs.google.com/document/d/1hns5If3IkNX2iBJ8LCq-LWAAWJGvn6GRiwdPTK-d3Jc/edit?usp=sharing"
            target="_blank"
          >Инструкция для пользователя</a>
        </div>
        <QBtn
          :disabled="loadingState.isLoading.value"
          html-type="submit"
          :loading="loadingState.isLoading.value"
          size="large"
          type="primary"
        >
          Войти
        </QBtn>
      </div>
    </AForm>
  </ACard>
</template>

<script setup lang="ts">
import { vvRequired } from '@/utils/form-validators';
import { DEFAULT_LOGGED_IN_ROUTE_NAME } from '@/config/constants';
import type { ValidationRules } from '@/types';
import { useLoading } from '@/composables/useLoading';
import { Executor } from '@/network/executor';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

interface Form {
  email: string
  password: string
}

const formRules: ValidationRules = {
  email: [
    vvRequired,
  ],
  password: [
    vvRequired,
    {
      min: 6,
      message: 'Длина пароля должна быть более 6 символов',
    },
  ],
};

const route = useRoute();
const router = useRouter();
const loadingState = useLoading();

const state = reactive({
  form: {
    email: '',
    password: '',
  } as Form,
  isFieldsInvalid: false,
});

const checkValidateStatus = computed(() => {
  return state.isFieldsInvalid ? 'error' : '';
});

onMounted(() => {
  if (route.query.token)
    activateProfile(route.query.token as string);
});

function onInput() {
  if (state.isFieldsInvalid)
    state.isFieldsInvalid = false;
}

function activateProfile(token: string) {
  Executor.run({
    request: AuthService.activateProfile({ token }),
    loadingState,
  });
}

function handleFinish(values: Form) {
  Executor.run({
    request: AuthService.login(values),
    loadingState,
    ignoreError: true,
    onResult(data) {
      const authStore = useAuthStore();
      authStore.login(data.token);
      const routeLocation = route.query.redirect ? { path: route.query.redirect } : { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
      router.push(routeLocation);
    },
    onError() {
      state.isFieldsInvalid = true;
    },
  });
}
</script>

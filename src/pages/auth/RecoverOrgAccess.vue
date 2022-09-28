<template>
  <ACard class="auth__recoverAccess">
    <h1 class="text-center fz-24 mb-5">
      Восстановление доступа Организации
    </h1>
    <div class="form-head">
      <ASteps class="mb-5" :current="currentStep">
        <AStep
          description="Введите данные организации и подтвердите ЭЦП"
          title="Данные организации"
        />
        <AStep
          class="text-left"
          description="Указанный пользователь будет откреплен от организации"
          title="Профиль пользователя"
        />
      </ASteps>
    </div>
    <div class="form-body">
      <template v-if="currentStep === 1">
        <AForm
          layout="vertical"
          :model="state.firstForm"
        >
          <ARow
            align="middle"
            :gutter="60"
            justify="space-between"
            type="flex"
          >
            <ACol :lg="12">
              <AFormItem label="ИИН/БИН" name="iin">
                <AInput
                  v-model:value="state.firstForm.iin"
                  disabled
                  size="large"
                />
              </AFormItem>
            </ACol>
            <ACol :lg="6">
              <QBtn
                :disabled="state.loading"
                :loading="state.loading"
                size="large"
                type="primary"
                @click="submitFirstForm"
              >
                Подписать ЭЦП
              </QBtn>
            </ACol>
          </ARow>
        </AForm>
      </template>
      <template v-else>
        <AForm
          layout="vertical"
          :model="state.secondForm"
          @finish="onFinish"
        >
          <ARow :gutter="60">
            <ACol :lg="12">
              <AFormItem
                class="font-italic"
                label="ФИО"
                name="name"
              >
                <AInput
                  v-model:value="state.secondForm.name"
                  disabled
                  placeholder="Иванов Иван"
                  size="large"
                />
              </AFormItem>
            </ACol>
            <ACol :lg="12">
              <AFormItem
                class="font-italic"
                label="ИИН/БИН"
                name="iin"
              >
                <AInput
                  v-model:value="state.secondForm.iin"
                  disabled
                  size="large"
                />
              </AFormItem>
            </ACol>
            <ACol :lg="12">
              <AFormItem
                class="font-italic"
                label="E-mail"
                name="email"
              >
                <AInput
                  v-model:value="state.secondForm.email"
                  disabled
                  size="large"
                />
              </AFormItem>
            </ACol>
            <ACol :lg="12">
              <AFormItem
                class="font-italic"
                label="Телефон"
                name="phone"
              >
                <AInput
                  v-model:value="state.secondForm.phone"
                  disabled
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
          <ARow
            align="middle"
            class="mt-4"
            :gutter="24"
            justify="end"
            type="flex"
          >
            <ACol>
              <QBtn
                v-if="!state.isFormSubmitted"
                :disabled="state.loading"
                html-type="submit"
                :loading="state.loading"
                size="large"
                type="primary"
              >
                Сохранить
              </QBtn>
              <RouterLink
                v-else
                class="ant-btn ant-btn-primary ant-btn-lg"
                :loading="state.loading"
                :to="{ name: 'CatalogOrganizations'}"
              >
                Перейти к организации
              </RouterLink>
            </ACol>
          </ARow>
        </AForm>
      </template>
    </div>
  </ACard>
</template>

<script setup lang="ts">
import { Signa } from '@/utils/signa';
import { UiUtils } from '@/network/ui-utils';
import { OrganizationService } from '@/services/organization.service';
import { Executor } from '@/network/executor';
import type { IUser } from '@/models/user.model';
import { useSteps } from '@/composables/useSteps';
import { UserService } from '@/services/user.service';
import { useUserStore } from '@/stores/user.store';

const signa = new Signa();

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { step: currentStep, nextStep } = useSteps();

const state = reactive({
  firstForm: {
    iin: '',
  },
  secondForm: {
    name: '',
    iin: '',
    email: '',
    phone: '',
    counterparty_id: 0,
  } as IUser,
  isDisabled: true,
  formattedPhone: '',
  loading: false,
  isFormSubmitted: false,
});

function onFinish() {
  Executor.run({
    request: OrganizationService.assignOrgUser({
      counterparty_id: state.secondForm.counterparty_id as number,
    }),
    onResult() {
      state.isFormSubmitted = true;
      Executor.run({
        request: UserService.readUser(),
        onResult(data) {
          userStore.setCurrentUser(data);
        },
      });
      router.push({ name: 'OrganizationsView', params: { id: state.secondForm.counterparty_id } });
    },
  });
}

function submitFirstForm() {
  signa.getAuthInfo((res) => {
    if (res.certNotAfter >= Date.now()) {
      const counterpartyInfo = signa.getSubjectDN(res.subjectDn);
      if (state.firstForm.iin === counterpartyInfo?.bin
    || state.firstForm.iin === counterpartyInfo?.iin) {
        Executor.run({
          request: OrganizationService.readOrgUser({ bin: state.firstForm.iin }),
          onResult(data) {
            state.secondForm = data;
            state.secondForm.iin = state.secondForm.iin?.substring(0, 6).concat('******');
            nextStep();
          },
        });
      } else {
        UiUtils.showError(new Error('БИН/ИИН не совпадает'));
      }
    } else {
      UiUtils.showError(new Error('Срок действия сертификата истек'));
    }
  });
}

onMounted(() => {
  state.firstForm.iin = route.params.bin as string;
});
</script>

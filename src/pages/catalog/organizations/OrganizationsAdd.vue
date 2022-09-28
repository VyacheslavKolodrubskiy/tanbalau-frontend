<template>
  <APageHeader
    title="Добавить “Организацию Клиента”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <template v-if="!proceed">
        <SubmitButton v-if="!isBinAndEmailValid" form="organizations_form">
          Проверить
        </SubmitButton>
        <QBtn
          :disabled="!isBinAndEmailValid"
          size="large"
          type="primary"
          @click="checkSigna"
        >
          Подписать ЭЦП
        </QBtn>
      </template>
      <QBtn
        v-if="proceed"
        size="large"
        type="warning"
        @click="goToPageTariff"
      >
        Выбрать тариф
      </QBtn>
    </template>
  </APageHeader>
  <OrganizationForm
    ref="child"
    @signa-valid="signaValid"
    @submit="submit"
    @success-check-bin-and-email="successCheck"
  />
  <ClientNotifications v-if="$canUse('client')" />
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue';
import { Executor } from '@/network/executor';
import { OrganizationService } from '@/services/organization.service';
import ClientNotifications from '@/components/ClientNotifications.vue';
import OrganizationForm from '@/pages/catalog/organizations/components/OrganizationForm.vue';
import { UserService } from '@/services/user.service';
import { useUserStore } from '@/stores/user.store';

const child = ref<InstanceType<typeof OrganizationForm>>();
const router = useRouter();
const userStore = useUserStore();
const proceed = ref(false);
const isBinAndEmailValid = ref(false);

function goToPageTariff() {
  router.push({ name: 'PricingTable' });
}

function checkSigna() {
  child.value?.checkSigna();
}

function signaValid(value) {
  if (value)
    proceed.value = true;
  else
    invalidSign();
}

function invalidSign() {
  proceed.value = false;
  isBinAndEmailValid.value = true;
}

function successCheck() {
  isBinAndEmailValid.value = true;
}

function submit(formModel) {
  Executor.run({
    request: OrganizationService.registerOrganization(formModel),
    globalLoading: true,
    notificationConfig: {
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => router.push({ name: 'RecoverAccess' }),
          },
          { default: () => 'Восстановить доступ' },
        ),
    },
    onResult(res) {
      Executor.run({
        request: OrganizationService.assignOrgUser({ counterparty_id: res.id }),
        globalLoading: true,
        onResult() {
          Executor.run({
            request: UserService.readUser(),
            onResult(data) {
              userStore.setCurrentUser(data);
            },
          });
          router.push({ name: 'OrganizationsView', params: { id: res.id } });
        },
      });
    },
    onError() {
      invalidSign();
    },
  });
}

</script>

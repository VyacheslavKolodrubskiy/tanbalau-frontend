<template>
  <APageHeader title="Просмотр “Организации клиента”" @back="() => $router.go(-1)">
    <template #extra>
      <QBtn
        v-if="$canUse(['client'])"
        size="large"
        type="warning"
        @click="goToPageTariff"
      >
        Выбрать тариф
      </QBtn>
      <QLink
        v-if="$canUse(['client'])"
        size="large"
        :to="{ name: 'OrganizationsEdit', params: { id: $route.params.id } }"
        type="primary"
      >
        Редактировать
      </QLink>
    </template>
  </APageHeader>
  <ACard v-if="organization">
    <ARow class="mb-6" :gutter="[24, 24]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Наименование">
          {{ organization.title }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="БИН">
          {{ organization.bin }}
        </LabelValue>
      </ACol>

      <ACol :md="8" :xs="0" />

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Юр.адрес">
          {{ organization.legalAddress }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="E-mail">
          {{ organization.email }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Телефон">
          {{ organization.phone }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="ApiKey">
          {{ organization.apiKey }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="ClientToken">
          {{ organization.clientToken }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="OMS ID">
          {{ organization.omsId }}
        </LabelValue>
      </ACol>
    </ARow>
  </ACard>
  <ClientNotifications v-if="$canUse('client')" />
</template>

<script setup lang="ts">
import { Executor } from '@/network/executor';
import type { IOrganization, Organization } from '@/models/organization.model';
import { OrganizationService } from '@/services/organization.service';
import ClientNotifications from '@/components/ClientNotifications.vue';

const organization = ref<IOrganization>({
  bin: '',
  email: '',
  phone: '',
  title: '',
  omsId: '',
  apiKey: '',
  clientToken: '',
  legalAddress: '',
});

const route = useRoute();
const router = useRouter();

function goToPageTariff() {
  router.push({ name: 'PricingTable' });
}

function readCounterparty() {
  Executor.run<Organization>({
    request: OrganizationService.readOrganization(route.params.id as string),
    globalLoading: true,
    onResult(data) {
      organization.value = data;
    },
  });
}

readCounterparty();
</script>

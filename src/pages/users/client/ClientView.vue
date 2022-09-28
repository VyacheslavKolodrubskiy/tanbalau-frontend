<template>
  <APageHeader
    title="Просмотр пользователя “Клиент”"
    @back="() => $router.go(-1)"
  >
    <template #tags>
      <StatusTagSubscription
        :subscription="client.subscription"
      />
    </template>
  </APageHeader>
  <ARow :gutter="[24, 24]">
    <ACol
      :lg="16"
      :xs="24"
    >
      <ACard>
        <ARow :gutter="[24, 24]">
          <ACol
            :md="8"
            :sm="12"
            :xs="24"
          >
            <LabelValue label="ФИО">
              {{ client.name }}
            </LabelValue>
          </ACol>

          <ACol
            :md="8"
            :sm="12"
            :xs="24"
          >
            <LabelValue label="ИИН">
              {{ client.iin }}
            </LabelValue>
          </ACol>

          <ACol
            :md="8"
            :sm="12"
            :xs="24"
          >
            <LabelValue label="Организация">
              {{ client.counterpartyUser?.title }}
            </LabelValue>
          </ACol>

          <ACol
            :md="8"
            :sm="12"
            :xs="24"
          >
            <LabelValue label="Почта">
              {{ client.email }}
            </LabelValue>
          </ACol>

          <ACol
            :md="8"
            :sm="12"
            :xs="24"
          >
            <LabelValue label="Телефон">
              {{ client.phone }}
            </LabelValue>
          </ACol>

          <ACol
            :xs="24"
          >
            <LabelValue label="Комментарий">
              {{ client.note }}
            </LabelValue>
          </ACol>
        </ARow>
      </ACard>
    </ACol>

    <ACol
      :if="$canUse(['admin', 'manager'])"
      :lg="8"
      :xs="24"
    >
      <ACard>
        <h2>История тарифа</h2>
        <ATimeline class="mt-7">
          <ATimelineItem v-for="orderLog in client.logs" :key="orderLog.id">
            <div class="fz-12 text-gray-500">
              {{ $format(orderLog.created_at, "datetime") }}
            </div>
            <div>{{ orderLog.title }}</div>
          </ATimelineItem>
        </ATimeline>
      </ACard>
    </ACol>
  </ARow>
</template>

<script setup lang="ts">
import { Executor } from '@/network/executor';
import { ClientService } from '@/services/client.service';
import type { Client, IClient } from '@/models/client.model';
import StatusTagSubscription from '@/pages/profile/components/StatusTagSubscription.vue';

const route = useRoute();

const client = ref<IClient>({
  name: '',
  iin: '',
  counterpartyUser: {
    id: undefined,
    bin: undefined,
    email: '',
    omsId: '',
    phone: undefined,
    title: '',
    apiKey: '',
    clientToken: '',
    legalAddress: '',
  },
  email: '',
  phone: '',
  note: '',
  logs: undefined,
  subscription: undefined,
});

function readClient() {
  Executor.run<Client>({
    request: ClientService.readClient(route.params.id as string),
    onResult(data) {
      client.value = data;
    },
  });
}

readClient();

</script>

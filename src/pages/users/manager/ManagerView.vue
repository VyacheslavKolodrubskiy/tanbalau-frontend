<template>
  <APageHeader
    title="Просмотр пользователя “Менеджер”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <QLink
        v-if="$canUse('admin')"
        size="large"
        :to="{
          name: 'UsersManagerEdit',
          params: { id: $route.params.id },
        }"
        type="primary"
      >
        Редактировать
      </QLink>
    </template>
  </APageHeader>

  <ACard v-if="manager">
    <ARow :gutter="[24, 24]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="ФИО">
          {{ manager.name }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Почта">
          {{ manager.email }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Телефон">
          {{ manager.phone }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Филиал">
          {{ manager.branchUser?.title }}
        </LabelValue>
      </ACol>

      <ACol
        :md="16"
        :xs="24"
      >
        <LabelValue label="Комментарий">
          {{ manager.note }}
        </LabelValue>
      </ACol>

      <ACol
        :xs="24"
      >
        <LabelValue label="Активность">
          {{ getStatus }}
        </LabelValue>
      </ACol>
    </ARow>
  </ACard>
</template>

<script setup lang="ts">
import { format } from '@/utils/format';
import { Executor } from '@/network/executor';
import { ManagerService } from '@/services/manager.service';
import type { IManager, Manager } from '@/models/manager.model';

const route = useRoute();

const manager = ref<IManager>({
  name: '',
  email: '',
  phone: '',
  note: '',
  isActive: false,
  // branchUser: {
  //   title: '',
  //   id: undefined,
  // },
});

function readManager() {
  Executor.run<Manager>({
    request: ManagerService.readManager(route.params.id as string),
    globalLoading: true,
    onResult(data) {
      manager.value = data;
    },
  });
}

const getStatus = computed(() => format(manager.value.isActive, 'yesno'));

readManager();

</script>

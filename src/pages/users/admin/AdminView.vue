<template>
  <APageHeader title="Просмотр пользователя “Администратор”" @back="() => $router.go(-1)">
    <template #extra>
      <QLink
        v-if="$canUse('admin')"
        size="large"
        :to="{ name: 'UsersAdminEdit', params: { id: $route.params.id } }"
        type="primary"
      >
        Редактировать
      </QLink>
    </template>
  </APageHeader>
  <ACard v-if="admin">
    <ARow :gutter="[24,24]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="ФИО">
          {{ admin.name }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Почта">
          {{ admin.email }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
      >
        <LabelValue label="Телефон">
          {{ admin.phone }}
        </LabelValue>
      </ACol>

      <ACol
        :xs="24"
      >
        <LabelValue label="Комментарий">
          {{ admin.note }}
        </LabelValue>
      </ACol>
    </ARow>
  </ACard>
</template>

<script setup lang="ts">
import { Executor } from '@/network/executor';
import type { Admin, IAdmin } from '@/models/admin.model';
import { AdminService } from '@/services/admin.service';

const route = useRoute();

const admin = ref<IAdmin>({
  name: '',
  email: '',
  phone: '',
  note: '',
});

function readAdmin() {
  Executor.run<Admin>({
    request: AdminService.readAdmin(route.params.id as string),
    onResult(data) {
      admin.value = data;
    },
  });
}

readAdmin();

</script>

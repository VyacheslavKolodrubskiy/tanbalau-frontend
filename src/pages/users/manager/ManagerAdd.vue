<template>
  <APageHeader
    title="Добавить пользователя “Менеджер”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="manager_form" />
    </template>
  </APageHeader>

  <ACard>
    <ManagerForm @saved="onSaved" />
  </ACard>
</template>

<script setup lang="ts">
import ManagerForm from '@/pages/users/manager/components/ManagerForm.vue';

const router = useRouter();

function onSaved() {
  router.push({ name: 'UsersManager' });
}

</script>

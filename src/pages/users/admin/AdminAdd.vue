<template>
  <APageHeader
    title="Добавить пользователя “Администратор”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="admin_form" />
    </template>
  </APageHeader>

  <ACard>
    <AdminForm @saved="onSaved" />
  </ACard>
</template>

<script setup lang="ts">
import AdminForm from '@/pages/users/admin/components/AdminForm.vue';

const router = useRouter();

function onSaved() {
  router.push({ name: 'UsersAdmin' });
}
</script>

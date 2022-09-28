<template>
  <APageHeader
    title="Редактировать пользователя “Администратор”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="admin_form" />
    </template>
  </APageHeader>

  <ACard>
    <AdminForm
      :data-id="dataId"
      @saved="onSaved"
    />
  </ACard>
</template>

<script setup lang="ts">
import AdminForm from '@/pages/users/admin/components/AdminForm.vue';

const router = useRouter();
const route = useRoute();

const dataId = computed(() => route.params.id as string);

function onSaved() {
  router.push({ name: 'UsersAdmin' });
}

</script>

<template>
  <APageHeader
    title="Редактировать пользователя “Менеджер”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="manager_form" />
    </template>
  </APageHeader>

  <ACard>
    <ManagerForm
      :data-id="dataId"
      @saved="onSaved"
    />
  </ACard>
</template>

<script setup lang="ts">
import ManagerForm from '@/pages/users/manager/components/ManagerForm.vue';

const router = useRouter();
const route = useRoute();

const dataId = computed(() => route.params.id as string);

function onSaved() {
  router.push({ name: 'UsersManager' });
}

</script>

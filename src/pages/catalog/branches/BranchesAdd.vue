<template>
  <APageHeader title="Добавить “Филиал”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="branches_form" />
    </template>
  </APageHeader>
  <ACard>
    <BranchesForm @submit="submit" />
  </ACard>
</template>

<script setup lang="ts">
import { postAxios } from '@/services/http/request';
import BranchesForm from '@/pages/catalog/branches/components/BranchesForm.vue';

const router = useRouter();

function submit(values) {
  postAxios('/branch/', values, { globalLoading: true }).then(() => {
    notification.success({
      message: 'Успешно обновлен',
    });
    router.push({ name: 'CatalogBranches' });
  });
}
</script>

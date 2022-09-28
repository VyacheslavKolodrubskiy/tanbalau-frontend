<template>
  <APageHeader title="Редактировать “Филиал”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="branches_form" />
    </template>
  </APageHeader>
  <ACard>
    <BranchesForm
      :data-id="$route.params.id"
      @submit="submit"
    />
  </ACard>
</template>

<script setup lang="ts">
import { putAxios } from '@/services/http/request';
import BranchesForm from '@/pages/catalog/branches/components/BranchesForm.vue';

const route = useRoute();
const router = useRouter();

function submit(values) {
  putAxios(`/branch/${route.params.id}`, { id: route.params.id, ...values }, { globalLoading: true }).then(() => {
    notification.success({
      message: 'Успешно обновлен',
    });
    router.push({ name: 'CatalogBranches' });
  });
}
</script>

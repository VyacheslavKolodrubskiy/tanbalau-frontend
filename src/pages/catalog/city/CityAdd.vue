<template>
  <div>
    <APageHeader title="Добавить “Город”" @back="() => $router.go(-1)">
      <template #extra>
        <CancelButton />
        <SubmitButton form="city_form" />
      </template>
    </APageHeader>
    <ACard>
      <CityForm @submit="submit" />
    </ACard>
  </div>
</template>
<script setup lang="ts">
import { postAxios } from '@/services/http/request';
import CityForm from '@/pages/catalog/city/components/CityForm.vue';

const router = useRouter();

function submit(values: object[]) {
  postAxios('/cities/', values, { globalLoading: true }).then(() => {
    notification.success({
      message: 'Сохранено',
    });
    router.push({ name: 'CatalogCity' });
  });
}
</script>

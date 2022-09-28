<template>
  <APageHeader
    title="Редактировать “Заказ на формирование КМ”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="order_form" />
    </template>
  </APageHeader>

  <ACard>
    <OrderForm
      :data-id="$route.params.id"
      @submit="submit"
    />
  </ACard>
</template>

<script setup lang="ts">
import { putAxios } from '@/services/http/request';
import OrderForm from '@/pages/suz/orders/components/OrderForm.vue';

const route = useRoute();
const router = useRouter();

function submit(values: object[]) {
  putAxios(`/orders/${route.params.id}`, { ...values }).then(() => {
    notification.success({
      message: 'Сохранено',
    });
    router.push({ name: 'Order' });
  });
}
</script>

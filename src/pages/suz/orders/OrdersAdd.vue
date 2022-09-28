<template>
  <APageHeader
    title="Добавить “Заказ на формирование КМ”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="order_form" />
    </template>
  </APageHeader>

  <ACard>
    <OrderForm @submit="submit" />
  </ACard>
</template>

<script setup lang="ts">
import { postAxios } from '@/services/http/request';
import OrderForm from '@/pages/suz/orders/components/OrderForm.vue';

const router = useRouter();

function submit(values: object[]) {
  postAxios('/orders', values).then(() => {
    notification.success({
      message: 'Сохранено',
    });
    router.push({ name: 'Order' });
  });
}
</script>

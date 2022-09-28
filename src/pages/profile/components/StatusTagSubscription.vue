<template>
  <StatusTag v-if="subscription" :variant="getPaymentStatusVariant(subscription.id)">
    {{ subscription.title }}
    <template v-if="subscription.id === PAYMENT_STATUSES.paid.id">
      <!-- >  Если статус оплачен, то отобразить дополнительное поле с датой действия подписки  <!-->
      до {{ $format(subscription.expiredAt, 'date') }}
    </template>
  </StatusTag>
</template>
<script setup lang="ts">
import { PAYMENT_STATUSES } from '@/config/types';
import type { ISubscriptionStatus } from '@/models/status.model';
import { getPaymentStatusVariant } from '@/utils/utils';

interface Props {
  subscription?: ISubscriptionStatus
}

defineProps<Props>();

</script>

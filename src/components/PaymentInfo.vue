<template>
  <ACard v-if="user?.subscription?.id === PAYMENT_STATUSES.rejected.id" class="text-center fz-24 mb-5">
    Тариф просрочен.
    Для получения доступа произведите оплату
  </ACard>

  <ACard v-if="user?.subscription?.id === PAYMENT_STATUSES.paid.id" class="text-center mb-5">
    <div class="fz-24">
      {{ user?.subscription?.title }}
      <div class="font-weight-semibold">
        до  {{ $format(user?.subscription?.expiredAt, 'date') }}
      </div>
    </div>
  </ACard>

  <ACard class="text-center">
    <div class="text-purple font-weight-heavy fz-34">
      49 990 тг
    </div>
    <div class="my-4 fz-24">
      Доступ на <strong>6</strong> месяцев
    </div>
    <QBtn
      size="large"
      type="purple"
      @click="openAgreementModal(1)"
    >
      Выбрать
    </QBtn>
  </ACard>

  <ACard class="text-center mt-5">
    <div class="text-pink font-weight-heavy fz-34">
      89 990 тг
    </div>
    <div class="my-4 fz-24">
      Доступ на <strong>12</strong> месяцев
    </div>
    <QBtn
      size="large"
      type="pink"
      @click="openAgreementModal(2)"
    >
      Выбрать
    </QBtn>
  </ACard>
  <AModal
    v-if="hasCounterparty"
    v-model:visible="state.modalVisible"
    destroy-on-close
    :footer="null"
    title="Для совершения оплаты, подтвердите условия соглашения "
  >
    <AForm
      layout="vertical"
    >
      <AFormItem>
        <ACheckbox v-model:checked="state.agreedWithRules">
          Ознакомлен и согласен с <a
            class="text-underline"
            download="rules"
            href="https://tbl-api.qltlab.kz/storage/qlt_docs/rules.pdf"
            target="_blank"
          >
            Правилами возмездного оказания информационных услуг (публичная оферта) в порядке статьи 395 Гражданского кодекса Республики Казахстан
          </a>
        </ACheckbox>
      </AFormItem>
      <AFormItem>
        <ACheckbox v-model:checked="state.agreedWithContract">
          Ознакомлен и согласен с <a
            class="text-underline"
            download="contract"
            href="https://tbl-api.qltlab.kz/storage/qlt_docs/contract.pdf"
            target="_blank"
          >
            Договором присоединения к Правилам возмездного оказания информационных услуг
          </a>
        </ACheckbox>
      </AFormItem>
      <ARow justify="center" type="flex">
        <SubmitButton
          :disabled="!isAgreed"
          @click="submitAgreementForm"
        >
          Продолжить
        </SubmitButton>
      </ARow>
    </AForm>
  </AModal>

  <AModal
    v-else
    v-model:visible="state.modalVisible"
    destroy-on-close
    :footer="null"
    title="Добавьте свою организацию"
  >
    <div class="text-center mb-5">
      Для того, чтобы приобрести тариф необходимо добавить организацию и подтвердить ее через ЭЦП ключ
    </div>
    <ARow justify="center" type="flex">
      <RouterLink class="ant-btn btn--success ant-btn-lg" :to="{ name: 'OrganizationsAdd' }">
        Добавить организацию
      </RouterLink>
    </ARow>
  </AModal>
</template>

<script lang="ts" setup>
import { getAxios, postAxios } from '@/services/http/request';
import { PAYMENT_STATUSES } from '@/config/types';
import { useUserStore } from '@/stores/user.store';

interface State {
  currentPaymendId: number | null
  agreedWithRules: boolean
  agreedWithContract: boolean
  modalVisible: boolean
}

const state: State = reactive({
  currentPaymendId: null,
  agreedWithRules: false,
  agreedWithContract: false,
  modalVisible: false,
});

const route = useRoute();
const userStore = useUserStore();
const user = computed(() => userStore.current);

if (route.query.pg_order_id && route.query.pg_payment_id)
  readPaymentStatusAfterPaid({ pg_order_id: route.query.pg_order_id, pg_payment_id: route.query.pg_payment_id });

const isAgreed = computed(() => {
  return state.agreedWithRules && state.agreedWithContract;
});

const hasCounterparty = computed(() => {
  return !!user.value?.counterparty;
});

function submitAgreementForm() {
  state.modalVisible = false;
  payForSubscription({ type_id: state.currentPaymendId });
}

function showPaymentStatus(data) {
  const type = data.pg_transaction_status === 'ok' ? 'success' : 'error';
  notification[type]({
    message: data.status,
  });
}

function openAgreementModal(num) {
  state.modalVisible = true;
  state.agreedWithRules = false;
  state.agreedWithContract = false;
  state.currentPaymendId = num;
}

function readPaymentStatus(id) {
  return getAxios(`/payments/${id}/status`, {}, { globalLoading: true }).then((res) => {
    showPaymentStatus(res.data);
  });
}

function readPaymentStatusAfterPaid(values) {
  return postAxios('/payments/check-status-after-paybox', values, { globalLoading: true }).then((res) => {
    readPaymentStatus(res.data.payment_id);
  });
}

function payForSubscription(values) {
  postAxios('/payments', values, { globalLoading: true }).then((res) => {
    window.location.href = res.data.url;
  });
}
</script>

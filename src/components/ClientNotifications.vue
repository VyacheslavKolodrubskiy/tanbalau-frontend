<template>
  <AModal
    v-if="state.firstTypeNotification"
    v-model:visible="state.showModal"
    title="Передать доступ к тарифу?"
  >
    <span>
      {{ state.firstTypeNotification.message }}
    </span>
    <template #footer>
      <div class="d-flex justify-content-center">
        <SubmitButton @click="transferTariff">
          Да
        </SubmitButton>
        <QBtn
          danger
          size="large"
          type="primary"
          @click="onCancel"
        >
          Отмена
        </QBtn>
      </div>
    </template>
  </AModal>

  <AModal
    v-if="state.secondTypeNotification"
    v-model:visible="state.showModal"
    destroy-on-close
    title="Ваш тариф был передан другому пользователю"
  >
    <div class="text-center">
      {{ state.secondTypeNotification.message }}
    </div>
    <template #footer>
      <div class="d-flex justify-content-center">
        <SubmitButton @click="readNotification">
          Продолжить
        </SubmitButton>
      </div>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import QBtn from './qlib/QBtn.vue';
import { Executor } from '@/network/executor';
import type { Notification } from '@/models/notification.model';
import { NotificationService } from '@/services/notification.service';

const state = reactive({
  showModal: false,
  firstTypeNotification: null as Notification | null,
  secondTypeNotification: null as Notification | null,
});

checkUnreadNotifications();

function onCancel() {
  state.showModal = false;
}

function transferTariff() {
  Executor.run({
    request: NotificationService.transferTariff(),
    globalLoading: true,
    onResult(res) {
      message.success(res.message);
      onCancel();
    },
  });
}

function readNotification() {
  Executor.run({
    request: NotificationService.readNotification(state.secondTypeNotification?.id as string),
    globalLoading: true,
    onResult(res) {
      message.success(res.message);
      onCancel();
    },
  });
}

function checkUnreadNotifications() {
  Executor.run({
    request: NotificationService.checkUnreadNotifications(),
    globalLoading: true,
    onResult(res) {
      state.firstTypeNotification = res.find(el => el.type === 1) as Notification;
      state.secondTypeNotification = res.find(el => el.type === 2) as Notification;
      state.showModal = !!(state.firstTypeNotification || state.secondTypeNotification);
    },
  });
}

</script>

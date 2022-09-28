<template>
  <APageHeader title="Мой профиль">
    <template #extra>
      <CancelButton />
      <SubmitButton form="profile_form" />
    </template>
  </APageHeader>

  <ARow :gutter="[24, 24]">
    <ACol
      :lg="14"
      :xl="14"
      :xs="24"
      :xxl="18"
    >
      <ACard>
        <ProfileForm
          @submit="submit"
        />

        <a
          v-if="!state.bot.subscribed && $canUse(['manager', 'client', 'admin'])"
          class="ant-btn ant-btn-lg btn--telegram"
          :href="state.bot.url"
          target="_blank"
        >
          Подписаться на рассылку в Telegram
        </a>

        <QBtn
          v-else-if="state.bot.subscribed && $canUse(['manager', 'client', 'admin'])"
          danger
          size="large"
          type="primary"
          @click="subscr"
        >
          Отписаться от рассылки в Telegram
        </QBtn>
      </ACard>
    </ACol>

    <ACol
      :md="10"
      :xs="24"
      :xxl="6"
    >
      <PaymentInfo v-if="$canUse('client')" />
    </ACol>
  </ARow>
  <ACard />
</template>

<script setup lang="ts">
import { getAxios, putAxios } from '@/services/http/request';
import ProfileForm from '@/pages/profile/components/ProfileForm.vue';
import PaymentInfo from '@/components/PaymentInfo.vue';

interface Bot {
  subscribed: boolean | null
  url: string
}

const state = reactive({
  bot: {
    subscribed: null,
    url: '',
  } as Bot,

});

onMounted(() => {
  checkSubscribeStatus();
});

function subscr() {
  unsubscribe().then(() => checkSubscribeStatus());
}

function checkSubscribeStatus() {
  return getAxios('/subscription/telegram/check', {}, { serverErrorRedirect: false }).then((res) => {
    state.bot = res.data;
  });
}

function unsubscribe() {
  return getAxios('/subscription/telegram/unsubscribe', {}, { serverErrorRedirect: false }).then((res) => {
    state.bot = res.data;
    return res;
  });
}

function submit(values) {
  putAxios('profile', values).then(() => {
    notification.success({
      message: 'Успешно обновлен',
    });
  });
}
</script>

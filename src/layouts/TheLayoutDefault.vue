<template>
  <AConfigProvider :locale="locale">
    <ALayout class="default-layout">
      <TheSidebar />
      <ALayout>
        <Header />
        <ALayoutContent>
          <TheDemoAccess
            v-if="userStore.hasDemoAccess && $route.meta.demoAccess"
            :title="$route.meta.breadcrumbName"
            :video-id="$route.meta.demoAccess.videoId"
          />
          <RouterView v-else />
        </ALayoutContent>
      </ALayout>
      <ClientNotifications v-if="$canUse('client')" />
      <TheGlobalOverlay />
      <TheGlobalSpinner />
    </ALayout>
  </AConfigProvider>
</template>

<script setup lang="ts">
import locale from 'ant-design-vue/es/locale/ru_RU';
import TheSidebar from '@/components/TheSidebar.vue';
import Header from '@/components/TheHeader.vue';
import ClientNotifications from '@/components/ClientNotifications.vue';
import TheGlobalOverlay from '@/components/TheGlobalOverlay.vue';
import TheGlobalSpinner from '@/components/TheGlobalSpinner.vue';
import TheDemoAccess from '@/components/TheDemoAccess.vue';
import { useUserStore } from '@/stores/user.store';

const userStore = useUserStore();
</script>

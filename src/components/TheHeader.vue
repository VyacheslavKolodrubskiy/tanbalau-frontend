<template>
  <ALayoutHeader class="header">
    <TheBreadcrumbs />

    <div class="text-nowrap">
      <StatusTagSubscription
        v-if="$canUse('client')"
        class="mr-4"
        :subscription="currentUser?.subscription"
      />

      <ADropdown :trigger="['click']">
        <a
          class="text-body text-truncate"
          style="max-width: 200px"
          @click.prevent
        >
          <AAvatar class="mr-2" size="large">
            <template #icon><QIcon type="user" /></template>
          </AAvatar>
          <span>{{ currentUser?.name }}</span>
        </a>

        <template #overlay>
          <AMenu>
            <AMenuItem>
              <RouterLink :to="{ name: 'Profile' }">
                Профиль
              </RouterLink>
            </AMenuItem>
            <AMenuItem class="logout" @click="logout">
              Выйти
            </AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
    </div>
  </ALayoutHeader>
</template>

<script setup lang="ts">
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue';
import StatusTagSubscription from '@/pages/profile/components/StatusTagSubscription.vue';
import { useUserStore } from '@/stores/user.store';
import { useAuthStore } from '@/stores/auth.store';

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const currentUser = computed(() => userStore.current);

function logout() {
  authStore.logout();
  router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME });
}
</script>

<template>
  <div />
</template>

<script setup lang="ts">
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME });
authStore.logout();
</script>

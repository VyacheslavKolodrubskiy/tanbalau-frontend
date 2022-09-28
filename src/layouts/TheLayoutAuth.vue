<template>
  <div class="auth">
    <div class="auth__logo d-flex justify-content-center">
      <img
        alt="logo"
        draggable="false"
        src="@/assets/images/logo-tanbalau-black.svg"
      >
    </div>
    <RouterView />
    <TheGlobalOverlay />
  </div>
</template>

<script setup lang="ts">
import TheGlobalOverlay from '@/components/TheGlobalOverlay.vue';
</script>

<style scoped></style>

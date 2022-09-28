<template>
  <Transition name="fade">
    <div v-if="globalOverlayStore.visible" class="global-overlay">
      <div v-if="globalOverlayStore.message" class="global-overlay__message">
        {{ globalOverlayStore.message }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGlobalOverlayStore } from '@/stores/global-overlay.store';

const globalOverlayStore = useGlobalOverlayStore();
</script>

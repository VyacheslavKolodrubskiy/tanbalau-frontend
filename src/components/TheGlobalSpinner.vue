<template>
  <div class="d-none" :class="{'d-block': isLoading}">
    <div class="spinner-wrapper">
      <ASpin size="large" />
    </div>
    <div class="ant-modal-mask" />
  </div>
</template>

<script setup lang="ts">
import { useGlobalLoading } from '@/composables/useLoading';

const { isLoading } = useGlobalLoading();

</script>

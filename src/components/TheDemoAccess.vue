<template>
  <APageHeader :title="title">
    <template #extra>
      <QLink
        size="large"
        :to="{ name: 'PricingTable' }"
        type="success"
      >
        Получить доступ к системе
      </QLink>
    </template>
  </APageHeader>
  <QVideo :src="videoUrl" />
</template>

<script setup lang="ts">
import QVideo from '@/components/qlib/QVideo.vue';
import { getEmbedUrl } from '@/utils/url';

interface Props {
  videoId: string
  title?: string
}

const props = defineProps<Props>();

const videoUrl = computed(() => getEmbedUrl(props.videoId));
</script>

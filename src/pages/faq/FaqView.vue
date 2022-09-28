<template>
  <APageHeader
    title="Просмотр FAQ"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <QLink
        v-if="$canUse('admin')"
        size="large"
        :to="{
          name: 'FaqEdit',
          params: { id: route.params.id },
        }"
        type="primary"
      >
        Редактировать
      </QLink>
    </template>
  </APageHeader>
  <ACard v-if="faqData">
    <ARow :gutter="[24, 45]">
      <ACol
        :md="24"
        :sm="24"
        :xs="24"
      >
        <LabelValue label="Вопрос">
          {{ faqData.question }}
        </LabelValue>
      </ACol>
      <ACol
        :md="24"
        :sm="24"
        :xs="24"
      >
        <div class="show-label show-label--bold mb-1">
          Ответ
        </div>
        <div class="editor-html" v-html="faqData.answer" />
      </ACol>
      <ACol
        v-if="faqUrl"
        :md="16"
        :sm="16"
        :xs="16"
      >
        <QVideo :src="faqUrl" />
      </ACol>
    </ARow>
  </ACard>
</template>

<script setup lang="ts">
import type { Faq, IFaq } from '@/models/faq.models';
import { Executor } from '@/network/executor';
import { FaqService } from '@/services/faq.service';
import { getEmbedUrl, parseYoutubeUrl } from '@/utils/url';
import QVideo from '@/components/qlib/QVideo.vue';

const route = useRoute();

const faqData = ref<IFaq>({
  question: '',
  answer: '',
  url: '',
});

const faqUrl = computed(() => {
  const videoId = parseYoutubeUrl(faqData.value.url as string);
  return videoId ? getEmbedUrl(videoId) : null;
});

function readFaq() {
  Executor.run<Faq>({
    request: FaqService.readPoll(route.params.id as string),
    globalLoading: true,
    onResult(data) {
      faqData.value = data;
    },
  });
}

readFaq();

</script>

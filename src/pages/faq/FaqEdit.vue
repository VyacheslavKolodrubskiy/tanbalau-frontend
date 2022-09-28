<template>
  <APageHeader
    title="Редактировать “FAQ”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="faq_form" />
    </template>
  </APageHeader>

  <ACard>
    <FaqForm :data-id="dataId" @saved="onSaved" />
  </ACard>
</template>

<script setup lang="ts">
import FaqForm from '@/pages/faq/components/FaqForm.vue';

const router = useRouter();
const route = useRoute();

const dataId = computed(() => route.params.id as string);

function onSaved() {
  router.push({ name: 'FaqView' });
}

</script>

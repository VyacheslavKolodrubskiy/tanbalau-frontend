<template>
  <APageHeader
    title="Добавить “FAQ”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <CancelButton />
      <SubmitButton form="faq_form" />
    </template>
  </APageHeader>

  <ACard>
    <FaqForm @saved="onSaved" />
  </ACard>
</template>

<script setup lang="ts">
import FaqForm from '@/pages/faq/components/FaqForm.vue';

const router = useRouter();

function onSaved() {
  router.push({ name: 'FaqMain' });
}

</script>

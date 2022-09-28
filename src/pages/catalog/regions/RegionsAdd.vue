<template>
  <APageHeader title="Добавить “ГРЗ/Область”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="regions_form" />
    </template>
  </APageHeader>
  <ACard>
    <RegionsForm @submit="submit" />
  </ACard>
</template>

<script>

import { postAxios } from '@/services/http/request';
import RegionsForm from '@/pages/catalog/regions/components/RegionsForm.vue';

export default {
  name: 'RegionAdd',
  components: {
    RegionsForm,
  },
  data() {
    return {};
  },
  methods: {
    submit(values) {
      postAxios('/regions', values, { globalLoading: true }).then((res) => {
        this.$notification.success({
          message: res.message,
        });
        this.$router.push({ name: 'CatalogRegion' });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>

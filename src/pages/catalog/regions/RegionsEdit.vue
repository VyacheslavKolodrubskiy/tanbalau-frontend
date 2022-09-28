<template>
  <APageHeader title="Редактировать “ГРЗ/Область”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="regions_form" />
    </template>
  </APageHeader>
  <ACard>
    <RegionsForm
      :data-id="$route.params.id"
      @submit="submit"
    />
  </ACard>
</template>

<script>
import { putAxios } from '@/services/http/request';
import RegionsForm from '@/pages/catalog/regions/components/RegionsForm.vue';

export default {
  name: 'RegionEdit',
  components: {
    RegionsForm,
  },
  data() {
    return {
    };
  },
  methods: {
    submit(values) {
      putAxios(`/regions/${this.$route.params.id}`, values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Изменено',
        });
        this.$router.push({ name: 'CatalogRegion' });
      });
    },
  },
};
</script>

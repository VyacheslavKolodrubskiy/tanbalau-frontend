<template>
  <div>
    <APageHeader title="Редактировать “Город”" @back="() => $router.go(-1)">
      <template #extra>
        <CancelButton />
        <SubmitButton form="city_form" />
      </template>
    </APageHeader>
    <ACard>
      <CityForm
        :data-id="$route.params.id"
        @submit="submit"
      />
    </ACard>
  </div>
</template>
<script>
import { getAxios, putAxios } from '@/services/http/request';
import CityForm from '@/pages/catalog/city/components/CityForm.vue';

export default {
  name: 'CatalogCityAdd',
  components: {
    CityForm,
  },
  data() {
    return {
    };
  },
  methods: {
    readCity() {
      getAxios(`cities/${this.$route.params.id}`, {}, { globalLoading: true }).then((res) => {
        this.city = res.data;
      });
    },
    submit(values) {
      putAxios(`/cities/${this.$route.params.id}`, { ...values }, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'CatalogCity' });
      });
    },
  },
};
</script>

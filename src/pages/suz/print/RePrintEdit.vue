<template>
  <APageHeader title="Редактировать “Печать КМ”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="reprint_form" />
    </template>
  </APageHeader>

  <ACard>
    <RePrintForm
      :data-id="$route.params.id"
      @restricted="handleRestricted"
      @submit="submit"
    />
  </ACard>
</template>
<script>
import { putAxios } from '@/services/http/request';
import RePrintForm from '@/pages/suz/print/components/RePrintForm.vue';

export default {
  name: 'RePrintEdit',
  components: { RePrintForm },
  data() {
    return {
    };
  },
  methods: {
    handleRestricted() {
      this.$router.replace({ name: 'Print' });
    },
    submit(values) {
      putAxios(`reprint-groups/${this.$route.params.id}`, values).then((res) => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'Print' });
      });
    },
  },
};
</script>

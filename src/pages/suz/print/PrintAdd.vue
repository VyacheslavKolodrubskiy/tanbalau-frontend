<template>
  <APageHeader title="Добавить “Печать КМ”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="print_form" />
    </template>
  </APageHeader>

  <ACard>
    <PrintForm @submit="submit" />
  </ACard>
</template>
<script>
import { postAxios } from '@/services/http/request';
import PrintForm from '@/pages/suz/print/components/PrintForm.vue';

export default {
  name: 'PrintAdd',
  components: { PrintForm },
  data() {
    return {
    };
  },
  methods: {
    submit(values) {
      postAxios('print-groups', values).then((res) => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'Print' });
      });
    },

  },
};
</script>

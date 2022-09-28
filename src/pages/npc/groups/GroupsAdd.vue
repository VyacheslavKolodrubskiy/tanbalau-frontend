<template>
  <div class="npc-group">
    <APageHeader
      title="Добавить “Группу товаров”"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <CancelButton />
      </template>
    </APageHeader>
    <ACard>
      <GroupForm @submit="submit" />
      <div class="text-right">
        <SubmitButton form="groups_form">
          Сохранить группу
        </SubmitButton>
      </div>
    </ACard>
    <ACard>
      <ADivider orientation="left">
        Шаг 2. Информация о товарах
      </ADivider>
      <SubmitButton disabled>
        <QIcon type="plus" />
        Добавить новый
      </SubmitButton>
    </ACard>
  </div>
</template>
<script>

import { postAxios } from '@/services/http/request';
import GroupForm from '@/pages/npc/groups/GroupForm.vue';

export default {
  name: 'GroupsAdd',
  components: { GroupForm },
  data() {
    return {
      btnDisabled: true,
    };
  },
  methods: {
    submit(values) {
      for (const key in values.importer) {
        if (!values.importer[key])
          delete values.importer[key];
      }
      postAxios('/nkt/product-groups', values, { globalLoading: true })
        .then((res) => {
          this.$notification.success({
            message: 'Сохранено',
          });
          this.$router.push({ name: 'ProductGroupEdit', params: { id: res.data.id } });
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>

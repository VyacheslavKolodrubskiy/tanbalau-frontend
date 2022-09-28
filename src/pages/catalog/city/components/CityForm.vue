<template>
  <AForm
    id="city_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="Город" name="name">
          <AInput v-model:value="form.name" size="large" />
        </AFormItem>
      </ACol>
      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="ГРЗ/Область" name="region_id">
          <SelectRegion v-model:value="form.region_id" size="large" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script>
import { getAxios } from '@/services/http/request';
import { vvRequired } from '@/utils/form-validators';

const formRules = {
  name: vvRequired,
  region_id: vvRequired,
};

export default {
  props: {
    dataId: {
      type: String,
      default: '',
    },
  },
  emits: ['submit'],
  data() {
    this.formRules = formRules;
    return {
      form: {
        name: '',
        region_id: '',
      },
    };
  },
  computed: {
    isEditing() {
      return !!this.dataId;
    },
  },
  created() {
    if (this.isEditing)
      this.readCity();
  },
  methods: {
    readCity() {
      return getAxios(`cities/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.name = data.name;
        this.form.region_id = data.region?.id;
      });
    },

    handleFinish(values) {
      this.$emit('submit', values);
    },
  },
};
</script>

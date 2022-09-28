<template>
  <AForm
    id="regions_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow>
      <ACol
        :lg="6"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Наименование" name="name">
          <AInput v-model:value="form.name" size="large" />
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
      this.readRegion();
  },
  methods: {
    readRegion() {
      return getAxios(`regions/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.name = data.name;
      });
    },

    handleFinish(values) {
      this.$emit('submit', values);
    },
  },
};
</script>

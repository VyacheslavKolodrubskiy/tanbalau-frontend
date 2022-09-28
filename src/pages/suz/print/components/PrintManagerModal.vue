<template>
  <AModal
    v-bind="$attrs"
    cancel-text="Отмена"
    :ok-button-props="{ htmlType: 'submit', form: 'set_manager_form' }"
    ok-text="Назначить"
    title="Назначение ответственного менеджера"
  >
    <AForm
      id="set_manager_form"
      layout="vertical"
      :model="form"
      :rules="formRules"
      @finish="finish"
    >
      <AFormItem label="Менеджер" name="manager_user_id">
        <SelectManager
          v-model:value="form.manager_user_id"
          size="large"
        />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script>
import { vvRequired } from '@/utils/form-validators';

export default {
  inheritAttrs: false,
  emits: ['submit'],
  data() {
    this.formRules = { manager_user_id: vvRequired };
    return {
      form: {
        manager_user_id: null,
      },
    };
  },
  methods: {
    finish(values) {
      this.$emit('submit', values);
    },
  },
};
</script>

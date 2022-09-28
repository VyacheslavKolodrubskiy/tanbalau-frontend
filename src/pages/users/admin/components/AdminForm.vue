<template>
  <AForm
    id="admin_form"
    layout="vertical"
    :model="state.form"
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
        <AFormItem label="ФИО" name="name">
          <AInput v-model:value="state.form.name" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem
          label="Телефон"
          name="phone"
          :rules="formRules.phone"
        >
          <AInput
            v-model:value="state.form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="state.formattedPhone = $event.target.dataset.maskRawValue"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :xs="0"
      />

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="Почта" name="email">
          <AInput
            v-model:value="state.form.email"
            autocomplete="new-password"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="Пароль" name="password">
          <AInputPassword
            v-model:value="state.form.password"
            autocomplete="new-password"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :xs="0"
      />

      <ACol
        :lg="16"
        :xs="24"
        :xxl="12"
      >
        <AFormItem label="Комментарий" name="note">
          <ATextarea
            v-model:value="state.form.note"
            :rows="4"
            size="large"
          />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import { vvPhone, vvRequired } from '@/utils/form-validators';
import type { ValidationRules } from '@/types';
import type { IAdmin } from '@/models/admin.model';
import { Admin } from '@/models/admin.model';
import { Executor } from '@/network/executor';
import { AdminService } from '@/services/admin.service';

interface Props {
  dataId?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  dataId: '',
});

const emit = defineEmits(['saved']);

const state = reactive({
  form: {
    name: '',
    phone: '',
    email: '',
    note: '',
  } as IAdmin,
  formattedPhone: '',
});

const isEditing = computed(() => !!props.dataId);

const formRules = computed<ValidationRules>(() => {
  return {
    name: vvRequired,
    phone: [
      vvRequired,
      vvPhone,
    ],
    email: vvRequired,
    password: {
      required: !isEditing.value,
      message: vvRequired.message,
    },
  };
});

function readAdmin() {
  Executor.run<Admin>({
    request: AdminService.readAdmin(props.dataId),
    globalLoading: true,
    onResult(data) {
      state.form = data;
    },
  });
}

function handleFinish(values: IAdmin) {
  values.phone = state.formattedPhone ? `7${state.formattedPhone}` : values.phone;

  const formModel = new Admin({
    email: values.email,
    name: values.name,
    note: values.note,
    password: values.password,
    phone: values.phone,
  });

  const request = isEditing.value
    ? AdminService.updateAdmin(props.dataId, formModel)
    : AdminService.createAdmin(formModel);

  Executor.run({
    request,
    globalLoading: true,
    onResult() {
      emit('saved');
    },
  });
}

if (isEditing.value)
  readAdmin();

</script>

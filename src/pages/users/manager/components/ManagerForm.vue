<template>
  <AForm
    id="manager_form"
    layout="vertical"
    :model="state.form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Филиал" name="branchId">
          <SelectBranch
            v-model:value="state.form.branchId"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="ФИО" name="name">
          <AInput v-model:value="state.form.name" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Телефон" name="phone">
          <AInput
            v-model:value="state.form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="state.formattedPhone = $event.target.dataset.maskRawValue"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :xs="0"
      />

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
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
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24"
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
        :lg="6"
        :xs="0"
      />

      <ACol
        :lg="12"
        :md="16"
        :xs="24"
      >
        <AFormItem label="Комментарий" name="note">
          <ATextarea
            v-model:value="state.form.note"
            :rows="4"
            size="large"
          />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
      >
        <AFormItem label="Активность" name="statusId">
          <ARadioGroup v-model:value="state.form.statusId">
            <ARadio :value="1">
              Да
            </ARadio>
            <ARadio :value="0">
              Нет
            </ARadio>
          </ARadioGroup>
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import { vvPhone, vvRequired } from '@/utils/form-validators';
import type { ValidationRules } from '@/types';
import type { IManager } from '@/models/manager.model';
import { Manager } from '@/models/manager.model';
import { Executor } from '@/network/executor';
import { ManagerService } from '@/services/manager.service';

interface Props {dataId?: string | number }

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
    password: '',
    statusId: undefined,
    branchId: undefined,
  } as IManager,
  formattedPhone: '',
});

const isEditing = computed(() => !!props.dataId);

const formRules = computed((): ValidationRules => {
  return {
    branchId: vvRequired,
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

function readManager() {
  Executor.run<Manager>({
    request: ManagerService.readManager(props.dataId),
    globalLoading: true,
    onResult(data) {
      state.form = data;
    },
  });
}

function handleFinish(values: IManager) {
  values.phone = state.formattedPhone ? `7${state.formattedPhone}` : values.phone;

  const formModel = new Manager({
    email: values.email,
    name: values.name,
    note: values.note,
    password: values.password,
    phone: values.phone,
    branchId: values.branchId,
    statusId: values.statusId,
  });

  const request = isEditing.value
    ? ManagerService.updateManager(props.dataId, formModel)
    : ManagerService.createManager(formModel);

  Executor.run({
    request,
    globalLoading: true,
    onResult() {
      emit('saved');
    },
  });
}

if (isEditing.value)
  readManager();

</script>

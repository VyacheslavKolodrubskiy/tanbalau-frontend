<template>
  <APageHeader title="Добавить “Заявку”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="application_form" />
    </template>
  </APageHeader>

  <ACard>
    <AForm
      id="application_form"
      layout="vertical"
      :model="form"
      :rules="formRules"
      @finish="submit"
    >
      <ARow :gutter="24">
        <ACol
          :lg="8"
          :md="18"
          :xs="24"
        >
          <AFormItem label="Организация Клиента" name="counterparty_id">
            <SelectCounterparty
              v-model:value="form.counterparty_id"
              :disabled="$canUse('client')"
              size="large"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="16"
          :xs="0"
        />

        <ACol
          :lg="10"
          :md="12"
          :xs="24"
        >
          <AFormItem label="Заголовок" name="title">
            <AInput v-model:value="form.title" size="large" />
          </AFormItem>
        </ACol>
        <ACol
          :lg="8"
          :md="12"
          :xs="24"
        >
          <AFormItem label="Категория" name="category">
            <SelectApplicationCategory
              v-model:value="form.category"
              size="large"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="18"
          :xs="24"
        >
          <AFormItem label="Описание заявки" name="description">
            <ATextarea v-model:value="form.description" :rows="4" />
          </AFormItem>
        </ACol>

        <ACol
          :xs="24"
        >
          <AFormItem label="Прикрепить файлы" name="files">
            <QUpload
              v-model:value="form.files"
              accept-base
              multiple
            >
              <QBtn size="large">
                <QIcon type="upload" />
                Добавить
              </QBtn>
            </QUpload>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </ACard>
</template>
<script setup lang="ts">
import { vvRequired } from '@/utils/form-validators';
import { postAxios } from '@/services/http/request';
import { checkPermission } from '@/utils/permissions';
import type { ValidationRules } from '@/types';
import { useUserStore } from '@/stores/user.store';

const formRules: ValidationRules = {
  counterparty_id: vvRequired,
  title: vvRequired,
  category: vvRequired,
  description: vvRequired,
};

const userStore = useUserStore();
const router = useRouter();

interface ApplicationForm {
  counterparty_id: string
  title: string
  category: string
  description: string
  files: object[]
}
const form: ApplicationForm = reactive({
  counterparty_id: '',
  title: '',
  category: '',
  description: '',
  files: [],
});

onMounted(() => {
  if (checkPermission('client'))
    form.counterparty_id = `${userStore.current?.counterparty?.id}`;
});

function submit(values) {
  postAxios('/application', values, { formDataConvert: true, globalLoading: true }).then((res) => {
    notification.success({ message: 'Сохранено' });
    router.push({ name: 'Application' });
  });
}
</script>

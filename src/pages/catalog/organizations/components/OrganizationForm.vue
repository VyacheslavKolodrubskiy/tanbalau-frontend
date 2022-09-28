<template>
  <AForm
    id="organizations_form"
    ref="formRef"
    layout="vertical"
    :model="state.form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ACard>
      <ARow class="mb-5 pb-2" :gutter="34">
        <ACol>
          <span class="fz-18 font-weight-semibold">Общая информация</span>
        </ACol>
      </ARow>
      <ARow :gutter="24">
        <ACol
          :lg="16"
          :sm="16"
          :xs="24"
          :xxl="8"
        >
          <AFormItem label="Наименование организации" name="title">
            <AInput
              v-model:value="state.form.title"
              size="large"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="16"
          :sm="16"
          :xs="24"
          :xxl="8"
        >
          <AFormItem label="Юр.адрес" name="legalAddress">
            <AInput
              v-model:value="state.form.legalAddress"
              size="large"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="8"
          :xs="0"
          :xxl="6"
        />

        <ACol
          :lg="8"
          :sm="12"
          :xs="24"
          :xxl="6"
        >
          <AFormItem label="ИИН/БИН организации" name="bin">
            <AInput
              v-model:value="state.form.bin"
              v-maska="'############'"
              :disabled="isDisabledBin"
              size="large"
              @input="onInput"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="8"
          :sm="12"
          :xs="24"
          :xxl="6"
        >
          <AFormItem label="E-mail" name="email">
            <AInput
              v-model:value="state.form.email"
              size="large"
              @input="onInput"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="8"
          :sm="12"
          :xs="24"
          :xxl="6"
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
      </ARow>
    </ACard>

    <ACard>
      <ARow class="my-5" :gutter="34">
        <ACol>
          <span class="fz-18 font-weight-semibold">Подключение ИС МПТ</span>
        </ACol>
      </ARow>
      <ARow :gutter="24">
        <ACol
          :lg="16"
          :sm="16"
          :xs="24"
          :xxl="8"
        >
          <AFormItem name="apiKey">
            <template #label>
              <div class="d-flex justify-content-between w-100">
                Apikey (НКТ)
                <RouterLink class="text-primary font-italic" :to="{ name: 'FaqView', params: { id: 2 } }">
                  Как получить Apikey?
                </RouterLink>
              </div>
            </template>
            <AInput
              v-model:value="state.form.apiKey"
              size="large"
            />
          </AFormItem>
        </ACol>
        <ACol
          :xs="0"
          :xxl="16"
        />
        <ACol
          :lg="16"
          :sm="16"
          :xs="24"
          :xxl="8"
        >
          <AFormItem name="clientToken">
            <template #label>
              <div class="d-flex justify-content-between w-100">
                ClientToken (СУЗ)
                <RouterLink class="text-primary font-italic" :to="{ name: 'FaqView', params: { id: 3 } }">
                  Как получить ClientToken?
                </RouterLink>
              </div>
            </template>
            <AInput
              v-model:value="state.form.clientToken"
              size="large"
            />
          </AFormItem>
        </ACol>
        <ACol
          :xs="0"
          :xxl="16"
        />
        <ACol
          :lg="16"
          :sm="16"
          :xs="24"
          :xxl="8"
        >
          <AFormItem name="omsId">
            <template #label>
              <div class="d-flex justify-content-between w-100">
                OMS ID  (СУЗ)
                <RouterLink class="text-primary font-italic" :to="{ name: 'FaqView', params: { id: 3 } }">
                  <span>Как получить OMS ID?</span>
                </RouterLink>
              </div>
            </template>
            <AInput
              v-model:value="state.form.omsId"
              size="large"
            />
          </AFormItem>
        </ACol>
      </ARow>
    </ACard>
  </AForm>
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { Signa } from '@/utils/signa';
import type { ValidationRules } from '@/types';
import { UiUtils } from '@/network/ui-utils';
import { Executor } from '@/network/executor';
import { OrganizationService } from '@/services/organization.service';
import { vvBinIin, vvPhone, vvRequired } from '@/utils/form-validators';
import type { IOrganization } from '@/models/organization.model';
import { Organization } from '@/models/organization.model';

interface Errors {
  bin: string[]
  email: string[]
}

interface Props {
  dataId?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  dataId: '',
});

defineExpose({ checkSigna });

const emit = defineEmits(['submit', 'signa-valid', 'success-check-bin-and-email']);

const state = reactive({
  form: {
    bin: '',
    email: '',
    omsId: '',
    phone: '',
    title: '',
    apiKey: '',
    clientToken: '',
    legalAddress: '',
  } as IOrganization,
  formattedPhone: '',
  errors: null as Errors | null,

});

const formRules = computed<ValidationRules>(() => {
  return {
    title: vvRequired,
    bin: [
      vvRequired,
      vvBinIin,
      {
        validator: validateUniqueFields,
      },
    ],
    legalAddress: vvRequired,
    email: [
      vvRequired,
      {
        validator: validateUniqueFields,
      },
    ],
    phone: [
      vvRequired,
      vvPhone,
    ],
  };
});

const signa = new Signa();
const router = useRouter();
const isDisabledBin = ref(false);
const formRef = ref<FormInstance>();
const isEditing = computed(() => !!props.dataId);

function onInput() {
  if (state.errors) {
    state.errors = null;
    formRef.value?.validate();
  }
}

async function validateUniqueFields(_rule: any) {
  switch (_rule.field) {
    case 'bin':
      // eslint-disable-next-line prefer-promise-reject-errors
      return state.errors?.bin ? Promise.reject() : Promise.resolve();
    case 'email':
      // eslint-disable-next-line prefer-promise-reject-errors
      return state.errors?.email ? Promise.reject() : Promise.resolve();
  }
}

function readCounterparty() {
  Executor.run<Organization>({
    request: OrganizationService.readOrganization(props.dataId),
    globalLoading: true,
    onResult(data) {
      state.form = data;
      isDisabledBin.value = true;
    },
  });
}

function handleFinish(values) {
  values.phone = state.formattedPhone ? `7${state.formattedPhone}` : values.phone;

  const formModel = new Organization({
    bin: values.bin,
    title: values.title,
    phone: values.phone,
    email: values.email,
    legalAddress: values.legalAddress,
  });

  if (props.dataId) {
    const formModel = new Organization({
      bin: values.bin,
      title: values.title,
      omsId: values.omsId,
      email: values.email,
      phone: values.phone,
      apiKey: values.apiKey,
      clientToken: values.clientToken,
      legalAddress: values.legalAddress,
    });

    emit('submit', formModel);
  } else {
    Executor.run({
      request: OrganizationService.validateBinEmail(formModel),
      ignoreError: true,
      onResult() {
        isDisabledBin.value = true;
        emit('success-check-bin-and-email');
      },
      onError(err) {
        const notificationConfig = err?.error?.data?.errors?.bin
          ? {
            btn: () =>
              h(
                Button,
                {
                  type: 'primary',
                  size: 'small',
                  onClick: () => router.push({ name: 'RecoverAccess', params: { bin: formModel.bin } }),
                },
                { default: () => 'Восстановить доступ' },
              ),
          }
          : {};
        UiUtils.showError(err, notificationConfig);
        state.errors = err?.error?.data?.errors;
        formRef.value?.validate();
      },
    });
  }
}

function resetForm() {
  state.form.bin = '';
  state.form.title = '';
  state.form.email = '';
  state.form.phone = '';
  state.form.omsId = '';
  state.form.apiKey = '';
  state.form.clientToken = '';
  state.form.legalAddress = '';
}

function checkSigna() {
  signa.getAuthInfo((res) => {
    if (res.certNotAfter >= Date.now()) {
      const counterpartyInfo = signa.getSubjectDN(res.subjectDn);
      if (state.form.bin === counterpartyInfo?.bin
      || state.form.bin === counterpartyInfo?.iin) {
        const formModel = new Organization({
          bin: state.form.bin,
          title: state.form.title,
          email: state.form.email,
          phone: state.form.phone,
          omsId: state.form.omsId,
          apiKey: state.form.apiKey,
          clientToken: state.form.clientToken,
          legalAddress: state.form.legalAddress,
        });

        if (props.dataId) {
          emit('signa-valid');
        } else {
          resetForm();

          emit('signa-valid', true);
          emit('submit', formModel);
        }
      } else {
        UiUtils.showError(new Error('БИН/ИИН не совпадает'));
        emit('signa-valid', false);
      }
    } else {
      UiUtils.showError(new Error('Срок действия сертификата истек'));
    }
  });
}

if (isEditing.value)
  readCounterparty();

</script>

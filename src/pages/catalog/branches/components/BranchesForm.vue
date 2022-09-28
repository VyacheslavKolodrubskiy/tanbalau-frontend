<template>
  <AForm
    id="branches_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="10"
      >
        <AFormItem label="Наименование" name="title">
          <AInput v-model:value="form.title" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="ГРЗ/Область" name="region_id">
          <SelectRegion
            v-model:value="form.region_id"
            label-in-value
            size="large"
            @change="onChangeRegion"
          />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="Город" name="city_id">
          <SelectCity
            ref="selectCity"
            v-model:value="form.city_id"
            :filters="{region_id: form.region_id?.value}"
            size="large"
            @change="() => onChangeCity"
          />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="10"
      >
        <AFormItem label="Адрес" name="address">
          <AInput v-model:value="form.address" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="E-mail" name="email">
          <AInput v-model:value="form.email" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <AFormItem label="Телефон" name="phone">
          <AInput
            v-model:value="form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="formattedPhone = $event.target.dataset.maskRawValue"
          />
        </AFormItem>
      </ACol>

      <ACol
        :lg="16"
        :xs="24"
        :xxl="10"
      >
        <AFormItem label="Местоположение" name="location">
          <SelectMapPoint v-model:point="form.location" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="16"
        :xs="24"
      >
        <AFormItem label="Комментарий" name="note">
          <ATextarea v-model:value="form.note" :rows="4" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
      >
        <AFormItem label="Активность" name="is_active">
          <ARadioGroup v-model:value="form.is_active">
            <ARadio :value="true">
              Да
            </ARadio>
            <ARadio :value="false">
              Нет
            </ARadio>
          </ARadioGroup>
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import { mask } from 'maska';
import { getAxios } from '@/services/http/request';
import { vvPhone, vvRequired } from '@/utils/form-validators';
import SelectMapPoint from '@/components/form/SelectMapPoint.vue';
import type SelectCity from '@/components/form/SelectCity.vue';

interface Props {
  dataId?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  dataId: '',
});

const emit = defineEmits(['submit']);

const selectCity = ref<typeof SelectCity.methods>();
const formattedPhone = ref<string>('');
const isEditing = computed(() => !!props.dataId);

const formRules = computed(() => {
  return {
    title: vvRequired,
    region_id: vvRequired,
    address: vvRequired,
    location: vvRequired,
    email: vvRequired,
    phone: [
      vvRequired,
      vvPhone,
    ],
  };
});

interface BranchesForm {
  title: string
  region_id: {
    label: string
    value: number
  } | null
  city_id: string
  address: string
  email: string
  phone: string
  location: string
  note: string
  is_active: null | boolean
}

const form: BranchesForm = reactive({
  title: '',
  region_id: null,
  city_id: '',
  address: '',
  email: '',
  phone: '',
  location: '',
  note: '',
  is_active: null,
});

function readBranch() {
  return getAxios(`branch/${props.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
    form.title = data.title;
    form.region_id = { value: data.region.id, label: data.region.name };
    form.city_id = data.city?.id;
    form.address = data.address;
    form.email = data.email;
    form.phone = mask(`${data.phone}`, '+7 (###) ### ## ##', undefined);
    form.location = data.location;
    form.note = data.note;
    form.is_active = data.is_active;

    refreshCityOptions();
  });
}

if (isEditing.value)
  readBranch();

function onChangeCity(_, fullValue) {
  if (!fullValue)
    return;
  form.region_id = { value: fullValue.region.id, label: fullValue.region.name };
}

function refreshCityOptions() {
  nextTick().then(() => selectCity.value?.getOptions());
}

function onChangeRegion() {
  form.city_id = '';
  refreshCityOptions();
}

function handleFinish(values) {
  values.region_id = values.region_id.value;
  values.is_active = +values.is_active;
  values.phone = formattedPhone.value ? `7${formattedPhone.value}` : values.phone;
  emit('submit', values);
}
</script>

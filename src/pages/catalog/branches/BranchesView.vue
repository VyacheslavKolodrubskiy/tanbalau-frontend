<template>
  <APageHeader title="Просмотр “Филиала”" @back="() => $router.go(-1)">
    <template #extra>
      <QLink
        v-if="$canUse(['admin'])"
        size="large"
        :to="{ name: 'CatalogBranchesEdit', params: { id: $route.params.id } }"
        type="primary"
      >
        Редактировать
      </QLink>
    </template>
  </APageHeader>
  <ACard v-if="branch.data">
    <ARow :gutter="[24,20]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <LabelValue label="Наименование">
          {{ branch.data.title }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <LabelValue label="ГРЗ/Область">
          {{ branch.data.region?.name }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <LabelValue label="Город">
          {{ branch.data.city?.name }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <LabelValue label="Адрес">
          {{ branch.data.address }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <LabelValue label="Телефон">
          {{ branch.data.phone }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6"
      >
        <LabelValue label="E-mail">
          {{ branch.data.email }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="16"
      >
        <LabelValue label="Комментарий">
          {{ branch.data.note }}
        </LabelValue>
      </ACol>
      <ACol :md="18" :xs="24">
        <LabelValue label="Местоположение" />
        <SelectMapPoint
          :default-city="branch.data.city?.name || branch.data.region?.name"
          :point="branch.data.location"
          readonly
        />
      </ACol>
      <ACol :xs="24">
        <LabelValue label="Активность">
          {{ $format(branch.data.is_active, 'yesno') }}
        </LabelValue>
      </ACol>
    </ARow>
  </ACard>
</template>

<script setup lang="ts">
import { getAxios } from '@/services/http/request';
import SelectMapPoint from '@/components/form/SelectMapPoint.vue';

interface BranchesView {
  address: string
  city: {
    id: number
    name: string
    region: {
      id: number
      name: string
    }
  }
  email: string
  id: number
  is_active: true
  location: string
  note: string
  phone: number
  region: {
    id: number
    name: string
  }
  title: string
}

const branch = reactive({ data: null as BranchesView | null });
const route = useRoute();

function readBranch() {
  return getAxios(`branch/${route.params.id}`, { globalLoading: true }).then((res) => {
    branch.data = res.data;
  });
}

readBranch();
</script>

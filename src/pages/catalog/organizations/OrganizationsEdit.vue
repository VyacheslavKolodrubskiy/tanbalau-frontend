<template>
  <APageHeader
    title="Редактировать “Организацию Клиента”"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <QBtn
        :disabled="proceed"
        size="large"
        type="primary"
        @click="checkSigna"
      >
        Подписать ЭЦП
      </QBtn>
      <CancelButton />
      <SubmitButton :disabled="!proceed" form="organizations_form" />
    </template>
  </APageHeader>
  <ACard>
    <OrganizationForm
      ref="child"
      :data-id="dataId"
      @signa-valid="signaValid"
      @submit="submit"
    />
  </ACard>
</template>

<script setup lang="ts">
import { Executor } from '@/network/executor';
import { Organization } from '@/models/organization.model';
import { OrganizationService } from '@/services/organization.service';
import OrganizationForm from '@/pages/catalog/organizations/components/OrganizationForm.vue';

const route = useRoute();
const router = useRouter();
const proceed = ref(false);
const child = ref<typeof OrganizationForm>();
const dataId = computed(() => route.params.id as string);

function checkSigna() {
  child.value?.checkSigna();
}

function signaValid() {
  proceed.value = true;
}

function submit(formModel: Organization) {
  Executor.run({
    request: OrganizationService.updateOrganization(dataId.value, formModel),
    globalLoading: true,
    onResult() {
      router.push({ name: 'OrganizationsView' });
    },
  });
}

</script>

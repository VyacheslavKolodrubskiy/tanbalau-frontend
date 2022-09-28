import AddLink from '@/components/buttons/AddLink.vue';
import ResetButton from '@/components/buttons/ResetButton.vue';
import QLink from '@/components/qlib/QLink.vue';
import LabelValue from '@/components/data-display/LabelValue.vue';
import QBtn from '@/components/qlib/QBtn.vue';
import QIcon from '@/components/qlib/QIcon.vue';
import QTable from '@/components/qlib/QTable.vue';
import QDatePicker from '@/components/qlib/QDatePicker.vue';
import QUpload from '@/components/qlib/QUpload.vue';
import QFileLink from '@/components/qlib/QFileLink.vue';
import QImg from '@/components/qlib/QImg.vue';
import TableActions from '@/components/tables/TableActions.vue';
import CancelButton from '@/components/buttons/CancelButton.vue';
import SubmitButton from '@/components/buttons/SubmitButton.vue';
import StatusTag from '@/components/data-display/StatusTag.vue';

// Selects
import SelectBranch from '@/components/form/SelectBranch.vue';
import SelectCounterparty from '@/components/form/SelectCounterparty.vue';
import SelectApplicationCategory from '@/components/form/SelectApplicationCategory.vue';
import SelectManager from '@/components/form/SelectManager.vue';
import SelectCustomer from '@/components/form/SelectCustomer.vue';
import SelectApplicationStatus from '@/components/form/SelectApplicationStatus.vue';
import SelectCreatedMethod from '@/components/form/SelectCreatedMethod.vue';
import SelectCountry from '@/components/form/SelectCountry.vue';
import SelectNpcCountry from '@/components/form/npc/SelectNpcCountry.vue';
import SelectReleaseMethod from '@/components/form/SelectReleaseMethod.vue';
import SelectMarkingStatus from '@/components/form/SelectMarkingStatus.vue';
import SelectGroupsStatus from '@/components/form/SelectGroupsStatus.vue';
import SelectPaymentStatus from '@/components/form/SelectPaymentStatus.vue';
import SelectRegion from '@/components/form/SelectRegion.vue';
import SelectCity from '@/components/form/SelectCity.vue';
import SelectOrder from '@/components/form/SelectOrder.vue';

export function registerGlobalComponents(app) {
  // https://youtrack.jetbrains.com/issue/WEB-48239
  const Vue = app; // For PHPStorm/WebStorm only hack to recognize global components

  Vue.component('QBtn', QBtn);
  Vue.component('QIcon', QIcon);
  Vue.component('QTable', QTable);
  Vue.component('QDatePicker', QDatePicker);
  Vue.component('QUpload', QUpload);
  Vue.component('QFileLink', QFileLink);
  Vue.component('QImg', QImg);
  Vue.component('QLink', QLink); // todo ??? refactor

  // Stable
  Vue.component('TableActions', TableActions);
  Vue.component('CancelButton', CancelButton);
  Vue.component('SubmitButton', SubmitButton);
  Vue.component('StatusTag', StatusTag);
  Vue.component('AddLink', AddLink);
  Vue.component('ResetButton', ResetButton);
  Vue.component('LabelValue', LabelValue);

  // Selects
  Vue.component('SelectCounterparty', SelectCounterparty);
  Vue.component('SelectBranch', SelectBranch);
  Vue.component('SelectApplicationCategory', SelectApplicationCategory);
  Vue.component('SelectManager', SelectManager);
  Vue.component('SelectCustomer', SelectCustomer);
  Vue.component('SelectApplicationStatus', SelectApplicationStatus);
  Vue.component('SelectCreatedMethod', SelectCreatedMethod);
  Vue.component('SelectCountry', SelectCountry);
  Vue.component('SelectNpcCountry', SelectNpcCountry);
  Vue.component('SelectReleaseMethod', SelectReleaseMethod);
  Vue.component('SelectMarkingStatus', SelectMarkingStatus);
  Vue.component('SelectGroupsStatus', SelectGroupsStatus);
  Vue.component('SelectPaymentStatus', SelectPaymentStatus);
  Vue.component('SelectRegion', SelectRegion);
  Vue.component('SelectCity', SelectCity);
  Vue.component('SelectOrder', SelectOrder);
}

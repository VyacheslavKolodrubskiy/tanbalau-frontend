<template>
  <div>
    <APageHeader title="Просмотр “Списка товаров”" @back="() => $router.go(-1)">
      <template #tags>
        <StatusTag
          v-if="!showSpinner"
          class="mr-4"
          :variant="getProductStatusVariant(pervForm.status?.id)"
        >
          {{ pervForm.status?.title }}
        </StatusTag>
        <QBtn
          v-else
          class="mr-4"
          ghost
          size="small"
          type="primary"
        >
          <QIcon spin type="sync" />
        </QBtn>
        <QBtn
          size="small"
          type="warning"
          @click="updateStatus"
        >
          <QIcon type="retweet" />
        </QBtn>
      </template>
      <template #extra>
        <SubmitButton
          v-if="showSubmit"
          @click="sendModeration"
        >
          Отправить на модерацию
        </SubmitButton>
      </template>
    </APageHeader>
    <ACard>
      <AForm v-if="productGroup" layout="vertical">
        <ARow :gutter="24">
          <ACol :span="8">
            <AFormItem label="Наименование группы товаров">
              <AInput
                v-model:value="productGroup.title"
                disabled
                size="large"
              />
            </AFormItem>
          </ACol>

          <ACol :span="8">
            <AFormItem label="Организация">
              <ARow>
                <ACol :span="24">
                  <AInput
                    v-model:value="productGroup.counterparty.title"
                    disabled
                    size="large"
                  />
                </ACol>
              </ARow>
            </AFormItem>
          </ACol>
        </ARow>
        <ARow :gutter="24">
          <ACol :span="8">
            <ARow>
              <ACol :span="24">
                <AFormItem label="Производитель">
                  <AInput
                    v-model:value="productGroup.producer.title"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    v-model:value="productGroup.producer.bin"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    v-model:value="productGroup.producer.gcp"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ARow :gutter="24">
                <ACol :span="11">
                  <AFormItem>
                    <AInput
                      v-model:value="productGroup.producer.country.title"
                      disabled
                      size="large"
                    />
                  </AFormItem>
                </ACol>
                <ACol :span="13">
                  <AFormItem>
                    <AInput
                      v-model:value="productGroup.producer.legal_address"
                      disabled
                      size="large"
                    />
                  </AFormItem>
                </ACol>
              </ARow>
            </ARow>
          </ACol>
          <ACol :span="8">
            <ARow v-for="(item, index) in productGroup.manufacturers" :key="index">
              <ACol :span="24">
                <AFormItem label="Изготовитель">
                  <AInput
                    v-model:value="item.title"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    v-model:value="item.bin"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    v-model:value="item.gcp"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ARow :gutter="24">
                <ACol :span="11">
                  <AFormItem>
                    <AInput
                      v-model:value="item.country.title"
                      disabled
                      size="large"
                    />
                  </AFormItem>
                </ACol>
                <ACol :span="13">
                  <AFormItem>
                    <AInput
                      v-model:value="item.legal_address"
                      disabled
                      size="large"
                    />
                  </AFormItem>
                </ACol>
              </ARow>
            </ARow>
          </ACol>
          <ACol v-if="productGroup.importer" :span="8">
            <ARow>
              <ACol :span="24">
                <AFormItem label="Импортер">
                  <AInput
                    v-model:value="productGroup.importer.title"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    v-model:value="productGroup.importer.bin"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    v-model:value="productGroup.importer.gcp"
                    disabled
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ARow :gutter="24">
                <ACol :span="11">
                  <AFormItem>
                    <AInput
                      v-model:value="productGroup.importer.country.title"
                      disabled
                      size="large"
                    />
                  </AFormItem>
                </ACol>
                <ACol :span="13">
                  <AFormItem>
                    <AInput
                      v-model:value="productGroup.importer.legal_address"
                      disabled
                      size="large"
                    />
                  </AFormItem>
                </ACol>
              </ARow>
            </ARow>
          </ACol>
        </ARow>
      </AForm>
      <ADivider />
      <div class="mb-4 text-right">
        <SubmitButton :disabled="!isSubmitProductDisabled" form="npc_group_form">
          Сохранить товар
        </SubmitButton>
      </div>
      <ARow>
        <ACol :span="25">
          <NPCGroupForm
            :comment="activeComment"
            :product="currentProduct"
            :registration-status="activeRegisterStatusId"
            :status="activeProductStatusId"
            @send-form="updateProduct"
          />
        </ACol>
      </ARow>
      <div class="mt-4 text-right">
        <SubmitButton :disabled="!isSubmitProductDisabled" form="npc_group_form">
          Сохранить товар
        </SubmitButton>
      </div>
    </ACard>
    <div
      class="d-none"
      :class="{'spinner-wrapper': loading}"
    >
      <ASpin size="large" />
    </div>
    <div class="d-none" :class="{'overlay': loading}" />
  </div>
</template>

<script>
import {
  getProductStatusVariant,
  isEmpty,
  removeEmpty,
  removeEmptyObjInArray,
} from '@/utils/utils';
import { getAxios, postAxios, putAxios } from '@/services/http/request';
import { PHOTO_TYPES, PRODUCT_STATUSES, REGISTER_STATUSES } from '@/config/types';
import NPCGroupForm from '@/pages/npc/groups/NPCGroupForm.vue';
import { useGlobalLoading } from '@/composables/useLoading';

export default {
  components: {
    NPCGroupForm,
  },
  setup() {
    const { isLoading } = useGlobalLoading();
    return { loading: isLoading };
  },
  data() {
    return {
      form: {},
      currentProduct: {
        first_package: {},
        second_package: {},
        production_countries: [
          { country_id: '' },
        ],
        standard_number_matching: [
          { matching_id: '' },
        ],
      },
      productGroup: null,
      pervForm: {},
      currentForm: {},
      activeProductStatusId: '',
      activeRegisterStatusId: '',
      activeComment: {},
    };
  },
  computed: {
    showSpinner() {
      return this.activeRegisterStatusId === REGISTER_STATUSES.in_process.id;
    },
    showSubmit() {
      if (this.activeRegisterStatusId === REGISTER_STATUSES.in_process.id)
        return false;

      return (this.activeProductStatusId === PRODUCT_STATUSES.errors.id) && this.$canUse(['client']);
    },

    isSubmitProductDisabled() {
      if (this.activeRegisterStatusId === REGISTER_STATUSES.in_process.id)
        return false;

      return (this.activeProductStatusId === PRODUCT_STATUSES.draft.id
      || this.activeProductStatusId === PRODUCT_STATUSES.errors.id || this.activeProductStatusId === PRODUCT_STATUSES.layout.id) && this.$canUse(['client']);
    },

  },
  beforeMount() {
    this.readProduct().then(() => {
      this.readProductGroup();
    });
  },
  methods: {
    updateStatus() {
      return getAxios(`/nkt/products/${this.$route.params.id}/status`, {}, { globalLoading: true }).then((res) => {
        this.activeRegisterStatusId = res.register_status?.id;
        this.readProduct();
      });
    },
    readProductGroup() {
      return getAxios(`/nkt/product-groups/${this.pervForm?.product_group_id}`, {}, { globalLoading: true }).then((res) => {
        this.productGroup = res.data;
      });
    },
    readRequest(gtin) {
      return getAxios(`nkt/products/${gtin}/actual-request`, {}, { globalLoading: true })
        .then(async(res) => {
          this.pervForm = res.data;
          this.activeProductStatusId = res.status.id;
          this.activeRegisterStatusId = REGISTER_STATUSES.in_process.id;
          this.currentProduct = await this.setDataForm(res.data);
        });
    },
    readProduct() {
      return getAxios(`/nkt/products/${this.$route.params.id}`, {}, { globalLoading: true })
        .then(async({ data }) => {
          this.pervForm = data;
          this.activeProductStatusId = data.status.id;
          this.activeRegisterStatusId = data.register_status.id;
          this.currentProduct = await this.setDataForm(data);
          if (this.activeProductStatusId === PRODUCT_STATUSES.errors.id)
            this.readComment();
        });
    },
    updateProduct(values) {
      for (const propert in values) {
        if (Array.isArray(values[propert]))
          values[propert] = removeEmptyObjInArray(values[propert]);
        else if (values[propert] == null)
          values[propert] = '';

        else if (typeof values[propert] === 'object' && values[propert] !== null)
          values[propert] = removeEmpty(values[propert], true);
      }
      values.photos = values.photos.filter(element => isEmpty(element.photo) !== true);

      putAxios(`/nkt/products/${this.$route.params.id}`, values,
        { formDataConvert: true, globalLoading: true })
        .then(() => {
          this.$notification.success({
            message: 'Обновлен успешно',
          });
          this.readRequest(values.gtin);
        });
    },
    async setDataForm(data) {
      return {
        id: data?.id,
        product_group_id: data?.product_group_id,
        gtin: data?.gtin,
        title: data?.title,
        trademark_name: data?.trademark_name,
        model_title_number: data?.model_title_number,
        gpc_id: data?.gpc?.id || (data?.gpc_id ? +data.gpc_id : ''),
        guarantee_period_type_id: data?.guarantee_period_type?.id || (data?.guarantee_period_type_id ? +data.guarantee_period_type_id : ''),
        kpved_id: data?.kpved?.id || (data?.kpved_id ? +data.kpved_id : ''),
        gender_id: data?.gender?.id || (data?.gender_id ? +data.gender_id : ''),
        model_type_id: data?.model_type?.id || (data?.model_type_id ? +data.model_type_id : ''),
        shoe_color_id: data?.shoe_color?.id || (data?.shoe_color_id ? +data.shoe_color_id : ''),
        shoe_material_down_id: data?.shoe_material_down?.id || (data?.shoe_material_down_id ? +data.shoe_material_down_id : ''),
        shoe_material_lining_id: data?.shoe_material_lining?.id || (data?.shoe_material_lining_id ? +data.shoe_material_lining_id : ''),
        shoe_material_up_id: data?.shoe_material_up?.id || (data?.shoe_material_up_id ? +data.shoe_material_up_id : ''),
        shoe_purpose_id: data?.shoe_purpose?.id || (data?.shoe_purpose_id ? +data.shoe_purpose_id : ''),
        shoe_size_id: data?.shoe_size?.id || (data?.shoe_size_id ? +data.shoe_size_id : ''),
        shoe_type_id: data?.shoe_type?.id || (data?.shoe_type_id ? +data.shoe_type_id : ''),
        sign_address_id: data?.sign_address?.id || (data?.sign_address_id ? +data.sign_address_id : ''),
        sign_conformity_id: data?.sign_conformity?.id || (data?.sign_conformity_id ? +data.sign_conformity_id : ''),
        standard_number_type_id: data?.standard_number_type?.id || (data?.standard_number_type_id ? +data.standard_number_type_id : ''),
        standart_certificate_type_id: data?.standart_certificate_type?.id || (data?.standart_certificate_type_id ? +data.standart_certificate_type_id : ''),
        tnved_id: data?.tnved?.id || (data?.tnved_id ? +data.tnved_id : ''),
        trademark_country_id: data?.trademark_country?.id || (data?.trademark_country_id ? +data.trademark_country_id : ''),
        second_package: {
          closure_material_id: data?.second_package?.closure_material?.id || (data?.second_package?.closure_material_id ? +data.second_package.closure_material_id : ''),
          closure_type_id: data?.second_package?.closure_type?.id || (data?.second_package?.closure_type_id ? +data.second_package.closure_type_id : ''),
          package_type_id: data?.second_package?.package_type?.id || (data?.second_package?.package_type_id ? +data.second_package.package_type_id : ''),
          package_depth: data?.second_package?.package_depth || (data?.second_package?.package_depth ? +data.second_package.package_depth : ''),
          package_height: data?.second_package?.package_height || (data?.second_package?.package_height ? +data.second_package.package_height : ''),
          package_width: data?.second_package?.package_width || (data?.second_package?.package_width ? +data.second_package.package_width : ''),
          package_weight: data?.second_package?.package_weight || (data?.second_package?.package_weight ? +data.second_package.package_weight : ''),
          package_material_id: data?.second_package?.package_material?.id || (data?.second_package?.package_material_id ? +data.second_package.package_material_id : ''),
        },
        first_package: {
          closure_material_id: data?.first_package?.closure_material?.id || (data?.first_package?.closure_material_id ? +data.first_package.closure_material_id : ''),
          closure_type_id: data?.first_package?.closure_type?.id || (data?.first_package?.closure_type_id ? +data.first_package.closure_type_id : ''),
          package_type_id: data?.first_package?.package_type?.id || (data?.first_package?.package_type_id ? +data.first_package.package_type_id : ''),
          package_depth: data?.first_package?.package_depth || (data?.first_package?.package_depth ? +data.first_package.package_depth : ''),
          package_height: data?.first_package?.package_height || (data?.first_package?.package_height ? +data.first_package.package_height : ''),
          package_width: data?.first_package?.package_width || (data?.first_package?.package_width ? +data.first_package.package_width : ''),
          package_weight: data?.first_package?.package_weight || (data?.first_package?.package_weight ? +data.first_package.package_weight : ''),
          package_material_id: data?.first_package?.package_material?.id || (data?.first_package?.package_material_id ? +data.first_package.package_material_id : ''),
        },
        standard_certificate_date_expire: data?.standard_certificate_date_expire,
        standard_certificate_date_issue: data?.standard_certificate_date_issue,
        standard_certificate_number: data?.standard_certificate_number,
        trademark_certificate_number: data?.trademark_certificate_number,
        trademark_certificate_date_issue: data?.trademark_certificate_date_issue,
        trademark_certificate_date_expire: data?.trademark_certificate_date_expire,
        care_instruction: data?.care_instruction,
        guarantee_period: data?.guarantee_period,
        standard_number: data?.standard_number,
        standard_number_matching: data?.standard_number_matching?.length ? this.convertIdInArr(data?.standard_number_matching, 'matching_id') : '' || [{ matching_id: '' }],
        production_countries: data?.production_countries?.length ? this.convertIdInArr(data?.production_countries, 'country_id') : '' || [{ country_id: '' }],
        child_access: data ? (Object.prototype.hasOwnProperty.call(data.child_access || {}, 'value') ? data.child_access?.value : +data.child_access) : '',
        status: {
          id: data?.status?.id,
          title: data?.status?.title,
        },
        photos: await this.setPhotosVariables().then((res) => { return res; }),
      };
    },
    convertIdInArr(arr, fieldIid) {
      return arr.map((item) => {
        return {
          [fieldIid]: +item[fieldIid],
          id: item?.id,
        };
      });
    },
    async setPhotosVariables() {
      const photosVariable = Object.values(PHOTO_TYPES).map((type) => {
        return {
          photo_type_id: type.id,
          photo: [],
        };
      });

      const photosInProduct = await new Promise((resolve) => {
        getAxios(`/nkt/products/${this.$route.params.id}`, {}, { globalLoading: true })
          .then(({ data }) => {
            resolve(data?.photos);
          });
      });

      return photosVariable.map((photo) => {
        return {
          photo_type_id: photo.photo_type_id,
          photo: photosInProduct?.length ? this.getOutsidePhoto(photosInProduct, photo.photo_type_id) : [],
        };
      });
    },
    getOutsidePhoto(photos, photoId) {
      const newPhotos = photos
        .filter(outsidePhoto => outsidePhoto.photo_type === photoId)
        .map((photo) => {
          return {
            uid: +photo.id,
            photo_type: +photo?.photo_type,
            name: photo.name,
            url: photo.path,
          };
        });
      return newPhotos;
    },
    sendModeration() {
      postAxios(`/nkt/products/${this.$route.params.id}/send-moderation`, {}, { globalLoading: true })
        .then(async() => {
          this.$notification.success({
            message: 'Товар отправлен на модерацию',
          });
          this.readProduct();
        });
    },
    readComment() {
      return getAxios(`nkt/products/${this.$route.params.id}/good-comment`, {}, { globalLoading: true })
        .then(async({ data }) => {
          this.activeComment = data;
        });
    },
    getProductStatusVariant,
  },
};
</script>

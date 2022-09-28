<template>
  <div class="npc-group">
    <APageHeader title="Добавить “Группу товаров”" @back="() => $router.go(-1)">
      <template #tags>
        <QBtn
          class="mr-4"
          size="small"
          type="warning"
          @click="updateStatus"
        >
          <QIcon type="retweet" />
        </QBtn>
        <StatusTag :variant="getGroupStatusVariant(group?.status?.id)">
          {{ group?.status?.title }}
        </StatusTag>
      </template>
      <template #extra>
        <SubmitButton
          v-if="showModerationSubmit"
          @click="sendModeration"
        >
          Отправить на модерацию
        </SubmitButton>
      </template>
    </APageHeader>
    <ACard>
      <ADivider class="mb-6" orientation="left">
        Шаг 1. Информация о производстве
      </ADivider>
      <AForm
        layout="vertical"
      >
        <ARow :gutter="24">
          <ACol :span="8">
            <AFormItem label="Наименование группы товаров">
              <AInput
                disabled
                size="large"
                :value="group && group.title"
              />
            </AFormItem>
          </ACol>

          <ACol :span="8">
            <AFormItem label="Организация">
              <ARow>
                <ACol :span="24">
                  <AInput
                    disabled
                    size="large"
                    :value="group && group.counterparty.title"
                  />
                </ACol>
              </ARow>
            </AFormItem>
          </ACol>
        </ARow>

        <ARow v-if="group" :gutter="24">
          <ACol :span="8">
            <ARow>
              <ACol :span="24">
                <AFormItem label="Производитель">
                  <AInput
                    disabled
                    size="large"
                    :value="group.producer && group.producer.title"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    disabled
                    size="large"
                    :value="group.producer && group.producer.bin"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    disabled
                    size="large"
                    :value="group.producer && group.producer.gcp"
                  />
                </AFormItem>
              </ACol>
              <ARow :gutter="24">
                <ACol :span="11">
                  <AFormItem>
                    <AInput
                      disabled
                      size="large"
                      :value="group.producer && group.producer.country.title"
                    />
                  </AFormItem>
                </ACol>
                <ACol :span="13">
                  <AFormItem>
                    <AInput
                      disabled
                      size="large"
                      :value="group.producer && group.producer.legal_address"
                    />
                  </AFormItem>
                </ACol>
              </ARow>
            </ARow>
          </ACol>
          <ACol :span="8">
            <ARow
              v-for="(item, index) in group.manufacturers"
              :key="index"
            >
              <ACol :span="24">
                <AFormItem label="Изготовитель">
                  <AInput
                    disabled
                    size="large"
                    :value="item.title"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    disabled
                    size="large"
                    :value="item.bin"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    disabled
                    size="large"
                    :value="item.gcp"
                  />
                </AFormItem>
              </ACol>
              <ARow :gutter="24">
                <ACol :span="11">
                  <AFormItem>
                    <AInput
                      disabled
                      size="large"
                      :value="item.country.title"
                    />
                  </AFormItem>
                </ACol>
                <ACol :span="13">
                  <AFormItem>
                    <AInput
                      disabled
                      size="large"
                      :value="item.legal_address"
                    />
                  </AFormItem>
                </ACol>
              </ARow>
            </ARow>
          </ACol>
          <ACol v-if="group && group.importer" :span="8">
            <ARow>
              <ACol :span="24">
                <AFormItem label="Импортер">
                  <AInput
                    disabled
                    size="large"
                    :value="group.importer.title"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    disabled
                    size="large"
                    :value="group.importer.bin"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem>
                  <AInput
                    disabled
                    size="large"
                    :value="group.importer.gcp"
                  />
                </AFormItem>
              </ACol>
              <ARow :gutter="24">
                <ACol :span="11">
                  <AFormItem>
                    <AInput
                      disabled
                      size="large"
                      :value="group.importer.country && group.importer.country.title"
                    />
                  </AFormItem>
                </ACol>
                <ACol :span="13">
                  <AFormItem>
                    <AInput
                      disabled
                      size="large"
                      :value="group.importer.legal_address"
                    />
                  </AFormItem>
                </ACol>
              </ARow>
            </ARow>
          </ACol>
        </ARow>
      </AForm>
    </ACard>
    <ACard>
      <ADivider class="mb-6" orientation="left">
        Шаг 2. Информация о товарах
      </ADivider>
      <div class="mb-4 text-right">
        <StatusTag class="mr-5" :variant="getProductStatusVariant(activeProductStatus?.id)">
          {{ activeProductStatus?.title }}
        </StatusTag>
        <SubmitButton
          v-if="showSubmit"
          class="mb-3"
          form="npc_group_form"
        >
          Сохранить товар
        </SubmitButton>
      </div>
      <ARow>
        <ACol :span="6">
          <NPCGroupSidebar
            v-if="activeProductId || activeProductId===0"
            :active-product-id="activeProductId"
            :group-status="group?.status"
            :products="group?.products"
            @create-form="addProductForm"
            @duplicate="duplicateProduct"
            @select="selectProduct"
          />
        </ACol>
        <ACol :span="18">
          <NPCGroupForm
            :comment="activeComment"
            :product="activeProduct"
            :registration-status="activeRegistrationStatus?.id"
            :status="activeProductStatus?.id"
            @send-form="submitProduct"
          />
        </ACol>
      </ARow>
      <div class="mt-4 text-right">
        <SubmitButton v-if="showSubmit" form="npc_group_form">
          Сохранить товар
        </SubmitButton>
      </div>
    </ACard>
    <AModal
      v-model:visible="modalVisible"
      centered
      footer=""
      title="Ошибка при сохранении!"
    >
      {{ errorMessage }}
    </AModal>
  </div>
</template>
<script>

import {
  getGroupStatusVariant,
  getProductStatusVariant,
  isEmpty,
  removeEmpty,
  removeEmptyObjInArray,
} from '@/utils/utils';
import { PHOTO_TYPES, PRODUCT_STATUSES, REGISTER_STATUSES } from '@/config/types';

import NPCGroupSidebar from '@/pages/npc/groups/NPCGroupSidebar.vue';
import NPCGroupForm from '@/pages/npc/groups/NPCGroupForm.vue';

import { getAxios, postAxios, putAxios } from '@/services/http/request';

export default {
  name: 'ProductGroupEdit',
  components: {
    NPCGroupForm,
    NPCGroupSidebar,
  },

  data() {
    return {
      group: null,
      activeProduct: {
        first_package: {},
        second_package: {},
        production_countries: [
          { country_id: '' },
        ],
        standard_number_matching: [
          { matching_id: '' },
        ],
      },
      activeProductId: '',
      activeComment: {},
      pervForm: {},
      errorMessage: null,
      modalVisible: false,
      activeProductStatus: null,
    };
  },
  computed: {
    showSubmit() {
      if (this.$canUse('client')) {
        if (!this.activeProductStatus || !this.activeRegistrationStatus)
          return false;

        return (this.activeProductStatus.id === PRODUCT_STATUSES.draft.id && this.activeRegistrationStatus.id !== REGISTER_STATUSES.in_process.id)
            || (this.activeProductStatus.id === PRODUCT_STATUSES.errors.id && this.activeRegistrationStatus.id !== REGISTER_STATUSES.in_process.id)
            || (this.activeProductStatus.id === PRODUCT_STATUSES.layout.id && this.activeRegistrationStatus.id !== REGISTER_STATUSES.in_process.id);
      } else {
        return false;
      }
    },
    showModerationSubmit() {
      if (!this.group?.products.length)
        return;

      return this.group.products
        .every((product) => {
          return (product?.register_status.id !== REGISTER_STATUSES.in_process.id)
          && [
            PRODUCT_STATUSES.draft.id,
            PRODUCT_STATUSES.errors.id,
          ].includes(product.status.id);
        },
        );
    },

    activeRegistrationStatus() {
      if (this.group?.products)
        return this.group?.products?.filter(product => product.id === this.activeProductId)[0]?.register_status;

      return {};
    },
  },
  async created() {
    await this.readGroup();
    if (this.group?.products[0])
      await this.readFirstProduct();
  },
  methods: {
    getProductStatusVariant,
    getGroupStatusVariant,
    async readFirstProduct() {
      this.activeProductId = this.group.products[0].id;
      this.activeProductStatus = this.group.products[0].status;
      if (this.activeRegistrationStatus.id === 1) {
        await this.readProduct(this.activeProductId);
      } else {
        await this.readRequest(this.group.products[0].gtin);
        await this.readErrors(this.group.products[0].gtin);
      }
      if (this.activeProductStatus.id === PRODUCT_STATUSES.errors.id)
        await this.readComment(this.activeProductId);
    },
    readErrors(gtin) {
      return getAxios(`nkt/products/${+gtin}/errors`, {}, { globalLoading: true })
        .then((res) => {
          this.errorMessage = res.message || '';
          this.modalVisible = !!this.errorMessage;
        });
    },
    async addProductForm(activeProductIdNull = true) {
      this.group.products.push(
        {
          gtin: 0,
          id: 0,
          shoe_color: { id: null, title: null },
          shoe_size: { id: null, title: null },
          status: { id: 6, title: 'Макет' },
          first_package: {},
          second_package: {},
          register_status: { id: 1, title: 'Без ошибок' },
          production_countries: [
            { country_id: '' },
          ],
          standard_number_matching: [
            { matching_id: '' },
          ],
        },
      );

      this.activeProductStatus = { id: 6, title: 'Макет' };
      this.activeProductId = activeProductIdNull ? 0 : this.activeProductId;
      this.activeProduct = await this.setDataForm();
    },
    readGroup() {
      return getAxios(`/nkt/product-groups/${this.$route.params.id}`, {}, { globalLoading: true })
        .then((res) => {
          this.group = res.data;
        });
    },
    readProduct(id) {
      return getAxios(`/nkt/products/${id}`, {}, { globalLoading: true })
        .then(async({ data }) => {
          this.pervForm = data;
          this.activeProduct = await this.setDataForm(data);
        });
    },
    readRequest(gtin) {
      return getAxios(`nkt/products/${+gtin}/actual-request`, {}, { globalLoading: true })
        .then(async(res) => {
          this.pervForm = res.data;
          this.activeProduct = await this.setDataForm(res.data);
        });
    },
    readOnlyPhotoInProduct(id) {
      this.loading = true;
      return getAxios(`/nkt/products/${id}`, {}, { globalLoading: true })
        .then(({ data }) => {
          this.pervForm = data;
          this.activeProduct = this.setDataForm(data);
        });
    },
    submitProduct(data) {
      const values = { ...data };
      values.product_group_id = +this.$route.params.id;
      for (const propert in values) {
        if (Array.isArray(values[propert]))
          values[propert] = removeEmptyObjInArray(values[propert]);
        else if (values[propert] == null)
          values[propert] = '';

        else if (typeof values[propert] === 'object' && values[propert] !== null)
          values[propert] = removeEmpty(values[propert], true);
      }
      values.photos = values.photos.filter(element => isEmpty(element.photo) !== true);
      if (this.activeProductId)
        this.updateProduct(this.activeProductId, values);
      else
        this.createProduct(values);
    },
    updateProduct(id, values) {
      putAxios(`/nkt/products/${id}`, values,
        { formDataConvert: true, globalLoading: true })
        .then(() => {
          this.$notification.success({
            message: 'Обновлен успешно',
          });
          this.readGroup();
          this.readRequest(values.gtin);
          this.activeProductId = id;
        });
    },
    createProduct(values) {
      postAxios('/nkt/products/', values,
        { formDataConvert: true, globalLoading: true })
        .then((res) => {
          this.$notification.success({
            message: 'Отправлен успешно',
          });
          this.readGroup();
          this.activeProductId = res.data.id;
          this.readRequest(res.data.gtin);
        });
    },
    async setDataForm(data) {
      return {
        id: data?.id || '',
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
        if (this.activeProductId) {
          this.loading = true;
          getAxios(`/nkt/products/${this.activeProductId}`, {}, { globalLoading: true })
            .then(({ data }) => {
              resolve(data?.photos);
            });
        } else { resolve(false); }
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
    async duplicateProduct(id, gtin, registerStatus) {
      this.activeProductId = id;
      await this.addProductForm(false);
      if (registerStatus === REGISTER_STATUSES.without_errors.id)
        await this.readProduct(id);
      else
        await this.readRequest(gtin);

      this.activeProductId = 0;
      this.activeProduct.gtin = '';
      this.activeProduct.id = 'dublicate';
    },
    async selectProduct(productId, productGtin, statusProduct) {
      await this.readGroup();
      this.activeProductStatus = statusProduct;
      this.activeProductId = productId;
      this.activeComment = {};
      if (this.activeRegistrationStatus?.id === REGISTER_STATUSES.without_errors.id) {
        await this.readProduct(productId);
      } else if (this.activeRegistrationStatus?.id === REGISTER_STATUSES.with_errors.id) {
        await this.readErrors(productGtin);
        await this.readRequest(productGtin);
      } else if (this.activeRegistrationStatus?.id === REGISTER_STATUSES.in_process.id) {
        await this.readRequest(productGtin);
      } else {
        this.activeProduct = await this.setDataForm();
      }
      if (this.activeProductStatus.id === PRODUCT_STATUSES.errors.id)
        await this.readComment(productId);
    },
    updateStatus() {
      return getAxios(`/nkt/products/${this.$route.params.id}/statuses`, {}, { globalLoading: true })
        .then(async() => {
          await this.readGroup();
          if (this.group?.products[0])
            await this.readFirstProduct();
        });
    },
    sendModeration() {
      postAxios(`/nkt/product-groups/${this.$route.params.id}/send-moderation`, {}, { globalLoading: true })
        .then(async() => {
          this.$notification.success({
            message: 'Группа товаров отправлена на модерацию',
          });
          this.readGroup();
          if (this.group?.products[0])
            await this.readFirstProduct();
        });
    },
    readComment(id) {
      return getAxios(`nkt/products/${id}/good-comment`, {}, { globalLoading: true })
        .then(async({ data }) => {
          this.activeComment = data;
        });
    },
  },
};
</script>
<style lang="scss" scoped>

</style>

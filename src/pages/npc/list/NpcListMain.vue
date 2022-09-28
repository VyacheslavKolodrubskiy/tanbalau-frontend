<template>
  <div class="providers">
    <APageHeader title="Список товаров">
      <template #extra>
        <AddLink v-if="$canUse(['client'])" :to="{ name: 'GroupsAdd' }" />
      </template>
    </APageHeader>
    <AForm class="page-filter" layout="vertical">
      <ARow
        :gutter="24"
      >
        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Наименование">
            <AInput
              v-model:value="filters.title"
              placeholder="Наименование"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          v-if="!$canUse('client')"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Организация">
            <SelectCounterparty
              v-model:value="filters.counterparty"
              placeholder="Организация"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="GTIN товара">
            <AInputNumber
              v-model:value="filters.gtin"
              placeholder="GTIN товара"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem
            label="Цвет"
          >
            <SelectNpcShoeColors
              v-model:value="filters.shoeColor"
              placeholder="Цвет"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem label="Торговая марка">
            <AInput
              v-model:value="filters.trademarkName"
              placeholder="Торговая марка"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem
            label="ТНВЭД"
          >
            <SelectNpcTnved
              v-model:value="filters.tnved"
              placeholder="ТНВЭД"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem
            label="GPC"
          >
            <SelectNpcGpc
              v-model:value="filters.gpc"
              placeholder="GPC"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem
            label="Вид обуви"
          >
            <SelectNpcShoeTypes
              v-model:value="filters.shoeType"
              placeholder="Вид обуви"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem
            label="Назначение обуви"
          >
            <SelectNpcShoePurposes
              v-model:value="filters.shoePurpose"
              placeholder="Назначение обуви"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4"
        >
          <AFormItem
            label="Статус"
          >
            <SelectProductStatuses
              v-model:value="filters.status"
              :max-tag-count="2"
              mode="multiple"
              placeholder="Статус"
              :show-arrow="true"
              size="large"
              @change="debouncedSearch"
            />
          </AFormItem>
        </ACol>

        <ACol
          class="page-filter__reset"
          :span="5"
        >
          <ResetButton @click="resetFilter" />
        </ACol>
      </ARow>
    </AForm>

    <ARow class="mb-3" :gutter="24">
      <ACol>
        <QBtn
          :disabled="!isSignBtnDisabled"
          type="primary"
          @click="signSelectedProducts"
        >
          Подписать
        </QBtn>
      </ACol>
      <ACol class="mt-2">
        <div class="fz-12 text-gray-600">
          {{ uncheckedSignText }}
        </div>
      </ACol>
    </ARow>

    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="npcList"
      :pagination="pagination"
      :row-selection="{onChange}"
      @change="changeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'gtin'">
          <div class="lh-sm fz-14">
            <div>
              <span class="text-gray-500">GTIN:</span>
              {{ record.gtin }}
            </div>
            <div>
              <span class="text-gray-500">Торговое наименование товара:</span>
              <span :title="record.title"> {{ $format(record.title, 'truncate', { length: 54 }) }}</span>
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'tnvedGpc'">
          <div class="lh-sm fz-12">
            <div>
              <span class="text-gray-500">ТНВЭД:</span>
              <span :title="record.tnved?.title"> {{ $format(record.tnved?.title, 'truncate', { length: 100 }) }}</span>
            </div>
            <div>
              <span class="text-gray-500">GPC:</span>
              {{ record.gpc.title }}
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'trademarkSizeColor'">
          <div class="lh-sm fz-12">
            <div>
              <span class="text-gray-500">Торговая марка:</span>
              <span :title="record.trademark_name"> {{ $format(record.trademark_name, 'truncate', { length: 54 }) }}</span>
            </div>
            <div>
              <span class="text-gray-500">Размер:</span>
              {{ record.shoe_size.title }}
            </div>
            <div>
              <span class="text-gray-500">Цвет:</span>
              {{ record.shoe_color.title }}
            </div>
          </div>
        </template>

        <TableActions
          v-else-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record"
        />

        <StatusTag v-else-if="column.dataIndex === 'status'" :variant="getProductStatusVariant(record.status.id)">
          {{ record.status.title }}
        </StatusTag>
      </template>
    </QTable>
  </div>
</template>
<script>
import { getAxios, postAxios } from '@/services/http/request';
import { getProductStatusVariant } from '@/utils/utils';
import { PRODUCT_STATUSES } from '@/config/types';
import { Signa } from '@/utils/signa';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';
import SelectNpcTnved from '@/components/form/npc/SelectNpcTnved.vue';
import SelectNpcShoeColors from '@/components/form/npc/SelectNpcShoeColors.vue';
import SelectNpcGpc from '@/components/form/npc/SelectNpcGpc.vue';
import SelectNpcShoeTypes from '@/components/form/npc/SelectNpcShoeTypes.vue';
import SelectNpcShoePurposes from '@/components/form/npc/SelectNpcShoePurposes.vue';
import SelectProductStatuses from '@/components/form/SelectProductStatuses.vue';

export default {
  name: 'ProductList',
  components: {
    SelectNpcTnved,
    SelectNpcShoeColors,
    SelectNpcGpc,
    SelectNpcShoeTypes,
    SelectNpcShoePurposes,
    SelectProductStatuses,
  },
  data() {
    this.signa = new Signa();
    return {
      filters: {
        created_at: null,
        title: '',
        counterparty: null,
        gtin: '',
        shoeColor: null,
        trademarkName: '',
        tnved: null,
        gpc: null,
        shoeType: null,
        shoePurpose: null,
        status: [],
        page: 1,
      },
      selectedProductIds: [],
      selectedProducts: [],
      npcList: [],
      pagination: {},
      actions: [
        {
          title: 'Просмотр',
          to: record => ({ name: 'ProductListView', params: { id: record.id } }),
        },
      ],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: '"GTIN / Торговое наименование товара',
          dataIndex: 'gtin',
          width: 280,
        },
        {
          title: 'ТНВЭД / GPC',
          dataIndex: 'tnvedGpc',
          width: 250,
        },
        {
          title: 'Организация',
          dataIndex: ['counterparty', 'title'],
        },
        {
          title: ' Торговая марка / Размер / Цвет',
          dataIndex: 'trademarkSizeColor',
        },
        {
          title: 'Статус',
          dataIndex: 'status',
        },
        {
          fixed: 'right',
          dataIndex: 'action',
          width: 60,
        },
      ],
    };
  },
  computed: {
    isSignBtnDisabled() {
      return this.selectedProductIds.length !== 0
      && this.selectedProducts.every(el => el.counterparty.id === this.selectedProducts[0].counterparty.id
      && el.status.id === PRODUCT_STATUSES.notsigned.id);
    },
    uncheckedSignText() {
      return `Чтобы подписать товары, необходимо выбрать товары со статусом "${PRODUCT_STATUSES.notsigned.title}", которые принадлежат одной организации`;
    },
  },
  created() {
    this.fetchNpcList();
  },
  methods: {
    debouncedSearch: debounce(function() {
      this.submitFilter();
    }, INPUT_DELAY),
    getProductStatusVariant,

    signSelectedProducts() {
      postAxios('/nkt/product-groups/xmls', { productGroupItems: this.selectedProductIds })
        .then((res) => {
          const xmls = res.data.map(el => el.xml);
          this.signa.signXmls(xmls,
            (signedXmls) => {
              const tmp = res.data.map((el, i) => {
                return {
                  productGroupItemId: el.id,
                  xml: signedXmls[i],
                };
              });
              postAxios('/nkt/product-groups/sign-xmls', {
                counterpartyId: this.selectedProducts[0].counterparty.id,
                data: tmp,
              }).then(() => {
                this.$notification.success({
                  message: 'Успешно',
                  description: `Карточки товара с кодом упаковки ${this.selectedProducts.map(el => el.gtin).join(', ')} успешно опубликованы`,
                });
              });
              this.selectedProducts = [];
              this.selectedProductIds = [];
            });
        });
    },

    fetchNpcList(params = {}) {
      return getAxios('nkt/products', { ...params }).then((res) => {
        this.npcList = res.data;
        this.pagination = res.meta;
      },
      );
    },

    onChange(selectedRowKeys, selectedRows) {
      this.selectedProducts = selectedRows;
      this.selectedProductIds = selectedRowKeys;
    },

    submitFilter() {
      this.fetchNpcList(this.filters);
    },
    resetFilter() {
      this.filters = {
        created_at: null,
        title: '',
        counterparty: null,
        gtin: '',
        shoeColor: null,
        trademarkName: '',
        tnved: null,
        gpc: null,
        shoeType: null,
        shoePurpose: null,
        status: [],
        page: 1,
      };
      this.submitFilter();
    },
    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },
  },
};
</script>

<template>
  <AForm
    id="groups_form"
    class="multiline-labels-form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ADivider
      class="mb-6"
      orientation="left"
    >
      Шаг 1. Информация о производстве
    </ADivider>
    <ARow :gutter="24">
      <ACol :span="8">
        <AFormItem label="Наименование группы товаров" name="title">
          <AInput
            v-model:value="form.title"
            size="large"
          />
        </AFormItem>
      </ACol>
      <ACol :span="8">
        <AFormItem label="Организация клиента">
          <AInput
            disabled
            size="large"
            :value="user.counterparty?.title"
          />
        </AFormItem>
      </ACol>
      <ACol :span="8">
        <AFormItem label="Роль организации">
          <ARadioGroup v-model:value="roleOrg">
            <ARadio :value="0">
              Производитель
            </ARadio>
            <ARadio :value="1">
              Импортер
            </ARadio>
          </ARadioGroup>
        </AFormItem>
      </ACol>
      <ACol :span="8">
        <AFormItem
          label="Производитель"
          :required="true"
        >
          <SelectNpcProducer
            size="large"
            @change="getProducer"
          />
        </AFormItem>
        <ARow>
          <ACol :span="24">
            <AFormItem :name="['producer', 'title']">
              <AInput
                v-model:value="form.producer.title"
                :disabled="producerDisabled"
                placeholder="Наименование производителя"
                size="large"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem :name="['producer', 'bin']">
              <AInput
                v-model:value="form.producer.bin"
                v-maska="'############'"
                :disabled="producerDisabled"
                placeholder="ИИН/БИН производителя"
                size="large"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem :name="['producer', 'gcp']">
              <AInput
                v-model:value="form.producer.gcp"
                v-maska="'487####'"
                :disabled="producerDisabled"
                placeholder="GCP производителя"
                size="large"
              />
            </AFormItem>
          </ACol>
          <ARow :gutter="24">
            <ACol :span="11">
              <AFormItem :name="['producer', 'country_id']">
                <SelectNpcCountry
                  v-model:value="form.producer.country_id"
                  :disabled="producerDisabled"
                  placeholder="Страна"
                  size="large"
                />
              </AFormItem>
            </ACol>
            <ACol :span="13">
              <AFormItem :name="['producer', 'legal_address']">
                <AInput
                  v-model:value="form.producer.legal_address"
                  :disabled="producerDisabled"
                  placeholder="Юридический адрес производителя"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ARow>
      </ACol>
      <ACol :span="8">
        <ARow
          v-for="(item, index) in form.manufacturers"
          :key="index"
          class="mb-3"
        >
          <ACol class="mb-1 d-flex" :span="21">
            <b class="text-danger mr-1">
              *
            </b>
            Изготовитель
          </ACol>
          <ACol :span="3">
            <ARow>
              <ACol :span="14">
                <QIcon
                  v-if="index !=0"
                  class="cursor-pointer text-danger"
                  theme="filled"
                  type="close-square"
                  @click="deleteManufacturer(index)"
                />
              </ACol>
              <ACol :span="10">
                <QIcon
                  class="cursor-pointer text-primary"
                  theme="filled"
                  type="plus-square"
                  @click="addManufacturer"
                />
              </ACol>
            </ARow>
          </ACol>
          <ACol :span="24">
            <AFormItem
              :span="24"
            >
              <SelectNpcProducer
                size="large"
                @change="(...args) => getManufacturer(index, ...args)"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem :name="['manufacturers', index, 'title']">
              <AInput
                v-model:value="item.title"
                :disabled="manufacturerDisabled[index].disabled"
                placeholder="Наименование изготовителя"
                size="large"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem :name="['manufacturers', index, 'bin']">
              <AInput
                v-model:value="item.bin"
                v-maska="'############'"
                :disabled="manufacturerDisabled[index].disabled"
                placeholder="ИИН/БИН изготовителя"
                size="large"
              />
            </AFormItem>
          </ACol>

          <ACol :span="24">
            <AFormItem :name="['manufacturers', index, 'gcp']">
              <AInput
                v-model:value="item.gcp"
                v-maska="'487####'"
                :disabled="manufacturerDisabled[index].disabled"
                placeholder="GCP изготовителя"
                size="large"
              />
            </AFormItem>
          </ACol>

          <ARow :gutter="24">
            <ACol :span="11">
              <AFormItem :name="['manufacturers', index, 'country_id']">
                <SelectNpcCountry
                  v-model:value="item.country_id"
                  :disabled="manufacturerDisabled[index].disabled"
                  placeholder="Страна"
                  size="large"
                />
              </AFormItem>
            </ACol>
            <ACol :span="13">
              <AFormItem :name="['manufacturers', index, 'legal_address']">
                <AInput
                  v-model:value="item.legal_address"
                  :disabled="manufacturerDisabled[index].disabled"
                  placeholder="Юридический адрес изготовителя"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ARow>
      </ACol>
      <ACol :span="8">
        <AFormItem
          label="Импортер"
          :required="roleOrg ? true : false"
        >
          <SelectNpcProducer
            size="large"
            @change="getImporter"
          />
        </AFormItem>
        <ARow>
          <ACol :span="24">
            <AFormItem :name="['importer', 'title']">
              <AInput
                v-model:value="form.importer.title"
                :disabled="importerDisabled"
                placeholder="Наименование импортера"
                size="large"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem :name="['importer', 'bin']">
              <AInput
                v-model:value="form.importer.bin"
                v-maska="'############'"
                :disabled="importerDisabled"
                placeholder="ИИН/БИН импортера"
                size="large"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem :name="['importer', 'gcp']">
              <AInput
                v-model:value="form.importer.gcp"
                v-maska="'487####'"
                :disabled="importerDisabled"
                placeholder="GCP импортера"
                size="large"
              />
            </AFormItem>
          </ACol>
          <ARow :gutter="24">
            <ACol :span="11">
              <AFormItem :name="['importer', 'country_id']">
                <SelectNpcCountry
                  v-model:value="form.importer.country_id"
                  :disabled="importerDisabled"
                  placeholder="Страна"
                  size="large"
                />
              </AFormItem>
            </ACol>
            <ACol :span="13">
              <AFormItem :name="['importer', 'legal_address']">
                <AInput
                  v-model:value="form.importer.legal_address"
                  :disabled="importerDisabled"
                  placeholder="Юридический адрес импортера"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ARow>
      </ACol>
      <ACol class="mb-2 text-gray-600" :span="24">
        Для регистрации карточек группы товаров необходимо ввести данные по первому коду упаковки
      </ACol>
      <ACol class="d-flex" :span="10">
        <ACol :span="1">
          <ATooltip placement="bottom">
            <template #title>
              <span>Код упаковки (GTIN)</span>
            </template>
            <QIcon
              class="mr-1 text-primary mt-2"
              theme="filled"
              type="info-circle"
            />
          </ATooltip>
        </ACol>
        <ACol :span="23">
          <AFormItem
            class="d-flex flex-row align-items-center"
            label="Код упаковки (GTIN)"
            :label-col="{span: 10}"
            name="gtin"
            :wrapper-col="{span: 14}"
          >
            <AInput
              v-model:value="form.gtin"
              v-maska="'0#############'"
              size="large"
            />
          </AFormItem>
        </ACol>
      </ACol>
      <ACol :span="14">
        <AFormItem
          class="d-flex flex-row align-items-center flex-wrap"
          label="Код государственного классификатора (КПВЭД)"
          :label-col="{span: 10}"
          name="kpved_id"
          :wrapper-col="{span: 14}"
        >
          <SelectNpcKpved
            v-model:value="form.kpved_id"
            dropdown-class-name="disable-truncate"
            size="large"
          />
        </AFormitem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script>
import { mapState } from 'pinia';
import { vvRequired } from '@/utils/form-validators';
import SelectNpcProducer from '@/components/form/npc/SelectNpcProducer.vue';
import SelectNpcKpved from '@/components/form/npc/SelectNpcKpved.vue';
import { useUserStore } from '@/stores/user.store';

export default {
  components: {
    SelectNpcProducer,
    SelectNpcKpved,
  },
  emits: ['submit'],
  data() {
    return {
      form: {
        title: '',
        producer: {},
        manufacturers: [
          { title: '' },
        ],
        importer: {},
      },
      producerDisabled: true,
      importerDisabled: true,
      roleOrg: 0,
      manufacturerDisabled: [{
        disabled: true,
      }],
    };
  },
  computed: {
    ...mapState(useUserStore, {
      user: 'current',
    }),
    formRules() {
      const rules = {
        title: vvRequired,
        kpved_id: vvRequired,
        gtin: [vvRequired, {
          len: 14,
          message: 'Поле gtin должно состоять из 14 знаков',
        }],
        producer: {
          title: vvRequired,
          bin: vvRequired,
          gcp: vvRequired,
          country_id: vvRequired,
          legal_address: vvRequired,
        },
        manufacturers: [],
        importer: {
          title: this.roleOrg ? vvRequired : { required: false },
          bin: this.roleOrg ? vvRequired : { required: false },
          gcp: this.roleOrg ? vvRequired : { required: false },
          country_id: this.roleOrg ? vvRequired : { required: false },
          legal_address: this.roleOrg ? vvRequired : { required: false },
        },
      };

      this.form.manufacturers.forEach(() => {
        rules.manufacturers.push({
          title: vvRequired,
          bin: vvRequired,
          gcp: !this.roleOrg ? vvRequired : { required: false },
          country_id: vvRequired,
          legal_address: vvRequired,
        });
      });
      return rules;
    },
  },
  methods: {
    handleFinish(values) {
      values.counterparty_id = this.user.counterparty.id;
      this.$emit('submit', values);
    },
    getProducer(producerId, option) {
      if (producerId === 0) {
        this.producerDisabled = false;
      } else if (producerId > 0) {
        this.producerDisabled = true;
        this.form.producer = {
          bin: option.bin,
          country_id: option.country.id,
          gcp: option.gcp,
          legal_address: option.legal_address,
          title: option.title,
        };
      } else {
        this.producerDisabled = true;
        for (const key in this.form.producer)
          this.form.producer[key] = '';
      }
    },
    getManufacturer(index, manufacturerId, option) {
      if (manufacturerId === 0) {
        this.manufacturerDisabled[index].disabled = false;
      } else if (manufacturerId > 0) {
        this.manufacturerDisabled[index].disabled = true;
        this.form.manufacturers[index] = {
          bin: option.bin,
          country_id: option.country.id,
          gcp: option.gcp,
          legal_address: option.legal_address,
          title: option.title,
        };
      } else {
        this.form.manufacturers[index] = true;
        for (const key in this.form.manufacturers[index])
          this.form.manufacturers[index][key] = '';
      }
    },
    getImporter(importerId, option) {
      if (importerId === 0) {
        this.importerDisabled = false;
      } else if (importerId > 0) {
        this.importerDisabled = true;
        this.form.importer = {
          bin: option.bin,
          country_id: option.country.id,
          gcp: option.gcp,
          legal_address: option.legal_address,
          title: option.title,
        };
      } else {
        this.importerDisabled = true;
        this.form.importer = {};
      }
    },
    addManufacturer() {
      this.form.manufacturers.push({
        title: '',
        bin: '',
        gcp: '',
        country_id: '',
        legal_address: '',
      });
      this.manufacturerDisabled.push({ disabled: true });
    },
    deleteManufacturer(arrIndex) {
      if (arrIndex !== -1) {
        this.form.manufacturers.splice(arrIndex, 1);
        this.manufacturerDisabled.splice(arrIndex, 1);
      }
    },
  },
};
</script>

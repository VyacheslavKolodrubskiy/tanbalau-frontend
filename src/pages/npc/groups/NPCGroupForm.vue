<template>
  <AForm
    id="npc_group_form"
    ref="npc_group_form"
    class="border border-gray-200 multiline-labels-form"
    :colon="false"
    label-align="left"
    :label-col="{span: 6}"
    layout="horizontal"
    :model="form"
    :rules="formRules"
    :scroll-to-first-error="true"
    :wrapper-col="{span: 18}"
    @submit.prevent="sendForm"
  >
    <ARow>
      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Код товара состоит из 8, 12 или 13 цифр</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              label="Код упаковки (GTIN)"
              name="gtin"
            >
              <AInput
                v-model:value="form.gtin"
                v-maska="'0#############'"
                :disabled="isGtinKpvedDisabled"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>
      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              label="Код государственного классификатора (КПВЭД)"
              name="kpved_id"
            >
              <SelectNpcKpved
                v-model:value="form.kpved_id"
                :disabled="isGtinKpvedDisabled"
                dropdown-class-name="disable-truncate"
                size="large"
                @change="onChangeKpved"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol
        v-if="form.kpved_id"
        :span="24"
      >
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              label="ТНВЭД"
              name="tnved_id"
            >
              <SelectNpcTnved
                ref="tnvedDependKpved"
                v-model:value="form.tnved_id"
                :disabled="isViewing"
                dropdown-class-name="disable-truncate"
                :kpved="form.kpved_id"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol
        v-if="form.kpved_id"
        :span="24"
      >
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              label="GPC"
              name="gpc_id"
            >
              <SelectNpcGpc
                v-if="form.kpved_id"
                ref="gpcDependKpved"
                v-model:value="form.gpc_id"
                :disabled="isViewing"
                :kpved="form.kpved_id"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip :overlay-style="{minWidth: '400px'}" placement="bottom">
              <template #title>
                <span>
                  Наименование предмета торговли, указанное на этикетке в Техническом блоке, приведенное к структурированному виду. Ограничено 200 символами. Допустимые технические символы: [/], [%], [,], [№]
                  Символы, входящие в название торговой марки или производителя, считаются его неотъемлемой частью, поэтому запрет на них не распространяется. Кавычки, обрамляющие слово или словосочетание, не заносятся. Составляющие (слова) Наименования заносятся с заглавной буквы, далее следуют прописные буквенные символы, если иное не предусмотрено в определенных случаях.  Предлоги пишутся прописью, если несут в себе не значимую, но соединительную роль. Не допускается применение более одного пробела между словами, исключаются пробелы в начале и конце сформированного наименования, при этом отсутствие пробелов между словами / блоками наименования допускается в целях эффективного использования символов из-за накладываемых ограничений по максимальной длине наименования.
                </span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.title"
              label="Торговое наименование товара"
              name="title"
            >
              <AInput
                v-model:value="form.title"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Товарный знак ® (также торговая марка или бренд) — словесное обозначение, «служащее для индивидуализации товаров юридических лиц или индивидуальных предпринимателей». Значение вносится в соответствии с языком оригинала. В случае отсутствия на этикетке или упаковке Товарного знака, необходимо выбрать значение "---" в левом поле и внести значение "Без товарного знака" в правом.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>

          <ACol :span="23">
            <ARow :gutter="10">
              <ACol :span="12">
                <AFormItem
                  label="Товарный знак"
                  :label-col="{span: 12}"
                  name="trademark_country_id"
                  :wrapper-col="{span: 12}"
                >
                  <SelectNpcCountry
                    v-model:value="form.trademark_country_id"
                    :disabled="isViewing"
                    option-value="slug"
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="12">
                <AFormItem
                  :help="comment?.trademark_name"
                  name="trademark_name"
                  :wrapper-col="{span: 24}"
                >
                  <AInput
                    v-model:value="form.trademark_name"
                    :disabled="isViewing"
                    placeholder="Товарный знак"
                    size="large"
                  />
                </AFormItem>
              </ACol>
            </ARow>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip :overlay-style="{minWidth: '400px'}" placement="bottom">
              <template #title>
                <span>
                  Наименование / значение модели и(или) значение артикула товара согласно данным производителя.
                  Модель — (1) совокупность каких-либо серийно производимых одинаковых изделий (модельный ряд), (2) совокупность коммерческих характеристик для схожих товаров, (3) ряд / линейка товаров, объединенных целевым / маркетинговым позиционированием и т.п.
                  Под артикулом товара обычно понимается цифровое и/или буквенное значение, которое обозначает данную модель товара и обычно не используемое в маркетинговых целях. Артикул должен быть написан на самом изделии (на одежде - на бирке, на мебели - на ярлыке, который крепится к задней стенке изделия, на светильнике - на внутренней стороне основания и т. д.)
                  Как модель, так и артикул являются определениями, часто объединяющими аналогичные товары, отличающиеся вариативностью по определенной характеристике, например, размерный ряд, цвет и т.п.
                  Данный атрибут не пересекается с определениями вида или категории товаров.
                  Атрибут состоит из двух частей: непосредственно значение атрибута и предварительно выбранный тип вводимого значения (модель и(или) артикул)
                </span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>

          <ACol :span="23">
            <ARow :gutter="10">
              <ACol :span="12">
                <AFormItem
                  label="Артикул/Модель"
                  :label-col="{span: 12}"
                  name="model_type_id"
                  :wrapper-col="{span: 12}"
                >
                  <SelectNpcVendorModel
                    v-model:value="form.model_type_id"
                    :disabled="isViewing"
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="12">
                <AFormItem
                  :help="comment?.model_title_number"
                  name="model_title_number"
                  :wrapper-col="{span: 24}"
                >
                  <AInput
                    v-model:value="form.model_title_number"
                    :disabled="isViewing"
                    placeholder="Артикул/Модель"
                    size="large"
                  />
                </AFormItem>
              </ACol>
            </ARow>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Указывается вид обуви, соответствующий данному товару, посредством выбора справочного значения</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.shoe_type_id"
              label="Вид обуви"
              name="shoe_type_id"
            >
              <SelectNpcShoeTypes
                v-model:value="form.shoe_type_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.shoe_purpose_id"
              label="Назначение обуви"
              name="shoe_purpose_id"
            >
              <SelectNpcShoePurposes
                v-model:value="form.shoe_purpose_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Указывается размер в штихмассовой системе измерения</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.shoe_size_id"
              label="Размер в штихмассовой системе"
              name="shoe_size_id"
            >
              <SelectNpcShoeSizes
                v-model:value="form.shoe_size_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.shoe_color_id"
              label="Цвет"
              name="shoe_color_id"
            >
              <SelectNpcShoeColors
                v-model:value="form.shoe_color_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span> Атрибут предназначен для текстового описания материала верха изделия</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.shoe_material_up_id"
              label="Материал верха"
              name="shoe_material_up_id"
            >
              <SelectNpcShoeMaterialsUp
                v-model:value="form.shoe_material_up_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Атрибут предназначен для текстового описания материала подкладки изделия</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.shoe_material_lining_id"
              label="Материал низа / подкладки"
              name="shoe_material_lining_id"
            >
              <SelectNpcShoeMaterialsLining
                v-model:value="form.shoe_material_lining_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Атрибут предназначен для текстового описания материала низа / подошвы изделия</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.shoe_material_down_id"
              label="Материал низа / подошвы"
              name="shoe_material_down_id"
            >
              <SelectNpcShoeMaterialsDown
                v-model:value="form.shoe_material_down_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.child_access"
              label="Продукция предназначена для детей и подростков"
              name="child_access"
            >
              <SelectNpcChildAccess
                v-model:value="form.child_access"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.sign_conformity_id"
              label="Знак соответствия"
              name="sign_conformity_id"
            >
              <SelectNpcSignConformity
                v-model:value="form.sign_conformity_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Знак обращения - евразийское соответствие (ЕАС, англ. Eurasian Conformity (EAC)), свидетельствующий о том, что продукция, маркированная им, прошла все установленные в технических регламентах Таможенного союза процедуры оценки</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.sign_address_id"
              label="Знак обращения на рынке"
              name="sign_address_id"
            >
              <SelectNpcSignAddress
                v-model:value="form.sign_address_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol
        v-for="item in form.photos"
        :key="getPhotoLabel[item.photo_type_id]"
        :span="24"
      >
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.photos ? getHelpLabel(item?.photo_type_id, comment.photos, 'photo_type_id') : ''"
              :label="getPhotoLabel[item.photo_type_id]"
            >
              <QUpload
                v-model:value="item.photo"
                accept-img
                :async-remove="handleRemove"
                :disabled="isViewing"
                :dublicate-file="form.id"
              >
                <QBtn :disabled="isViewing" size="large">
                  <QIcon type="upload" />
                  Добавить
                </QBtn>
              </QUpload>
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Подлежит обязательному заполнению при наличии свидетельства на указанный Товарный знак.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.trademark_certificate_number"
              label="Номер свидетельства товарного знака"
              name="trademark_certificate_number"
            >
              <AInputNumber
                v-model:value="form.trademark_certificate_number"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Законодательством признаётся исключительное право на товарный знак, удостоверяемое свидетельством на товарный знак. Поэтому при внесении зарегистрированного Товарного знака, поле подлежит обязательному заполнению. Для внесения даты необходимо использовать формат  ДД.ММ.ГГГГ , где разделителем является точка.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.trademark_certificate_date_issue"
              label="Дата выдачи свидетельства"
              name="trademark_certificate_date_issue"
            >
              <QDatePicker
                v-model:value="form.trademark_certificate_date_issue"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Законодательством признаётся исключительное право на товарный знак, удостоверяемое свидетельством на товарный знак. Поэтому при внесении зарегистрированного Товарного знака, поле подлежит обязательному заполнению. Для внесения даты необходимо использовать формат  ДД.ММ.ГГГГ , где разделителем является точка.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.trademark_certificate_date_expire"
              label="Срок действия свидетельства"
              name="trademark_certificate_date_expire"
            >
              <QDatePicker
                v-model:value="form.trademark_certificate_date_expire"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Введите первых три символа из названия страны и дождитесь результата поиска системой совпадений в справочнике. Выберите один из предлагаемых вариантов системой. Ограничения! Не вводите собственные значения, выбирайте значение только из выпадающего справочника.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol
            v-for="(item, index) in form.production_countries"
            :key="index"
            class="mb-2"
            :push="index !==0 ? 1 : 0"
            :span="23"
          >
            <AFormItem
              :help="comment?.production_countries ? getHelpLabel(item?.id, comment.production_countries, 'local_id') : ''"
              :label=" index === 0 ? 'Страна производства' : ''"
              :label-col="{span: index === 0 ? 6 : 0}"
              :wrapper-col="{span: 18, offset: index === 0 ? 0 : 6}"
            >
              <ARow>
                <ACol :span="23">
                  <SelectNpcCountry
                    v-model:value="item.country_id"
                    :disabled="isViewing"
                    size="large"
                  />
                </ACol>
                <ACol
                  v-if="!isViewing"
                  :span="1"
                >
                  <QIcon
                    v-if="index === 0"
                    class="ml-1 cursor-pointer text-primary"
                    theme="filled"
                    type="plus-square"
                    @click="addCountry"
                  />
                  <QIcon
                    v-if="index !== 0"
                    class="ml-1 pointer text-danger"
                    theme="filled"
                    type="close-square"
                    @click="deleteCountry(index, item?.id)"
                  />
                </ACol>
              </ARow>
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>
                  Гарантийный срок:
                  1) Срок, в течение которого покупатель может, установив скрытые недостатки продукции (товара), предъявить соответствующие претензии поставщику (продавцу);
                  2) Срок, в течение которого изготовитель обеспечивает стабильность качественных показателей изделия.
                  Если срок не определен, то тип необходимо выбрать "---", а значение "НЕ ОПРЕДЕЛЕНО".
                </span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>

          <ACol :span="23">
            <ARow :gutter="10">
              <ACol :span="12">
                <AFormItem
                  label="Гарантийный срок, от производителя"
                  :label-col="{span: 12}"
                  name="guarantee_period_type_id"
                  :wrapper-col="{span: 12}"
                >
                  <SelectNpcGuaranteeList
                    v-model:value="form.guarantee_period_type_id"
                    :disabled="isViewing"
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="12">
                <AFormItem
                  :help="comment?.guarantee_period"
                  name="guarantee_period"
                  :wrapper-col="{span: 24}"
                >
                  <AInput
                    v-model:value="form.guarantee_period"
                    :disabled="isViewing"
                    placeholder="Гарантийный срок, от производителя"
                    size="large"
                  />
                </AFormItem>
              </ACol>
            </ARow>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.care_instruction"
              label="Инструкция по уходу за обувью"
              name="care_instruction"
            >
              <AInput
                v-model:value="form.care_instruction"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Указание пола целевого потребителя товара</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.gender_id"
              label=" Пол целевого потребителя"
              name="gender_id"
            >
              <SelectNpcGender
                v-model:value="form.gender_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Номер ГОСТ или СТРК (государственного стандарта), согласно которому произведен товар. Либо Номер ТУ (технического условия), разрабатываемого производителем и утверждаемого в отраслевом министерстве. Либо Номер СТО (стандарта организации), устанавливаемого предприятием и не требующего проведения экспертизы.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>

          <ACol :span="23">
            <ARow :gutter="10">
              <ACol :span="12">
                <AFormItem
                  label="Номер национального стандарта"
                  :label-col="{span: 12}"
                  name="standard_number_type_id"
                  :wrapper-col="{span: 12}"
                >
                  <SelectNpcStandardNumber
                    v-model:value="form.standard_number_type_id"
                    :disabled="isViewing"
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="12">
                <AFormItem
                  :help="comment?.standard_number"
                  name="standard_number"
                  :wrapper-col="{span: 24}"
                >
                  <AInputNumber
                    v-model:value="form.standard_number"
                    :disabled="isViewing"
                    placeholder="Номер национального стандарта"
                    size="large"
                  />
                </AFormItem>
              </ACol>
            </ARow>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Номер Технического регламента, в соответствии с которым произведен товар</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol
            v-for="(item, index) in form.standard_number_matching"
            :key="index"
            class="mb-2"
            :push="index !==0 ? 1 : 0"
            :span="23"
          >
            <AFormItem
              :help="comment?.standard_number_matching ? getHelpLabel(item?.id, comment.standard_number_matching, 'local_id') : ''"
              :label=" index === 0 ? 'Соответствие международному ТР ТС' : ''"
              :label-col="{span: index === 0 ? 6 : 0}"
              :wrapper-col="{span: 18, offset: index === 0 ? 0 : 6}"
            >
              <ARow>
                <ACol :span="23">
                  <SelectNpcStandartMatching
                    v-model:value="form.standard_number_matching[index].matching_id"
                    :disabled="isViewing"
                    size="large"
                  />
                </ACol>
                <ACol v-if="!isViewing" :span="1">
                  <QIcon
                    v-if="index === 0"
                    class="ml-1 cursor-pointer text-primary"
                    theme="filled"
                    type="plus-square"
                    @click="addStandards"
                  />
                  <QIcon
                    v-if="index !== 0"
                    class="ml-1 pointer text-danger"
                    theme="filled"
                    type="close-square"
                    @click="deleteStandards(index, item?.id)"
                  />
                </ACol>
              </ARow>
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <ARow :gutter="10">
              <ACol :span="12">
                <AFormItem
                  :help="comment?.standart_certificate_type_id"
                  label="Номер документа подтверждающего соответствие"
                  :label-col="{span: 12}"
                  name="standart_certificate_type_id"
                  :wrapper-col="{span: 12}"
                >
                  <SelectNpcCertificateTypes
                    v-model:value="form.standart_certificate_type_id"
                    :disabled="isViewing"
                    dropdown-class-name="disable-truncate"
                    size="large"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="12">
                <AFormItem
                  :help="comment?.standard_certificate_number"
                  name="standard_certificate_number"
                  :wrapper-col="{span: 24}"
                >
                  <AInput
                    v-model:value="form.standard_certificate_number"
                    :disabled="isViewing"
                    placeholder="Номер документа подтверждающего соответствие"
                    size="large"
                  />
                </AFormItem>
              </ACol>
            </ARow>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Для внесения даты необходимо использовать формат  ДД.ММ.ГГГГ , где разделителем является точка.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.standard_certificate_date_issue"
              label="Дата выдачи документа"
              name="standard_certificate_date_issue"
            >
              <QDatePicker
                v-model:value="form.standard_certificate_date_issue"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :span="1">
            <ATooltip placement="bottom">
              <template #title>
                <span>Для внесения даты необходимо использовать формат  ДД.ММ.ГГГГ , где разделителем является точка.</span>
              </template>
              <QIcon
                class="mr-1 text-primary h-100 d-flex align-items-center"
                theme="filled"
                type="info-circle"
              />
            </ATooltip>
          </ACol>
          <ACol :span="23">
            <AFormItem
              :help="comment?.standard_certificate_date_expire"
              label="Срок действия документа"
              name="standard_certificate_date_expire"
            >
              <QDatePicker
                v-model:value="form.standard_certificate_date_expire"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.package_type"
              label="Тип упаковки"
              :name="['first_package', 'package_type_id']"
            >
              <SelectNpcPackageTypes
                v-model:value="form.first_package.package_type_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.package_material"
              label="Материал упаковки"
              :name="['first_package', 'package_material_id']"
            >
              <SelectNpcPackageMaterials
                v-model:value="form.first_package.package_material_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.package_weight"
              label="Вес брутто упаковки"
              :name="['first_package', 'package_weight']"
            >
              <AInputNumber
                v-model:value="form.first_package.package_weight"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.package_width"
              label="Ширина упаковки"
              :name="['first_package', 'package_width']"
            >
              <AInputNumber
                v-model:value="form.first_package.package_width"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.package_height"
              label="Высота упаковки"
              :name="['first_package', 'package_height']"
            >
              <AInputNumber
                v-model:value="form.first_package.package_height"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.package_depth"
              label="Глубина упаковки"
              :name="['first_package', 'package_depth']"
            >
              <AInputNumber
                v-model:value="form.first_package.package_depth"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.closure_type"
              label="Тип укупорочного средства"
              :name="['first_package', 'closure_type_id']"
            >
              <SelectNpcClosureTypes
                v-model:value="form.first_package.closure_type_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              :help="comment?.first_package?.closure_material"
              label="Материал укупорочного средства"
              :name="['first_package', 'closure_material_id']"
            >
              <SelectNpcClosureMaterials
                v-model:value="form.first_package.closure_material_id"
                :disabled="isViewing"
                size="large"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <ACol :span="24">
        <ARow class="product-group-form__row">
          <ACol :push="1" :span="23">
            <AFormItem
              label="Вторичная упаковка"
            >
              <ARadioGroup
                v-model:value="secondaryPackaging"
                :disabled="isViewing"
                @change="addPackaging"
              >
                <ARadio :value="1">
                  Да
                </ARadio>
                <ARadio :value="0">
                  Нет
                </ARadio>
              </ARadioGroup>
            </AFormItem>
          </ACol>
        </ARow>
      </ACol>

      <template v-if="secondaryPackaging">
        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.package_type"
                label="Тип упаковки"
                :name="['second_package', 'package_type_id']"
              >
                <SelectNpcPackageTypes
                  v-model:value="form.second_package.package_type_id"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>

        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.package_material"
                label="Материал упаковки"
                :name="['second_package', 'package_material_id']"
              >
                <SelectNpcPackageMaterials
                  v-model:value="form.second_package.package_material_id"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>

        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.package_weight"
                label="Вес брутто упаковки"
                :name="['second_package', 'package_weight']"
              >
                <AInputNumber
                  v-model:value="form.second_package.package_weight"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>

        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.package_width"
                label="Ширина упаковки"
                :name="['second_package', 'package_width']"
              >
                <AInputNumber
                  v-model:value="form.second_package.package_width"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>

        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.package_height"
                label="Высота упаковки"
                :name="['second_package', 'package_height']"
              >
                <AInputNumber
                  v-model:value="form.second_package.package_height"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>

        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.package_depth"
                label="Глубина упаковки"
                :name="['second_package', 'package_depth']"
              >
                <AInputNumber
                  v-model:value="form.second_package.package_depth"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>

        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.closure_type"
                label="Тип укупорочного средства"
                :name="['second_package', 'closure_type_id']"
              >
                <SelectNpcClosureTypes
                  v-model:value="form.second_package.closure_type_id"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>

        <ACol :span="24">
          <ARow class="product-group-form__row">
            <ACol :push="1" :span="23">
              <AFormItem
                :help="comment?.second_package?.closure_material"
                label="Материал укупорочного средства"
                :name="['second_package', 'closure_material_id']"
              >
                <SelectNpcClosureMaterials
                  v-model:value="form.second_package.closure_material_id"
                  :disabled="isViewing"
                  size="large"
                />
              </AFormItem>
            </ACol>
          </ARow>
        </ACol>
      </template>
    </ARow>
  </AForm>
</template>

<script>
import { vvRequired } from '@/utils/form-validators';
import SelectNpcKpved from '@/components/form/npc/SelectNpcKpved.vue';
import SelectNpcTnved from '@/components/form/npc/SelectNpcTnved.vue';
import SelectNpcGpc from '@/components/form/npc/SelectNpcGpc.vue';
import SelectNpcVendorModel from '@/components/form/npc/SelectNpcVendorModel.vue';
import SelectNpcShoeTypes from '@/components/form/npc/SelectNpcShoeTypes.vue';
import SelectNpcShoePurposes from '@/components/form/npc/SelectNpcShoePurposes.vue';
import SelectNpcShoeSizes from '@/components/form/npc/SelectNpcShoeSizes.vue';
import SelectNpcShoeColors from '@/components/form/npc/SelectNpcShoeColors.vue';
import SelectNpcShoeMaterialsDown from '@/components/form/npc/SelectNpcShoeMaterialsDown.vue';
import SelectNpcShoeMaterialsLining from '@/components/form/npc/SelectNpcShoeMaterialsLining.vue';
import SelectNpcShoeMaterialsUp from '@/components/form/npc/SelectNpcShoeMaterialsUp.vue';
import SelectNpcChildAccess from '@/components/form/npc/SelectNpcChildAccess.vue';
import SelectNpcSignConformity from '@/components/form/npc/SelectNpcSignConformity.vue';
import SelectNpcSignAddress from '@/components/form/npc/SelectNpcSignAddress.vue';
import SelectNpcPackageTypes from '@/components/form/npc/SelectNpcPackageTypes.vue';
import SelectNpcPackageMaterials from '@/components/form/npc/SelectNpcPackageMaterials.vue';
import SelectNpcGuaranteeList from '@/components/form/npc/SelectNpcGuaranteeList.vue';
import SelectNpcGender from '@/components/form/npc/SelectNpcGender.vue';
import SelectNpcStandardNumber from '@/components/form/npc/SelectNpcStandardNumber.vue';
import SelectNpcCertificateTypes from '@/components/form/npc/SelectNpcCertificateTypes.vue';
import SelectNpcClosureTypes from '@/components/form/npc/SelectNpcClosureTypes.vue';
import SelectNpcClosureMaterials from '@/components/form/npc/SelectNpcClosureMaterials.vue';
import SelectNpcStandartMatching from '@/components/form/npc/SelectNpcStandartMatching.vue';
import { PHOTO_TYPES, PRODUCT_STATUSES, REGISTER_STATUSES } from '@/config/types';
import { fastClone } from '@/utils/object';
import { deleteAxios } from '@/services/http/request';

export default {
  components: {
    SelectNpcKpved,
    SelectNpcTnved,
    SelectNpcGpc,
    SelectNpcVendorModel,
    SelectNpcShoeTypes,
    SelectNpcShoePurposes,
    SelectNpcShoeSizes,
    SelectNpcShoeColors,
    SelectNpcShoeMaterialsDown,
    SelectNpcShoeMaterialsLining,
    SelectNpcShoeMaterialsUp,
    SelectNpcChildAccess,
    SelectNpcSignConformity,
    SelectNpcSignAddress,
    SelectNpcPackageTypes,
    SelectNpcPackageMaterials,
    SelectNpcGuaranteeList,
    SelectNpcGender,
    SelectNpcStandardNumber,
    SelectNpcCertificateTypes,
    SelectNpcClosureTypes,
    SelectNpcClosureMaterials,
    SelectNpcStandartMatching,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
    status: {
      type: [Number, String],
      default: null,
    },
    registrationStatus: {
      type: [Number, String],
      default: null,
    },
    comment: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['send-form'],
  data() {
    return {
      form: {
        gtin: '',
        title: '',
        gpc_id: '',
        kpved_id: '',
        tnved_id: '',
        gender_id: '',
        child_access: '',
        shoe_size_id: '',
        shoe_type_id: '',
        first_package: {
        },
        model_type_id: '',
        shoe_color_id: '',
        trademark_name: '',
        shoe_purpose_id: '',
        sign_address_id: '',
        standard_number: '',
        care_instruction: '',
        guarantee_period: '',
        product_group_id: '',
        model_title_number: '',
        sign_conformity_id: '',
        shoe_material_up_id: '',
        trademark_country_id: '',
        production_countries: [
          { country_id: '' },
        ],
        shoe_material_down_id: '',
        shoe_material_lining_id: '',
        standard_number_type_id: '',
        guarantee_period_type_id: '',
        standard_number_matching: [{ matching_id: '' }],
        standard_certificate_number: '',
        standart_certificate_type_id: '',
        trademark_certificate_number: '',
        standard_certificate_date_issue: '',
        standard_certificate_date_expire: '',
        trademark_certificate_date_issue: null,
        trademark_certificate_date_expire: null,
        second_package: {},
        photos: [],
      },
      formPervCopy: {},
      secondaryPackaging: 0,
    };
  },
  computed: {
    formRules() {
      return {
        gtin: vvRequired,
        kpved_id: vvRequired,
        tnved_id: vvRequired,
        gpc_id: vvRequired,
        title: vvRequired,
        trademark_name: vvRequired,
        trademark_country_id: vvRequired,
        model_type_id: vvRequired,
        model_title_number: vvRequired,
        shoe_type_id: vvRequired,
        shoe_purpose_id: vvRequired,
        shoe_size_id: vvRequired,
        shoe_color_id: vvRequired,
        shoe_material_up_id: vvRequired,
        shoe_material_lining_id: vvRequired,
        shoe_material_down_id: vvRequired,
        child_access: vvRequired,
        sign_conformity_id: vvRequired,
        sign_address_id: vvRequired,
      };
    },
    isViewing() {
      if (this.$canUse(['admin', 'manger']))
        return true;
      if (this.registrationStatus === REGISTER_STATUSES.in_process.id)
        return true;

      return this.status === PRODUCT_STATUSES.moderation.id
      || this.status === PRODUCT_STATUSES.notsigned.id
      || this.status === PRODUCT_STATUSES.published.id;
    },
    isGtinKpvedDisabled() {
      if (this.registrationStatus === REGISTER_STATUSES.in_process.id)
        return true;

      return this.status === PRODUCT_STATUSES.draft.id
             || this.status === PRODUCT_STATUSES.notsigned.id
             || this.status === PRODUCT_STATUSES.published.id
             || this.status === PRODUCT_STATUSES.moderation.id
             || this.status === PRODUCT_STATUSES.errors.id;
    },
    getPhotoLabel() {
      const newPhotoType = {};
      for (const photo in PHOTO_TYPES) {
        const tempItem = fastClone(PHOTO_TYPES[photo]);
        newPhotoType[tempItem.id] = tempItem.title;
      }
      return newPhotoType;
    },
  },
  watch: {
    product: {
      handler() {
        this.form = this.product;
        this.secondaryPackaging = this.product?.second_package?.package_type_id ? 1 : 0;
        setTimeout(() => {
          this.$refs.npc_group_form.validate();
        }, 0);
      },
      deep: true,
    },
  },
  created() {
    if (this.product) {
      Object.assign(this.form, this.product);
      this.secondaryPackaging = this.product?.second_package?.package_material_id ? 1 : 0;
    }
  },
  methods: {
    handleRemove(file) {
      file.status = 'uploading';
      return deleteAxios(`/nkt/products/${this.form.id}/photos/${file.uid}`)
        .then((res) => {
          this.$notification.success({
            message: res.message,
          });
        });
    },
    getHelpLabel(typeId, commentData, searchField) {
      const newLabel = commentData.filter(label => label[searchField] === typeId);

      return newLabel.length ? newLabel[0].comment : '';
    },
    addCountry() {
      this.form.production_countries.push({ country_id: '' });
    },
    addStandards() {
      this.form.standard_number_matching.push({ matching_id: '' });
    },
    deleteCountry(arrIndex, id) {
      this.form.production_countries.splice(arrIndex, 1);
      if (id) {
        deleteAxios(`/nkt/products/production-countries/${id}`)
          .then((res) => {
            this.$notification.success({
              message: res.message,
            });
          });
      }
    },
    deleteStandards(arrIndex, id) {
      this.form.standard_number_matching.splice(arrIndex, 1);
      if (id) {
        deleteAxios(`/nkt/products/standard-matchings/${id}`)
          .then((res) => {
            this.$notification.success({
              message: res.message,
            });
          });
      }
    },
    addPackaging() {
      if (!this.secondaryPackaging)
        this.form.second_package = {};
    },
    onChangeKpved() {
      this.form.tnved_id = '';
      this.form.gpc_id = '';

      this.$nextTick().then(() => {
        this.$refs.tnvedDependKpved.getOptions();
        this.$refs.gpcDependKpved.getOptions();
      });
    },
    sendForm() {
      this.$emit('send-form', this.form);
    },
  },
};
</script>

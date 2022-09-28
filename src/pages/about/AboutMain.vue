<template>
  <APageHeader
    title="Документы и контакты разработчиков"
  />

  <ACard>
    <h2 class="font-italic fz-16 font-weight-light mb-3">
      Реквизиты
    </h2>

    <ARow :gutter="[24, 4]">
      <ACol :gutter="24" :span="10">
        ТОО «QLT LAB»
      </ACol>
      <ACol :span="24">
        Юридический адрес: 010000,
      </ACol>
      <ACol :span="24">
        г. Нур-Султан, район Байконыр,
      </ACol>
      <ACol :span="24">
        ул. Иманова д. 17, кв. 213
      </ACol>
      <ACol :span="24">
        БИН:  200140030640
      </ACol>
      <ACol class="mt-1" :span="24">
        <a href="mailto:support@qlt.kz">
          support@qlt.kz
        </a>
      </ACol>
      <ACol>
        <a href="tel:+77476034600">+77476034600</a>
      </ACol>
    </ARow>

    <h2 class="font-italic fz-16 mt-7 font-weight-light mb-3">
      Документы
    </h2>

    <ARow :gutter="[24, 4]">
      <ACol class="text-underline" :span="24">
        <a
          download="contract"
          href="https://api.tanbalau.kz/storage/qlt_docs/contract.pdf"
          target="_blank"
        >
          Договор присоединения к Правилам возмездного оказания информационных услуг
        </a>
      </ACol>
      <ACol class="text-underline" :span="24">
        <a
          download="rules"
          href="https://api.tanbalau.kz/storage/qlt_docs/rules.pdf"
          target="_blank"
        >
          Правила возмездного оказания информационных услуг (публичная оферта) в порядке статьи 395 Гражданского кодекса Республики Казахстан
        </a>
      </ACol>
    </ARow>
  </ACard>
</template>

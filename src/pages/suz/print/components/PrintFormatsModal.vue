<template>
  <AModal
    v-bind="$attrs"
    :footer="null"
    title="Выберите формат этикеток"
    :width="modalWidth + 'px'"
  >
    <p>Генерация PDF происходит в течение 30 секунд</p>
    <ARow :gutter="24">
      <ACol :span="8">
        <PrintFormatGen
          image="format1.jpg"
          :print-type="1"
          title="Формат 1"
        />
      </ACol>
      <ACol :span="8">
        <PrintFormatGen
          image="format2.jpg"
          :print-type="2"
          title="Формат 2"
        />
      </ACol>
      <ACol :span="8">
        <PrintFormatGen
          image="format3.jpg"
          :print-type="3"
          title="Формат 3"
        />
      </ACol>
    </ARow>
  </AModal>
</template>

<script>
import PrintFormatGen from '@/pages/suz/print/components/PrintFormatGen.vue';

export default {
  components: { PrintFormatGen },
  inheritAttrs: false,
  data() {
    return {
      modalWidth: 840,
    };
  },

  computed: {

  },
  methods: {
    finish() {
    },
  },
};
</script>

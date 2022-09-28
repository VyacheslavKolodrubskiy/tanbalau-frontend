<template>
  <AModal
    v-bind="$attrs"
    cancel-text="Отмена"
    :ok-button-props="{ htmlType: 'submit', form: 'print_payment_order_form' }"
    ok-text="Прикрепить"
    :title="modalTitle"
  >
    <AForm
      id="print_payment_order_form"
      layout="vertical"
      :model="form"
      :rules="formRules"
      @finish="finish"
    >
      <AFormItem label="Платёжное поручение" name="file">
        <QUpload
          v-model:value="form.file"
          accept-base
        >
          <QBtn size="large">
            <QIcon type="upload" />
            Прикрепить файл
          </QBtn>
        </QUpload>
      </AFormItem>

      <AFormItem label="Комментарий" name="comment">
        <ATextarea
          v-model:value="form.comment"
          rows="4"
          size="large"
        />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script>
import { vvRequired } from '@/utils/form-validators';

const formRules = {
  file: {
    required: true,
    message: 'Прикрепите платёжное поручение',
    type: 'object',
  },
  comment: vvRequired,
};

export default {
  inheritAttrs: false,
  props: {
    paymentData: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['submit'],
  data() {
    this.formRules = formRules;
    return {
      form: {
        file: null,
        comment: '',
      },
    };
  },
  computed: {
    modalTitle() {
      if (!this.paymentData)
        return '';

      return `Платёжное поручение на Запрос №${this.paymentData.orderId} ${this.paymentData.counterparty} от ${this.paymentData.orderDate}`;
    },
  },
  methods: {
    finish(values) {
      this.$emit('submit', values);
    },
  },
};
</script>

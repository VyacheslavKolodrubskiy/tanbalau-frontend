<template>
  <AAffix
    :offset-top="0"
  >
    <div
      v-for="product in products"
      :key="product.id"
      class="product-group-aside__item"
      :class="[{ 'active': product.id === activeProductId}, getStatusClass(product)]"
    >
      <div class="product-group-aside__item-status">
        <QIcon :type="getStatusIcon(product)" />
      </div>
      <div class="product-group-aside__item-content" @click="$emit('select', product.id, product.gtin, product.status)">
        <div class="product-group-aside__item-title">
          {{ product.shoe_color.title }} / {{ product.shoe_size.title }}
        </div>
        <div class="product-group-aside__item-subtitle">
          {{ product.gtin }}
        </div>
      </div>
      <QIcon
        v-if="showSpinner(product?.register_status?.id)"
        class="fz-18 mr-2"
        spin
        type="sync"
      />
      <ADropdown
        v-if="!disabledDublicate"
        placement="bottomRight"
        :trigger="['click', 'hover']"
      >
        <a @click="e => e.preventDefault()">
          <QIcon type="menu" />
        </a>
        <template #overlay>
          <AMenu v-if="!disabledDublicate">
            <AMenuItem @click="$emit('duplicate', product.id, product.gtin, product?.register_status?.id)">
              Дублировать
            </AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
    </div>
    <QBtn
      v-if="$canUse('client')"
      class="w-100 rounded-0"
      :disabled="disabledAdd"
      size="large"
      type="success"
      @click="$emit('create-form')"
    >
      <QIcon type="plus" />
      Добавить новый
    </QBtn>
  </AAffix>
</template>
<script>
import { GROUP_STATUSES, PRODUCT_STATUSES, REGISTER_STATUSES } from '@/config/types';

const STATUSES = {
  0: { className: 'edit', icon: 'edit' },
  1: { className: 'archive', icon: 'database' },
  2: { className: 'moderation', icon: 'clock-circle' },
  3: { className: 'error', icon: 'warning' },
  4: { className: 'wait', icon: 'check-circle' },
  5: { className: 'success', icon: 'global' },
  6: { className: 'edit', icon: 'edit' }, // Макет
};

export default {
  props: {
    products: {
      type: Array,
      required: true,
    },
    activeProductId: {
      type: [Number, String],
      required: true,
    },
    groupStatus: {
      type: Object,
      required: true,
    },
  },
  emits: ['duplicate', 'select', 'create-form'],
  computed: {
    disabledAdd() {
      return this.activeProductId === 0
            || this.groupStatus?.id === GROUP_STATUSES.sent.id
            || this.products?.length === 25;
    },
    disabledDublicate() {
      if (!this.$canUse(['client']))
        return true;
      if (this.products?.length) {
        return this.products.some(product => (product.id === 0) || (product.status.id === PRODUCT_STATUSES.moderation.id))
              || this.groupStatus?.id === GROUP_STATUSES.sent.id || this.products?.length === 25;
      }

      return false;
    },
  },
  methods: {
    showSpinner(registerStatus) {
      return registerStatus === REGISTER_STATUSES.in_process.id;
    },
    getStatusClass(product) {
      return `product-group-aside__item--${STATUSES[product.status.id].className}`;
    },
    getStatusIcon(product) {
      return STATUSES[product.status.id].icon;
    },
  },
};
</script>

<template>
  <AUpload
    v-bind="$attrs"
    :accept="getAccept"
    :before-upload="beforeUpload"
    :file-list="getValue"
    :multiple="multiple"
    :remove="handleRemove"
  >
    <slot />
  </AUpload>
</template>

<script>
import { isArray, isFile } from '@/utils/type-checks';
import { FILE_ACCEPT_LIST, IMG_ACCEPT_LIST } from '@/config/constants';

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: [Array, Object],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxFileSize: {
      type: Number,
      default: (30 * 1000 * 1000), // 30 MB in Bytes
    },
    accept: {
      type: String,
      default: null,
    },
    acceptBase: {
      type: Boolean,
      default: false,
    },
    acceptImg: {
      type: Boolean,
      default: false,
    },
    asyncRemove: {
      type: Function,
      default: () => Promise.resolve(),
    },
    dublicateFile: {
      type: [String, Number],
    },
  },
  emits: ['update:value'],
  data() {
    return {};
  },
  computed: {
    getValue() {
      if (!this.value)
        return [];

      return isArray(this.value) ? this.value : [this.value];
    },
    getAccept() {
      if (this.acceptBase)
        return FILE_ACCEPT_LIST;

      if (this.acceptImg)
        return IMG_ACCEPT_LIST;

      return this.accept;
    },
  },
  methods: {
    isValidFile(file) {
      let invalidFeedback = '';

      if (file.name.lastIndexOf('.') <= 0)
        invalidFeedback = 'Некорректный формат файла';
      else if (file.size > this.maxFileSize)
        invalidFeedback = `Превышен максимальный размер файла (${this.maxFileSize / 1000}кб)`;

      if (invalidFeedback) {
        this.$message.error(invalidFeedback);
        return false;
      } else {
        return true;
      }
    },

    beforeUpload(file) {
      if (!this.isValidFile(file))
        return;

      setTimeout(() => {
        this.$emit('update:value', this.multiple ? [...this.value, file] : file);
      });

      return false;
    },

    removeFile(file) {
      const index = this.getValue.indexOf(file);
      const newFileList = this.getValue.slice();
      newFileList.splice(index, 1);
      this.$emit('update:value', newFileList);
    },

    handleRemove(file) {
      if (isFile(file) || this.dublicateFile === 'dublicate') {
        this.removeFile(file);
      } else {
        return this.asyncRemove(file)
          .then(() => this.removeFile(file));
      }
    },
  },
};
</script>

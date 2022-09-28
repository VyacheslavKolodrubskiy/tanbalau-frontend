<template>
  <template v-if="downloadUrl">
    <QBtn
      download
      :href="downloadUrl"
      size="large"
      target="_blank"
      type="success"
    >
      Скачать
    </QBtn>
  </template>
  <template v-else>
    <ASpace v-if="tryCount > 0">
      <QBtn
        class="text-gray-600"
        disabled
        loading
        size="large"
        type="gray"
      >
        Генерируется
      </QBtn>
      <QBtn
        size="large"
        type="warning"
      >
        <QIcon
          class="fz-24 lh-none"
          :spin="loading"
          type="retweet"
          @click="throttledCheck"
        />
      </QBtn>
    </ASpace>
    <QBtn
      v-else
      v-bind="$attrs"
      size="large"
      @click="throttledCheck"
    >
      <slot />
    </QBtn>
  </template>
</template>

<script>
import { throttle } from '@/utils/lodash';

export default {
  inheritAttrs: false,
  props: {
    check: {
      type: Function,
      default: () => Promise.resolve(),
    },
    downloadUrl: {
      type: String,
      default: null,
    },
  },
  emits: ['check'],
  data() {
    this.throttledCheck = throttle(this.tryToDownload, 5000, { trailing: false });
    return {
      loading: false,
      tryCount: 0,
    };
  },
  methods: {
    tryToDownload() {
      this.loading = true;
      this.check()
        .then(() => {
          this.tryCount++;
        })
        .catch(() => {
          this.tryCount = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

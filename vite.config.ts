/* eslint-disable */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// @ts-ignore
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import ViteRadar from 'vite-plugin-radar'

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),

    // https://github.com/stafyniaksacha/vite-plugin-radar
    ViteRadar({
      // Yandex Metrica (multiple tag can be set with an array)
      metrica: [
        {
          id: '88475790',
          /**
           * You can configure all settings provided by metrika here
           * @see https://yandex.com/support/metrica/code/counter-initialize.html
           */
          config: {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce:  true,
            webvisor: true
          }
        }
      ],
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          '@vueuse/core': ['useCounter'],
          'ant-design-vue': ['notification', 'message'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

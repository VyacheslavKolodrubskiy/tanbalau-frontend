import { createApp } from 'vue';
import Antd from 'ant-design-vue/es';
import Maska from 'maska';
import YmapPlugin from 'vue-yandex-maps';

import App from './App.vue';
import router from './router';

import './router/before-each-guard';
import './router/after-each-guard';

import '@/plugins/dayjs';
import '@/plugins/chartjs';
import isMobile from '@/plugins/is-mobile';
// import antd from '@/plugins/antd';
import 'ant-design-vue/dist/antd.min.css';
import '@/scss/app.scss';

import { checkPermission } from '@/utils/permissions';
import { format } from '@/utils/format';
import { registerGlobalComponents } from '@/components/global-components';
import { registerIcons } from '@/components/register-icons';
import { pinia } from '@/stores';

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(Antd)
  .use(isMobile)
  .use(Maska)
  .use(YmapPlugin, {
    apiKey: '51d5362b-63f0-42fc-8335-9db54fe37efc',
    lang: 'ru_RU',
    coordorder: 'latlong',
  });

// app = antd(app);

registerGlobalComponents(app);
registerIcons(app);

app.config.globalProperties.$canUse = checkPermission;
app.config.globalProperties.$format = format;
app.mount('#app');

import * as antIcons from '@ant-design/icons-vue';
import type { App } from 'vue';

export function registerIcons(app: App) {
  Object.keys(antIcons).forEach((key) => {
    // eslint-disable-next-line import/namespace
    app.component(key, antIcons[key]);
  });
}

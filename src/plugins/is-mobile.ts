import type { App } from 'vue';
import { computed, reactive } from 'vue';
import { debounce } from '@/utils/lodash';
import { MOBILE_BREAKPOINT } from '@/config/constants';

const RESIZE_DELAY = 100;

export const app = reactive({
  width: window.innerWidth,
});

export const isMobile = computed(() => app.width < MOBILE_BREAKPOINT);

const debouncedResizeHandler = debounce(() => {
  app.width = window.innerWidth;
}, RESIZE_DELAY);

window.addEventListener('resize', debouncedResizeHandler);

export default function install(app: App) {
  Object.defineProperties(app.config.globalProperties, {
    $isMobile: {
      get() {
        return isMobile.value;
      },
    },
  });
}

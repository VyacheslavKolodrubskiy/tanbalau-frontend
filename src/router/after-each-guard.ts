import { nextTick } from 'vue';
import router from '@/router';
import { DEFAULT_TITLE } from '@/config/constants';

router.afterEach((to) => {
  nextTick().then(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

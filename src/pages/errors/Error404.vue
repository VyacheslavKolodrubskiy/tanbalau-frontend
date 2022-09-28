<template>
  <ErrorPage status="404" title="Страница не найдена">
    Вернитесь на <RouterLink :to="path">
      главную страницу
    </RouterLink>
  </ErrorPage>
</template>

<script>
import ErrorPage from '@/pages/errors/components/ErrorPage.vue';
import { DEFAULT_LOGGED_IN_ROUTE_NAME } from '@/config/constants';

export default {
  name: 'Error404',
  components: { ErrorPage },
  computed: {
    path() {
      return { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
    },
  },
};
</script>

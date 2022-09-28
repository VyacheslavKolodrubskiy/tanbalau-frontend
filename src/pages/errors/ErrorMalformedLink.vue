<template>
  <ErrorPage status="Ошибка" title="Ссылка по которой вы перешли повреждена либо имеет неверный формат">
    Вернитесь на <RouterLink :to="path">
      страницу авторизации
    </RouterLink>
  </ErrorPage>
</template>

<script>
import ErrorPage from '@/pages/errors/components/ErrorPage.vue';
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';

export default {
  name: 'ErrorMalformedLink',
  components: { ErrorPage },
  computed: {
    path() {
      return { name: DEFAULT_LOGGED_OUT_ROUTE_NAME };
    },
  },
};
</script>

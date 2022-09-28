<template>
  <ErrorPage
    status="500"
    title="Что-то пошло не так не сервере"
  >
    <RouterLink :to="getRouteLocation">
      Попробовать снова
    </RouterLink>
  </ErrorPage>
</template>

<script>
import ErrorPage from '@/pages/errors/components/ErrorPage.vue';
import { DEFAULT_LOGGED_IN_ROUTE_NAME } from '@/config/constants';

export default {
  name: 'Error500',
  components: { ErrorPage },
  computed: {
    getRouteLocation() {
      return this.$route.query.redirect || { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
    },
  },
};
</script>

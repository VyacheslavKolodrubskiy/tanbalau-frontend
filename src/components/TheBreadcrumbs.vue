<template>
  <ABreadcrumb :routes="routes">
    <template #itemRender="{ route }">
      <span v-if="routes.indexOf(route) === routes.length - 1">{{ route.breadcrumbName }}</span>
      <RouterLink v-else :to="route.path">
        {{ route.breadcrumbName }}
      </RouterLink>
    </template>
  </ABreadcrumb>
</template>

<script>
export default {
  name: 'TheBreadcrumb',
  computed: {
    routes() {
      return this.$route.matched
        .map(item => ({ path: item.path, breadcrumbName: item.meta.breadcrumbName }))
        .filter(item => !!item.breadcrumbName);
    },
  },
};
</script>

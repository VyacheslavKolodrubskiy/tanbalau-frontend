<template>
  <QBtn
    danger
    ghost
    size="large"
    @click="() => $router.go(-1)"
  >
    <slot>Отмена</slot>
  </QBtn>
</template>
<script>
export default {
};
</script>

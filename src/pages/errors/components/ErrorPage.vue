<template>
  <div class="error">
    <div class="error__body">
      <div class="error__status">
        {{ status }}
      </div>
      <div class="error__title">
        {{ title }}
      </div>
      <div class="error__descr">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ErrorPage',
  props: {
    status: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" >
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  background: center / cover no-repeat url('../../../assets/images/error-pages-background.jpg');
  min-height: 100vh;
  color: #FFFFFF;
  text-align: center;
  line-height: 1.2;
  &__status {
    font-weight: 800;
    font-size: 72px;
  }
  &__title {
    margin-top: 8px;
    font-weight: normal;
    font-size: 24px;
  }
  &__descr {
    margin-top: 32px;
    font-size: 16px;
    a {
      color: #FFFFFF;
      text-decoration: underline;
    }
  }

}
</style>

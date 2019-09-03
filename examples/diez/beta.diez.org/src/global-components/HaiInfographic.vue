<template>
  <div class="hai-holster">
    <Animation sizing="contain"></Animation>
  </div>
</template>

<script>

export default {
  components: {
    Animation: () => import('@haiku/tina-whatyouscaffoldedoutlooping/vue')
  }
};
</script>

<style lang="scss" scoped>
@import '@theme/styles/_utils.scss';

.hai-holster {
  width: 100%;
  height: 600px;
  @include tablet-large {
    height: 300px;
  }
}
</style>

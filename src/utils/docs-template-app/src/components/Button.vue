<template>
  <div class="button">
    <slot />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * Wrapper component with Button styles
 */
@Component
export default class Button extends Vue {
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

.button {
  @include button-panel();
  @include button-typograph();
  display: inline-block;
  margin-left: 15px;
  padding: 5px;
  transition: background-color 120ms ease;

  &:hover {
    background-color: rgba($palette-secondary, .67);
  }
}
</style>

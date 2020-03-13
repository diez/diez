<template>
  <div class="pill">
    <slot />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * Wrapper component with Pill styles
 */
@Component
export default class Pill extends Vue {
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

.pill {
  @include pill-panel();
  @include pill-typograph();
  display: inline-block;
  margin-left: 15px;
  padding: 5px;
  transition: background-color 120ms ease;

  &:hover {
    background-color: rgba($palette-secondary, .67);
  }
}
</style>

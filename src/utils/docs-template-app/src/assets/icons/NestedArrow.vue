<template>
  <svg :width="size" :height="size" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
    <g :fill="fill" fill-rule="nonzero">
      <path d="M18.187 15.748l-3.97 3.97a.75.75 0 0 0 1.061 1.06l4.5-4.5a.75.75 0 0 0 0-1.06l-4.5-4.5a.75.75 0 0 0-1.06 1.06l3.97 3.97z"/>
      <path d="M.498.748v13.5a2.25 2.25 0 0 0 2.25 2.25h16.5a.75.75 0 1 0 0-1.5h-16.5a.75.75 0 0 1-.75-.75V.748a.75.75 0 1 0-1.5 0z"/>
    </g>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * NestedArrow Icon
 */
@Component
export default class NestedArrow extends Vue {
  @Prop() readonly fill!: string;
  @Prop({default: 20}) readonly size!: number;
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";
svg g {
  fill: $palette-primary;
}
</style>

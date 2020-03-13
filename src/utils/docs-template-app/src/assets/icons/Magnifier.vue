<template>
  <svg :width="size" :height="size" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <path d="M458.611 26.914l5.438 5.437a1.2 1.2 0 1 1-1.698 1.698l-5.437-5.438A10.156 10.156 0 0 1 450.6 30.8c-5.633 0-10.2-4.567-10.2-10.2 0-5.633 4.567-10.2 10.2-10.2 5.633 0 10.2 4.567 10.2 10.2 0 2.384-.818 4.577-2.189 6.314zm-2.42-.876a7.8 7.8 0 1 0-.154.154 1.215 1.215 0 0 1 .155-.154z" id="a"/>
    </defs>
    <use :fill="fill" fill-rule="nonzero" xlink:href="#a" transform="translate(-440 -10)"/>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Magnifier Icon
 */
@Component
export default class Magnifier extends Vue {
  @Prop({default: 25}) readonly size!: number;
  @Prop() readonly fill!: string;
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";
svg use {
  fill: $palette-contrast-fill;
}
</style>

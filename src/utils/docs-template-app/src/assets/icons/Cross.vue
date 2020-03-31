<template>
  <svg :width="size" :height="size" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
    <g fill-rule="nonzero">
      <path stroke-width="1.3" stroke="blue" d="M1.622 14.218L14.218 1.622a.594.594 0 1 0-.84-.84L.782 13.378a.594.594 0 0 0 .84.84z"/>
      <path stroke-width="1.3" stroke="blue" d="M.782 1.622l12.596 12.596a.594.594 0 1 0 .84-.84L1.622.782a.594.594 0 0 0-.84.84z"/>
    </g>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Cross Icon
 */
@Component
export default class Cross extends Vue {
  @Prop({default: 15}) readonly size!: number;
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

g path {
  stroke: $palette-electric-violet;
}

svg {
  cursor: pointer;
}
</style>

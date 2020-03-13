<template>
  <span :style="style"></span>
</template>

<script lang="ts">
import {DocsTargetSpec} from '@diez/docs';
import {ColorData} from '@diez/prefabs';
import {colorToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Color Icon view.
 */
@Component
export default class ColorIcon extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<ColorData>;

  get style () {
    const {h, s, l, a} = this.tree.properties;
    return {
      backgroundColor: colorToCss({h: h.value, s: s.value, l: l.value, a: a.value}),
      borderColor: l.value > 0.8 ? undefined : 'transparent',
    };
  }
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

span {
  display: inline-block;
  border-radius: 50%;
  border: 1px solid $palette-primary-border;
}
</style>

<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <div :style="{backgroundColor: details.hsla}"></div>
    </template>
    <template v-slot:extra>
      <div>
        <span>{{details.hex}}</span>
      </div>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {DocsTargetSpec, hslToHex} from '@diez/targets';
import {ColorData} from '@diez/prefabs';
import {colorToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Color Item view.
 */
@Component
export default class ColorItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<ColorData>;

  get details () {
    const {h, s, l, a} = this.tree.properties;
    const colorData = {h: h.value, s: s.value, l: l.value, a: a.value};
    return {
      hsla: colorToCss(colorData),
      hex: `#${hslToHex(colorData)}`,
    };
  }
}
</script>

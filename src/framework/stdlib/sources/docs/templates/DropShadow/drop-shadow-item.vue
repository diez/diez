<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <div class="shadow-preview">
        <div :style="style"></div>
      </div>
    </template>
    <template v-slot:extra>
      <div>
        <span>{{style.boxShadow}}</span>
      </div>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {DocsTargetSpec, hslToHex} from '@diez/docs';
import {Color, DropShadowData, Point2D} from '@diez/prefabs';
import {colorToCss, dropShadowToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * DropShadow Item view.
 */
@Component
export default class DropShadowItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<DropShadowData>;

  get hsla () {
    const {h, s, l, a} = this.tree.properties.color.properties;
    return {h: h.value, s: s.value, l: l.value, a: a.value};
  }

  get style () {
    const offset = this.tree.properties.offset;
    const radius = this.tree.properties.radius;

    return {
      boxShadow: dropShadowToCss({
        color: new Color(this.hsla),
        offset: new Point2D({x: offset.value.x, y: offset.value.y}),
        radius: this.tree.properties.radius.value,
      }),
    };
  }
}
</script>

<style lang="scss" scoped>
.shadow-preview {
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 35px;
    height: 35px;
    border-radius: 4px;
  }
}
</style>

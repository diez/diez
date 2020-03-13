<template>
  <docs-detail :tree="tree" :details="details">
    <figure>
      <div class="shadow-preview">
        <div class="display" :style="style"></div>
      </div>
    </figure>
  </docs-detail>
</template>


<script lang="ts">
import {displayableHsla, DocsTargetSpec, hslToHex} from '@diez/docs';
import {Color, DropShadowData, Point2D} from '@diez/prefabs';
import {colorToCss, dropShadowToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * DropShadow Detail view.
 */
@Component
export default class DropShadowDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<DropShadowData>;

  get hsla () {
    const {h, s, l, a} = this.tree.properties.color.properties;
    return {h: h.value, s: s.value, l: l.value, a: a.value};
  }

  get details () {
    const offset = this.tree.properties.offset;
    const radius = this.tree.properties.radius;

    return {
      Color: displayableHsla(this.hsla),
      Offset: `${offset.properties.x.value}, ${offset.properties.y.value}`,
      Radius: radius.value,
    };
  }

  get style () {
    const offset = this.tree.properties.offset;
    const radius = this.tree.properties.radius;

    return {
      boxShadow: dropShadowToCss({
        color: new Color(this.hsla),
        offset: new Point2D({x: offset.properties.x.value, y: offset.properties.y.value}),
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
}

.display {
  width: 200px;
  height: 100px;
  border-radius: 4px;
}
</style>

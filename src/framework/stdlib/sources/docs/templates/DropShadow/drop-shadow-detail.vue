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
import {Color, DropShadowData, Point2D} from '@diez/prefabs';
import {dropShadowToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';
import {displayableHsla} from '../../../../src/color';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<DropShadowData>;

/**
 * DropShadow Detail view.
 */
@Component
export default class DropShadowDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;

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
    const {h, s, l, a} = this.hsla;

    return {
      boxShadow: dropShadowToCss({
        color: Color.hsla(h, s, l, a),
        offset: Point2D.make(offset.properties.x.value, offset.properties.y.value),
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

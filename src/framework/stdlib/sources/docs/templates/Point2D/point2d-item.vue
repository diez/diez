<template>
  <docs-item :tree="tree">
    <template v-slot:extra>
      <p>{{xyPoints}}</p>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {Point2DData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<Point2DData>;

/**
 * Point2D view item.
 */
@Component
export default class StringItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;

  get xyPoints () {
    return `(${this.tree.properties.x.value}, ${this.tree.properties.y.value})`;
  }
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

p {
  @include typography-copy();
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

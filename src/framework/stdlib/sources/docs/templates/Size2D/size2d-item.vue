<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <p>{{widthHeightValues}}</p>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {Size2DData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<Size2DData>;

/**
 * Point2D view item.
 */
@Component
export default class StringItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;

  get widthHeightValues () {
    return `[${this.tree.properties.width.value}, ${this.tree.properties.height.value}]`;
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

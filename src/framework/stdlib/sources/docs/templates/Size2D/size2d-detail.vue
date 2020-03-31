<template>
  <docs-detail :tree="tree">
    <figure>
      <div class="preview">
        <h2>{{widthHeightValues}}</h2>
      </div>
    </figure>
  </docs-detail>
</template>

<script lang="ts">
import {Size2DData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<Size2DData>;

/**
 * String item view.
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
.preview {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

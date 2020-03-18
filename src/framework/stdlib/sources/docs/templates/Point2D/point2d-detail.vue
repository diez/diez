<template>
  <docs-detail :tree="tree">
    <figure>
      <div class="preview">
        <h2>{{xyPoints}}</h2>
      </div>
    </figure>
  </docs-detail>
</template>

<script lang="ts">
import {DocsTargetSpec} from '@diez/targets';
import {Point2DData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * String item view.
 */
@Component
export default class StringItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<Point2DData>;

  get xyPoints () {
    return `(${this.tree.properties.x.value}, ${this.tree.properties.y.value})`;
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

<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <p>{{tree.value}}</p>
    </template>
    <template v-slot:extra>
      <div>
        <span>{{tree.name}}</span>
      </div>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {DocsTargetSpec} from '@diez/targets';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Number item view.
 */
@Component
export default class NumberItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
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

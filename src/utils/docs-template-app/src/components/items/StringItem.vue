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
 * String item view.
 */
@Component
export default class StringItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

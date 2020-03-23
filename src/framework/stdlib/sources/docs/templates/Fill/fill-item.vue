<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <div>
        Missing template design.
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
import {FillData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<FillData>;

/**
 * Fill Item view.
 */
@Component
export default class FillItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
}
</script>

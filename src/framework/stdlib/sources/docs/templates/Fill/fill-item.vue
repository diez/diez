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
import {DocsTargetSpec, hslToHex} from '@diez/targets';
import {Color, FillData, Point2D} from '@diez/prefabs';
import {colorToCss, dropShadowToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Fill Item view.
 */
@Component
export default class FillItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<FillData>;
}
</script>

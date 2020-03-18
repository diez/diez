<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <div class="display">
        <PanelIcon />
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
import {Color, PanelData, Point2D} from '@diez/prefabs';
import {colorToCss, dropShadowToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';
import PanelIcon from './panel-icon.vue';

/**
 * File Item view.
 */

@Component({
  name: 'PanelItem',
  components: {
    PanelIcon,
  },
})
export default class PanelItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<PanelData>;
}
</script>

<style lang="scss" scoped>
.display {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 30px !important;
}
</style>

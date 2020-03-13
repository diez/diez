<template>
  <docs-detail :tree="tree" :details="details">
    <figure>
      <div class="preview">
        <div class="icon">
          <PanelIcon/>
        </div>
      </div>
    </figure>
  </docs-detail>
</template>


<script lang="ts">
import {DocsTargetSpec, hslToHex} from '@diez/docs';
import {Color, PanelData, Point2D} from '@diez/prefabs';
import {colorToCss, dropShadowToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';
import PanelIcon from './panel-icon.vue';

/**
 * Panel Detail view.
 */

@Component({
  name: 'PanelDetail',
  components: {
    PanelIcon,
  },
})
export default class PanelDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<PanelData>;

  get details () {
    return {
      'Corner Radius': this.tree.properties.cornerRadius.value,
      Elevation: this.tree.properties.elevation.value,
    };
  }
}
</script>

<style lang="scss" scoped>
.preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 100px;
  border-radius: 4px;
}
</style>

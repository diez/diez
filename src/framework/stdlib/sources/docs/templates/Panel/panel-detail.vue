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
import {PanelData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
import PanelIcon from './panel-icon.vue';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<PanelData>;

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
  @Prop() readonly tree!: DocsTargetSpec;

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

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
import {PanelData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
import PanelIcon from './panel-icon.vue';

type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<PanelData>;

/**
 * Panel Item view.
 */
@Component({
  name: 'PanelItem',
  components: {
    PanelIcon,
  },
})
export default class PanelItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
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

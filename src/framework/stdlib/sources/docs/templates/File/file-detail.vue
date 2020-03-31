<template>
  <docs-detail :tree="tree">
    <figure>
      <div class="preview">
        <div class="icon">
          <FileIcon/>
        </div>
      </div>
    </figure>
  </docs-detail>
</template>

<script lang="ts">
import {Point2DData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
import FileIcon from './file-icon.vue';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<Point2DData>;

/**
 * File detail view.
 */
@Component({
  components: {
    FileIcon,
  },
})
export default class FileDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
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

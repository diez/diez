<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <div class="display">
        <FileIcon />
      </div>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {FileData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';
import FileIcon from './file-icon.vue';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<FileData>;

/**
 * File Item view.
 */
@Component({
  components: {
    FileIcon,
  },
})
export default class FileItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;

  get extension () {
    return this.tree.properties.type.value;
  }
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

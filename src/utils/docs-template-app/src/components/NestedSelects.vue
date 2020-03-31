<template>
  <div>
    <custom-select :options="options" :selected="selected[depth]" @change="updateSelected"/>
    <node :depth="depth + 1" :tree="tree[selected[0]]" :selected="selected" v-if="selected[depth + 1]" @change="bubble" />
  </div>
</template>

<script lang="ts">
import CustomSelect from '@/components/CustomSelect.vue';
import {KnownPlatformNames} from '@/utils';
import {Component, Prop, Vue} from 'vue-property-decorator';
type ParsedExampleTree = import('@diez/targets').ParsedExampleTree;

/**
 * Code examples for the current visible component.
 */
@Component({
  components: {
    CustomSelect,
  },
  name: 'node',
})
export default class CodeExamples extends Vue {
  @Prop({}) readonly tree!: ParsedExampleTree;
  @Prop({}) readonly selected!: string[];
  @Prop({default: 0}) readonly depth!: number;

  get options () {
    return Object.keys(this.tree).map(this.mapKnownPlatforms);
  }

  private mapKnownPlatforms (platform: string) {
    if (this.depth === 0 && KnownPlatformNames[platform]) {
      return KnownPlatformNames[platform];
    }

    return platform;
  }

  protected updateSelected (selection: string) {
    this.selected[this.depth] = selection.toLowerCase();
    this.$emit('change', this.selected.slice(0, this.depth + 1), this.tree);
  }

  protected bubble () {
    this.$emit('change', ...arguments);
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
}

.select {
  width: 180px;
  margin-right: 15px;
}
</style>

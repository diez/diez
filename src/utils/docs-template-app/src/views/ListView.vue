<template>
  <div v-if="tree && tree.properties">
    <breadcrumb></breadcrumb>
    <recursive-list :grid="grid" :maxDepth="maxDepth" />
  </div>
</template>

<script lang="ts">
import {GridCollection} from '@/api';
import Breadcrumb from '@/components/Breadcrumb.vue';
import DynamicHeading from '@/components/DynamicHeading.vue';
import DefaultItem from '@/components/items/DefaultItem.vue';
import NumberItem from '@/components/items/NumberItem.vue';
import StringItem from '@/components/items/StringItem.vue';
import RecursiveList from '@/components/RecursiveList.vue';
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;

/**
 * View displaying a list of components wrapped in a container.
 */
@Component({
  components: {
    Breadcrumb,
    DynamicHeading,
    RecursiveList,
  },
})
export default class ListView extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
  @Prop({default: 4}) readonly maxDepth!: number;

  grid: GridCollection = {
    component: this.tree,
    values: [],
    collections: [],
  };

  mounted () {
    this.fetchGrid(this.tree).then((grid) => {
      this.grid = grid;
    });
  }

  async fetchGrid (tree: DocsTargetSpec): Promise<GridCollection> {
    const grid: GridCollection = {
      component: tree,
      values: [],
      collections: [],
    };

    for (const item in tree.properties) {
      const component = tree.properties[item] as DocsTargetSpec;
      if (component.isPrimitive) {
        grid.values.push({component, template: this.getPrimitiveTemplate(component)});
      } else if (component.binding) {
        const template = await import(`@diez/stdlib/sources/docs/templates/${component.binding.templates.item}`);
        grid.values.push({component, template: template.default || DefaultItem});
      } else if (component) {
        grid.collections.push(await this.fetchGrid(component));
      }
    }

    return grid;
  }

  getPrimitiveTemplate (itemValue: DocsTargetSpec) {
    switch (itemValue.type) {
      case 'String':
        return StringItem;
      case 'Float':
      case 'Integer':
        return NumberItem;
      default:
        return DefaultItem;
    }
  }
}
</script>

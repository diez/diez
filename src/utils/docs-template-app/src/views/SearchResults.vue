<template>
  <div v-if="results && Object.keys(results).length" id="search-results">
    <div v-for="(group, key) of results" :key="key">
      <div v-if="group.length">
        <h2>{{key | prefabPlural}}</h2>
        <div class="group">
          <component :is="result.template" :tree="result" v-for="result of group" :key="result.id"  />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    No components <span v-if="this.$route.query.name">containing "{{this.$route.query.name}}"</span> <span v-if="this.$route.query.type"> of type <code>{{this.$route.query.type}}</code></span>.
  </div>
</template>

<script lang="ts">
import NestedArrow from '@/assets/icons/NestedArrow.vue';
import DynamicLoader from '@/components/DynamicLoader.vue';
import DefaultItem from '@/components/items/DefaultItem.vue';
import GroupItem from '@/components/items/GroupItem.vue';
import NumberItem from '@/components/items/NumberItem.vue';
import StringItem from '@/components/items/StringItem.vue';
import {Index, Query, tokenizer} from 'lunr';
import {Component, Mixins, Watch} from 'vue-property-decorator';
import {ComponentTypesMap} from '../api';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;

/**
 * Search results view.
 */
@Component({
  components: {
    NestedArrow,
  },
})
export default class SearchResults extends Mixins(DynamicLoader) {
  private resultsLimit = 20;
  private searchIndex?: Index;
  results: ComponentTypesMap = {};
  defaultTemplate = GroupItem;
  templateType = 'item';

  @Watch('$route.query.type')
  @Watch('$route.query.name')
  queryByName () {
    this.$nextTick(() => {
      this.results = this.calculateResults();
    });
  }

  async mounted () {
    const request = await fetch('/assets/searchIndex.json');
    const searchIndex = await request.json();
    this.searchIndex = Index.load(searchIndex);
    this.results = this.calculateResults();
  }

  private calculateResults () {
    if (!this.searchIndex) {
      return [];
    }

    const results = this.searchIndex.query((query) => {
      const nameTerm = tokenizer(this.$route.query.name);
      const typeTerm  = tokenizer(this.$route.query.type);

      query.term(nameTerm, {
        fields: ['name'],
        wildcard: Query.wildcard.TRAILING | Query.wildcard.LEADING,
        presence: Query.presence.REQUIRED,
      });

      query.term(typeTerm, {
        fields: ['type'],
        wildcard: Query.wildcard.NONE,
        presence: Query.presence.REQUIRED,
      });
    });

    return results
      .slice(0, this.resultsLimit)
      .map((result) => {
        const component = this.getComponentOrPrimitive(result.ref);
        const template = this.getTemplate(component);
        return Object.assign(component, {template});
      })
      .reduce((result, component) => this.reduceToGroups(result, component), {});
  }

  private reduceToGroups (result: ComponentTypesMap, component?: DocsTargetSpec) {
    if (!component) {
      // this should never happen.
      return result;
    }

    if (component.binding) {
      if (!result[component.type]) {
        result[component.type] = [];
      }

      result[component.type].push(component);
    } else if (component.isPrimitive) {
      if (!result.Primitive) {
        result.Primitive = [];
      }

      result.Primitive.push(component);
    } else {
      if (!result.Group) {
        result.Group = [];
      }

      result.Group.push(component);
    }

    return result;
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

<style lang="scss" scoped>
.group {
  display: flex;
  flex-wrap: wrap;
}
</style>

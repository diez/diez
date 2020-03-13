<template>
  <div v-if="depth < maxDepth">
    <dynamic-heading :level="depth + 1" :id="grid.component.name">{{ grid.component.name || grid.component.type }}</dynamic-heading>
    <div class="comments" v-if="grid.component.comments">
      <div v-if="grid.component.comments.type && depth === 0" v-html="grid.component.comments.type"></div>
      <div v-else-if="grid.component.comments.instance" v-html="grid.component.comments.instance"></div>
    </div>
    <div class="nested-items">
      <div class="properties-wrapper">
        <template v-for="value in grid.values">
          <component :is="value.template" :tree="value.component" :key="value.component.name" :id="value.component.name"></component>
        </template>
      </div>

      <div v-for="(collection, index) in grid.collections" :key="index">
        <recursive-list :depth="depth + 1" :grid="collection" :maxDepth="maxDepth" />
      </div>
    </div>
  </div>
  <div v-else-if="depth === maxDepth">
    <dynamic-heading :level="maxDepth + 1" :id="grid.component.name">
      {{ grid.component.name || grid.component.type }}
      <router-link :to="grid.component.id">
        <nested-arrow size="10" />
      </router-link>
    </dynamic-heading>
  </div>
</template>

<script lang="ts">
import {GridCollection} from '@/api';
import NestedArrow from '@/assets/icons/NestedArrow.vue';
import DynamicHeading from '@/components/DynamicHeading.vue';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Recursive list of components.
 */
@Component({
  components: {
    DynamicHeading,
    NestedArrow,
  },
  name: 'recursive-list',
})
export default class RecursiveList extends Vue {
  @Prop() readonly grid!: GridCollection;
  @Prop({default: 0}) readonly depth!: number;
  @Prop({default: 4}) readonly maxDepth!: number;
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

.properties-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.nested-items {
  margin-top: $spacings-xxl-px;
}

.comments {
  line-height: 1.4;
}
</style>

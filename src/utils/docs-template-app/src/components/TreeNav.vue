<template>
  <li>
    <router-link :to="tree.id" :class="{'item--active': active, 'item--open': open, 'item--expandable': isExpandable, item: true}">
      <span @click.stop.prevent="toggleOpen" :class="{'chevron--open': open, chevron: true}" v-if="isExpandable">
        <chevron size="13"/>
      </span>
      <div class="item__name">
        <div class="box-icon" v-if="isExpandable">
          <box size="20" />
        </div>
        <span v-else class="dynamic-icon">
          <component :is="template" :tree="tree" />
        </span>
        <p>{{tree.name}}</p>
      </div>
    </router-link>
    <ul v-if="open && isExpandable" style="paddingLeft: 12px">
      <node
        v-for="prop in sortedProperties"
        :key="prop.id"
        :tree="prop"
        :depth="depth + 1"
      >
      </node>
    </ul>
  </li>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from 'vue-property-decorator';
// import {DocsTargetSpec, TemplateTypes} from '../api';
import Box from '../assets/icons/Box.vue';
import Chevron from '../assets/icons/Chevron.vue';
import {isBagOfComponents, sortByBagsOfComponentsFirst} from '../utils/component';
import {storage} from '../utils/storage';
import DynamicLoader from './DynamicLoader.vue';
import BooleanIcon from './tree-icons/BooleanIcon.vue';
import DefaultIcon from './tree-icons/DefaultIcon.vue';
import NumberIcon from './tree-icons/NumberIcon.vue';
import StringIcon from './tree-icons/StringIcon.vue';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;
type TemplateTypes = import('@diez/targets').TemplateTypes;

/**
 * Nested navigation recursively built from a tree.
 */
@Component({
  name: 'node',
  components: {
    Box,
    Chevron,
  },
})
export default class TreeNav extends Mixins(DynamicLoader) {
  @Prop() readonly tree!: DocsTargetSpec;
  @Prop({default : 0}) readonly depth!: number;
  private readonly storageOpenIdsKey = 'open-ids';
  private open = false;
  protected active = false;
  protected templateType: TemplateTypes = 'icon';
  protected defaultTemplate = DefaultIcon;
  protected notFoundTemplate = DefaultIcon;

  protected beforeMount () {
    this.onUpdateStatus();
  }

  protected onUpdateStatus () {
    this.open = this.isOpen;
    this.active = this.isActive;
  }

  protected getComponent () {
    return this.tree;
  }

  get isOpen () {
    if (this.open) {
      return true;
    }

    return this.$route.fullPath.includes(this.tree.id) || this.openElements.some((id) => id.includes(this.tree.id));
  }

  get isActive () {
    return this.$route.fullPath === this.tree.id;
  }

  get isExpandable () {
    return isBagOfComponents(this.tree);
  }

  get sortedProperties () {
    return sortByBagsOfComponentsFirst(this.component!.properties);
  }

  get openElements () {
    return storage.getJson<string[]>(this.storageOpenIdsKey) || [];
  }

  protected toggleOpen () {
    if (this.isExpandable) {
      if (this.open) {
        this.removeFromCache();
        this.open = false;
      } else {
        this.addToCache();
        this.open = true;
      }
    }
  }

  private removeFromCache () {
    const elements = this.openElements.filter((item) => item !== this.tree.id);
    storage.setJson(this.storageOpenIdsKey, elements);
  }

  private addToCache () {
    const elements = this.openElements.concat(this.tree.id);
    storage.setJson(this.storageOpenIdsKey, elements);
  }

  protected getPrimitiveTemplate (item: DocsTargetSpec) {
    switch (item.type) {
      case 'String':
        return StringIcon;
      case 'Float':
      case 'Integer':
        return NumberIcon;
      case 'Boolean':
        return BooleanIcon;
      default:
        return DefaultIcon;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@diez/styles.scss";

  ul {
    margin: 0;
    list-style: none;
    user-select: none;
  }

  .item {
    display: flex;
    text-decoration: none;
    color: inherit;
    align-items: center;
    border-radius: $corner-radii-base-px;
    padding: 3px 5px;
    font-weight: 400;
    background-color: white;

    &--active {
      background-color: $palette-primary !important;
      color: $palette-primary-fill;
      font-weight: bold;

      &.box-icon {
        fill: $palette-primary-fill;
      }

      &.chevron {
        fill: $palette-primary-fill;
      }

      &.dynamic-icon {
        fill: $palette-primary-fill;
      }
    }

    &--expandable {
      .item__name {
        font-weight: 700;
        padding-left: 0;
      }
    }

    &:focus, &:hover {
      outline: none;
      background-color: $palette-secondary;
    }
  }

  .chevron {
    cursor: pointer;
    fill: $palette-contrast-fill;

    &--open {
      display: inline-block;
      transform: rotate(90deg);
    }
  }

  .item__name {
    display: flex;
    align-items: center;
    padding-left: 15px;

    p {
      margin: auto $spacings-xs-px;
    }
  }

  .dynamic-icon {
    width: 15px;
    height: 15px;
    display: inline-block;
    fill: $palette-contrast-fill;

    > * {
      width: 100%;
      height: 100%;
    }
  }

  .box-icon {
    display: flex;
    fill: $palette-electric-violet;
  }
</style>

<template>
  <div>
    <breadcrumb></breadcrumb>
    <h1>{{tree.name}}</h1>
    <figcaption v-if="tree.comments.instance" v-html="tree.comments.instance"></figcaption>
    <slot></slot>
    <div id="component-type">
      <h4>Component Type</h4>
      <p>
        {{tree.type}}
        <a
          :href="prefabLink"
          target="_blank"
          :title="`External link to ${tree.type} prefab docs`"
          >
          <pill>
            Prefab Docs
            <external-arrow />
          </pill>
        </a>
      </p>
    </div>
    <mappings :references="tree.references" />
    <details-table :details="details" :references="tree.references"></details-table>
  </div>
</template>

<script lang="ts">
import ExternalArrow from '@/assets/icons/ExternalArrow.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import DetailsTable from '@/components/DetailsTable.vue';
import Mappings from '@/components/Mappings.vue';
import Pill from '@/components/Pill.vue';
import {getDocumentationLinkForType} from '@/utils/component';
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;

/**
 * Wrapper for a component's Detail view.
 */
@Component({
  components: {
    DetailsTable,
    Breadcrumb,
    Pill,
    ExternalArrow,
    Mappings,
  },
})
export default class DocsDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
  @Prop() readonly details!: {[key: string]: string};

  get prefabLink () {
    return getDocumentationLinkForType(this.tree.type);
  }
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

figure > *:first-child {
  @include docs-detail-panel();
  @include docs-detail-size();

  overflow: hidden;
  border: 1px solid $palette-primary-border;
  text-align: center;
  box-shadow: none;
}

figure img {
  padding: $spacings-sm-px;
  height: 100%;
}

figcaption {
  width: 100%;
  margin: 0 0 $spacings-xxl-px;
}

a {
  font-family: inherit;
  color: inherit;
  font-size: inherit;
  vertical-align: text-bottom;
}

svg {
  vertical-align: bottom;
}
</style>

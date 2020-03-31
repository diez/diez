<template>
  <div v-if="referenceLink">
    <h4>Value comes from:</h4>
    <a
      class="link-pill"
      v-if="referenceLink"
      :href="referenceLink"
      >
        {{reference.parentType}}.{{reference.name}}
    </a>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {findInTreeFromReference} from '../utils/component';
type PropertyReference = import('@diez/compiler-core').PropertyReference;

/**
 * Show mappings of the current component.
 */
@Component
export default class Mappings extends Vue {
  @Prop() protected readonly references!: PropertyReference[];

  get reference () {
    return this.$props && this.references.find((reference) => reference.path.length === 0);
  }

  get referenceLink () {
    if (!this.reference) {
      return null;
    }

    const docsReference = findInTreeFromReference(this.$treeRoot, this.reference);

    if (!docsReference) {
      return null;
    }

    return docsReference.link;
  }
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

.link-pill {
  @include button-panel();
  @include typography-button();
  border: 1px solid currentColor;
  display: inline-block;
  padding: $spacings-md-px $spacings-sm-px;
  color: $palette-electric-violet;
  background-color: rgba($palette-secondary, .67);

  &:hover {
    background-color: $palette-secondary;
  }
}
</style>

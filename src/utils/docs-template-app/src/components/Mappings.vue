<template>
  <div v-if="referenceLink">
    Defined by:<a :href="referenceLink"><pill>{{reference.parentType}}.{{reference.name}}</pill></a>
  </div>
</template>

<script lang="ts">
import Pill from '@/components/Pill.vue';
import {Component, Prop, Vue} from 'vue-property-decorator';
import {findInTreeFromReference} from '../utils/component';
type PropertyReference = import('@diez/compiler-core').PropertyReference;

/**
 * Show mappings of the current component.
 */
@Component({
  components: {
    Pill,
  },
})
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

a {
  margin-left: -10px;
}
</style>

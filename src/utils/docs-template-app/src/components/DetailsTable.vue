<template>
  <div>
    <h4>Details</h4>
    <table>
      <tr :key="name" v-for="(value, name) in details">
        <td>{{name}}</td>
        <td>
          <span v-if="inferDocReference(name)">
            Defined by:<details-table-reference class="definition-link" :reference="inferDocReference(name)"></details-table-reference>
          </span>
          {{value}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {ItemDetails} from '@/api';
import DetailsTableReference from '@/components/DetailsTableReference.vue';
import {Component, Prop, Vue} from 'vue-property-decorator';
import {findInTreeFromReference} from '../utils/component';
type PropertyReference = import('@diez/compiler-core').PropertyReference;

/**
 * Table showing key/value pairs.
 */
@Component({
  components: {
    DetailsTableReference,
  },
})
export default class DetailsTable extends Vue {
  @Prop() readonly details!: ItemDetails;
  @Prop() protected readonly references!: PropertyReference[];

  inferDocReference (name: string) {
    if (!this.references) {
      return null;
    }

    const reference = this.references.find((ref) => ref.path.find((p) => name.toLowerCase().includes(p.toLowerCase())));
    if (!reference) {
      return null;
    }

    return findInTreeFromReference(this.$treeRoot, reference);
  }
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

table {
  border-spacing: 22px 6px;
  margin-left: -22px;
}

td:first-child {
  color: $palette-secondary-text;
}

h4 {
  margin-bottom: 15px;
}

.definition-link {
  margin-left: -10px;
  margin-right: 5px;
}
</style>

<template>
  <div>
    <h4>Details</h4>
    <table>
      <tr :key="name" v-for="(value, name) in details">
        <td>{{name}}</td>
        <td>{{value}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {ItemDetails} from '@/api';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Table showing key/value pairs.
 */
@Component
export default class DetailsTable extends Vue {
  @Prop() readonly details!: ItemDetails;
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
</style>

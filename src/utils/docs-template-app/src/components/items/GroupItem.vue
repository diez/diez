<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <div class="box">
        <box :size="40" />
      </div>
    </template>
    <template v-slot:extra>
      <div>
        <span>{{tree.type}}</span>
      </div>
    </template>
  </docs-item>
</template>

<script lang="ts">
import Box from '@/assets/icons/Box.vue';
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;

/**
 * Group item view.
 */
@Component({
  components: {
    Box,
  },
})
export default class GroupItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

.box {
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  fill: $palette-electric-violet;
}
</style>

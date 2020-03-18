<template>
  <docs-item :tree="tree" fullWidth="true">
    <template v-slot:preview>
      <div class="typograph-preview" :style="style">
        {{pangram}}
      </div>
    </template>
    <template v-slot:extra>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {DocsTargetSpec, getPangram} from '@diez/targets';
import {TypographData} from '@diez/prefabs';
import {colorToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Typograph Item view.
 */
@Component
export default class TypographItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<TypographData>;

  get pangram () {
    return getPangram(this.tree.name);
  }

  get style () {
    const {h, s, l, a} = this.tree.properties.color.properties;

    return {
      fontFamily: this.tree.properties.font.properties.name.value,
      fontSize: `${this.tree.properties.fontSize.value}px`,
      fontWeight: this.tree.properties.font.properties.weight.value,
      fontStyle: this.tree.properties.font.properties.style.value,
      textAlign: this.tree.properties.alignment.value,
      lineHeight: this.tree.properties.lineHeight.value,
      color: colorToCss({h: h.value, s: s.value, l: l.value, a: a.value}),
      backgroundColor: l.value > 0.5 ? '#000010' : '#fff',
    };
  }
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

.typograph-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacings-lg-px;
}
</style>

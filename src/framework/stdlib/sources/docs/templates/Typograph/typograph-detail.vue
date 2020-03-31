<template>
  <docs-detail :tree="tree" :details="details">
    <figure>
      <p :style="style">
        {{this.pangram}}
      </p>
    </figure>
  </docs-detail>
</template>

<script lang="ts">
import {TypographData} from '@diez/prefabs';
import {colorToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';
import {displayableHsla} from '../../../../src/color';
import {getPangram} from '../../../../src/typograph';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<TypographData>;

/**
 * Typograph Detail view.
 */
@Component
export default class TypographDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;

  get pangram () {
    return getPangram(this.tree.name);
  }

  get contrastColor () {
    return this.tree.properties.color.properties.l.value > 0.5 ? '#000010' : '#fff';
  }

  get hsla () {
    const {h, s, l, a} = this.tree.properties.color.properties;
    return {h: h.value, s: s.value, l: l.value, a: a.value};
  }

  get details () {
    return {
      'Font Name': this.style.fontFamily,
      'Font Size': this.style.fontSize,
      'Font Color': displayableHsla(this.hsla),
      'Font Weight': this.style.fontWeight,
      Style: this.style.fontStyle,
      Alignment: this.style.textAlign,
      'Line-Height': this.style.lineHeight,
    };
  }

  get style () {
    return {
      backgroundColor: this.contrastColor,
      color: colorToCss(this.hsla),
      fontFamily: this.tree.properties.font.properties.name.value,
      fontSize: `${this.tree.properties.fontSize.value}px`,
      fontWeight: this.tree.properties.font.properties.weight.value,
      fontStyle: this.tree.properties.font.properties.style.value,
      textAlign: this.tree.properties.alignment.value,
      lineHeight: this.tree.properties.lineHeight.value,
    };
  }
}
</script>

<style lang="scss">
figure p {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

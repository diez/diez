<template>
  <docs-detail :tree="tree" :details="details">
    <figure>
      <div :style="{background: gradient}"></div>
    </figure>
  </docs-detail>
</template>

<script lang="ts">
import {displayableHsla, DocsTargetSpec} from '@diez/targets';
import {Color, GradientStop, LinearGradientData, Point2D} from '@diez/prefabs';
import {linearGradientToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Linear Gradient Detail view.
 */
@Component
export default class LinearGradientDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<LinearGradientData>;

  get details () {
    const stops = this.tree.properties.stops.value.reduce((acc, stop: any, index) => {
      const {h, s, l, a} = stop.properties.color.properties;
      const hsla = displayableHsla({h: h.value, s: s.value, l: l.value, a: a.value});
      acc[`Stop-${index}`] = `${hsla} at ${stop.properties.position.value}`;
      return acc;
    }, {});

    return {
      Start: `${this.tree.properties.start.properties.x.value}, ${this.tree.properties.start.properties.y.value}`,
      End: `${this.tree.properties.end.properties.x.value}, ${this.tree.properties.end.properties.y.value}`,
      ...stops,
    };
  }

  get gradient () {
    return linearGradientToCss({
      start: Point2D.make(
        this.tree.properties.start.properties.x.value,
        this.tree.properties.start.properties.y.value,
        ),
      end: Point2D.make(
        this.tree.properties.end.properties.x.value,
        this.tree.properties.end.properties.y.value,
      ),
      stops: this.tree.properties.stops.value.map((stop: any) => {
        const {h, s, l, a} = stop.properties.color.properties;
        return GradientStop.make(
          stop.properties.position.value,
          new Color({h: h.value, s: s.value, l: l.value, a: a.value}),
        );
      }),
    });
  }
}
</script>

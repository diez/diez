<template>
  <docs-item :tree="tree" :details="details">
    <template v-slot:preview>
      <div :style="{background: details['Gradient']}"></div>
    </template>
    <template v-slot:extra>
      <div>
      </div>
    </template>
  </docs-item>
</template>

<script lang="ts">
import {DocsTargetSpec} from '@diez/docs';
import {Color, GradientStop, LinearGradientData, Point2D} from '@diez/prefabs';
import {linearGradientToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Linear Gradient Item view
 */
@Component
export default class LinearGradientItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<LinearGradientData>;

  get details () {
    return {
      Gradient: linearGradientToCss({
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
      }),
    };
  }
}
</script>

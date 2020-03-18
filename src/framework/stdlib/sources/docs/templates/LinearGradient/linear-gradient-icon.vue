<template>
  <span :style="style"></span>
</template>

<script lang="ts">
import {DocsTargetSpec} from '@diez/targets';
import {Color, GradientStop, LinearGradientData, Point2D} from '@diez/prefabs';
import {linearGradientToCss} from '@diez/web-sdk-common';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Linear Gradient Icon view.
 */
@Component
export default class ColorIcon extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<LinearGradientData>;

  get style () {
    return {
      background: linearGradientToCss({
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

<style scoped lang="scss">
@import "@diez/styles.scss";

span {
  display: inline-block;
  border-radius: 50%;
  border: 1px solid $palette-primary-border;
}
</style>

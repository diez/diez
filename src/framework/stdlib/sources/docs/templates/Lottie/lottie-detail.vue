<template>
  <docs-detail :tree="tree" :details="details">
    <figure>
      <div ref="example"></div>
    </figure>
  </docs-detail>
</template>

<script lang="ts">
import {DocsTargetSpec} from '@diez/targets';
import {LottieData} from '@diez/prefabs';
import lottieWeb from 'lottie-web';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Lottie Detail view.
 */
@Component
export default class LottieDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<LottieData>;

  mounted () {
    lottieWeb.loadAnimation({
      container: this.$refs.example as Element,
      path: `/${this.tree.properties.file.properties.src.value}`,
      loop: this.tree.properties.loop.value,
      autoplay: this.tree.properties.autoplay.value,
    });
  }

  get details () {
    return {
      Loop: this.tree.properties.loop.value,
      Autoplay: this.tree.properties.autoplay.value,
    };
  }
}
</script>

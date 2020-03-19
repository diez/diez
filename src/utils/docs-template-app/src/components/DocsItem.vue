<template>
  <div
    @mouseenter="showDetails"
    @mouseleave="hideDetails"
    :class="{
      'docs-item': true,
      'docs-item--details-visible': detailsVisible,
      'docs-item--full-width': fullWidth,
    }"
  >
    <router-link :to="tree.id">
      <figure>
        <div class="preview">
          <slot name="preview"></slot>
        </div>
        <figcaption>{{tree.name}}</figcaption>
      </figure>
      <div class="docs-item__details">
        <slot name="docs-item__details"></slot>
        <p v-if="tree.comments.instance" v-html="tree.comments.instance"></p>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;

/**
 * Wrapper for a component's Item view.
 */
@Component
export default class DocsItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;
  @Prop() readonly fullWidth!: boolean;

  private timeout!: NodeJS.Timeout;
  private timeoutDelay = 10;
  protected detailsVisible = false;

  protected showDetails () {
    if (this.fullWidth || this.tree.isPrimitive) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.detailsVisible = true;
    }, this.timeoutDelay);
  }

  protected hideDetails () {
    clearTimeout(this.timeout);
    this.detailsVisible = false;
  }
}
</script>

<style scoped lang="scss">
@import "@diez/styles.scss";

.docs-item {
  position: relative;
  display: inline-block;
  margin-right: $spacings-lg-px;
  margin-bottom: $spacings-xl-px;
  width: $docs-item-size-width-px;
  transition: transform 120ms ease-out;

  &--details-visible {
    z-index: 9;
    text-align: left;
    transform: translateY(-2px);

    .preview {
      position: absolute;
      transition: all 120ms ease-out;
    }

    .docs-item__details {
      width: 100px;
      height: auto;
      opacity: 1;
    }

    figcaption {
      position: relative;
      z-index: 10;
      margin-top: 78px;
    }
  }

  &--full-width {
    width: 100%;
    margin-right: 0;

    .preview {
      width: 100%;
      height: 110px;
    }

    figcaption {
      @include typography-small();
    }
  }
}

.preview {
  @include docs-item-size();
  @include docs-item-panel();

  transition: transform 120ms ease;
  position: relative;
  z-index: 2;
  margin: 0;
  overflow: hidden;
  border: 1px solid $palette-primary-border;

  /deep/ > * {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}

.docs-item__details {
  @include docs-item-details-panel();
  @include typography-small();

  top: -5px;
  width: 100px;
  height: 0;
  left: -5px;
  opacity: 0;
  padding: $docs-item-details-spacing-px;
  padding-top: 100px;
  overflow: hidden;
  position: absolute;
  transition: opacity 120ms ease-out;
  background-color: transparent;
}

a {
  @include typography-small();
  display: inline-block;
  text-decoration: none;
  width: 100%;
}

figure {
  display: inline-block;
  width: 100%;
}

figcaption {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: $spacings-sm-px;
}
</style>

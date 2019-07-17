<template>
  <div class="nav-wrap">
      <router-link class="category" to="/getting-started/diez">Diez</router-link>
      <div>
        <router-link class="sub-link" to="/getting-started/#set-up">Set Up</router-link>
        <router-link class="sub-link" to="/getting-started/the-basics">The Basics</router-link>
        <router-link class="sub-link" to="/getting-started/your-codebase">Diez + Your Codebase</router-link>
      </div>

      <router-link class="category" to="/getting-started/ios">iOS</router-link>
      <div>
        <router-link class="sub-link" to="/getting-started/swift">Swift <span class="secondary">- Getting Started</span></router-link>
        <router-link class="sub-link" to="/getting-started/obj-c">Obj-C <span class="secondary">- Getting Started</span></router-link>
        <router-link class="sub-link" to="/existing-project-integration/ios">iOS <span class="secondary">- Integration</span></router-link>
      </div>

      <router-link class="category" to="/getting-started/android">Android</router-link>
      <div>
        <router-link class="sub-link" to="/getting-started/kotlin">Kotlin <span class="secondary">- Getting Started</span></router-link>
        <router-link class="sub-link" to="/getting-started/java">Java <span class="secondary">- Getting Started</span></router-link>
      </div>

      <router-link class="category" to="/getting-started/web">Web</router-link>
      <div>
        <router-link class="sub-link" to="/getting-started/javascript">JavaScript <span class="secondary">- Getting Started</span></router-link>
        <router-link class="sub-link" to="/existing-project-integration/javascript">JavaScript <span class="secondary">- Integration</span></router-link>
        <router-link class="sub-link" to="/getting-started/css-sass">CSS/Sass <span class="secondary">- Getting Started</span></router-link>
        <router-link class="sub-link" to="/existing-project-integration/css-sass">CSS/Sass <span class="secondary">- Integration</span></router-link>
      </div>

      <router-link class="category" to="/getting-started/design-tools">Design Tools</router-link>
      <div>
        <router-link class="sub-link" to="/getting-started/figma">Figma</router-link>
        <router-link class="sub-link" to="/getting-started/sketch">Sketch</router-link>
        <router-link class="sub-link" to="/getting-started/dsm">InVision DSM</router-link>
      </div>

  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
  @import '@theme/styles/_utils.scss';

  .nav-wrap {
    position: fixed;
    height: 100%;
    top: 0;
    padding: 138px $spacing-xxxl-px 0 0;
    overflow-y: auto;
    overflow-x: hidden;
    a {
      display: block;
      margin-bottom: $spacing-lg-px;
    }
    @include tablet {
      display: none;
    }
  }
  .category {
    margin-bottom: $spacing-sm-px !important;
    margin-top: $spacing-lg-px !important;
    color: $palette-black;
  }
  .sub-link {
    color: $palette-purple;
    font-size: $smallText;
    margin-left: $spacing-lg-px;
    margin-bottom: $spacing-sm-px !important;
    .secondary {
      font-weight: 400;
    }
    &.soon {
      color: $palette-gray700;
      font-style: italic;
      &:hover:after {
        opacity: 1;
      }
      &:after {
        content: "SOON";
        opacity: 0;
        font-size: 10px;
        padding: 0 $spacing-xs-px;
        margin-left:6px;
        transform: translateY(5px);
        position: absolute;
        z-index: 1000;
        color: $palette-white;
        background-color: $palette-mauve;
        border-radius: $border-radius-button-px;
        transition: opacity 130ms ease;
      }
    }
  }
</style>

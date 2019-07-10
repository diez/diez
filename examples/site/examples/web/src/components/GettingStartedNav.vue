<template>
  <div class="nav-wrap">
    <div>
      <router-link to="/getting-started/#set-up">Set Up</router-link>
      <router-link to="/getting-started/the-basics">The Basics</router-link>
      <div>
        <router-link to="/getting-started/#next-steps" class="category">Guides</router-link>
        <div>
          <div class="sub-category">iOS</div>
          <router-link class="sub-link" to="/getting-started/swift">Swift</router-link>
          <router-link class="sub-link soon" title="Guide coming soon" to="#">Objective-C</router-link>
        </div>
        <div>
          <div class="sub-category">Android</div>
          <router-link class="sub-link" to="/getting-started/kotlin">Kotlin</router-link>
          <router-link class="sub-link soon" title="Guide coming soon" to="#">Java</router-link>
        </div>
        <div>
          <div class="sub-category">Web</div>
          <router-link class="sub-link" to="/getting-started/javascript">JavaScript</router-link>
          <router-link class="sub-link soon" title="Guide coming soon" to="#">CSS</router-link>
          <router-link class="sub-link soon" title="Guide coming soon" to="#">Sass</router-link>
        </div>
        <div>
          <div class="sub-category">Design Tools</div>
          <router-link class="sub-link" to="/getting-started/figma">Figma</router-link>
          <router-link class="sub-link soon" title="Guide coming soon" to="#">Adobe XD</router-link>
          <router-link class="sub-link soon" to="#" title="Guide coming soon">Sketch</router-link>
          <router-link class="sub-link soon" title="Guide coming soon" to="#">InVision DSM</router-link>
          <router-link class="sub-link soon" title="Guide coming soon" to="#">Abstract</router-link>
        </div>
      </div>
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
    padding: 153px $spacing-xxxl-px 0 0;
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
    margin-bottom: 0 !important;
  }
  .sub-category {
    @include typography-subcategory();
    margin: $spacing-sm-px 0 $spacing-sm-px $spacing-sm-px;
  }
  .sub-link {
    color: $palette-mauve;
    font-size: $smallText;
    margin-left: $spacing-lg-px;
    margin-bottom: $spacing-sm-px !important;
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

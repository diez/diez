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
          <router-link class="sub-link soon" title="Guide coming soon" to="#">Figma</router-link>
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
    padding: 153px $spacing3XL 0 0;
    overflow-y: auto;
    overflow-x: hidden;
    a {
      display: block;
      margin-bottom: $spacingLG;
    }
    @include tablet {
      display: none;
    }
  }
  .category {
    margin-bottom: 0 !important;
  }
  .sub-category {
    color: $black;
    font-size: $smallText;
    font-weight: 700;
    margin: $spacingSM 0 $spacingSM $spacingSM;
  }
  .sub-link {
    color: $mauve;
    font-size: $smallText;
    margin-left: $spacingLG;
    margin-bottom: $spacingSM !important;
    &.soon {
      color: $gray700;
      font-style: italic;
      &:hover:after {
        opacity: 1;
      }
      &:after {
        content: "SOON";
        opacity: 0;
        font-size: 10px;
        padding: 0 $spacingXS;
        margin-left:6px;
        transform: translateY(5px);
        position: absolute;
        z-index: 1000;
        color: $white;
        background-color: $mauve;
        border-radius: $borderRadiusButton;
        transition: opacity 130ms ease;
      }
    }
  }
</style>

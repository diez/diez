<template>
  <div>
    <NavBar/>
    <div class="page shared">
      <section class="section-split">
        <div class="one-quarter">
          <GettingStartedNav/>
        </div>
        <div class="three-quarters">
          <Content />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import GettingStartedNav from '@theme/components/GettingStartedNav.vue';
import NavBar from '@theme/components/NavBar.vue';

export default {
  components: { NavBar, GettingStartedNav }
};
</script>

<style lang="scss">
  @import '@theme/styles/_utils.scss';

  .shared {
    section {
      margin-top: $sizingXS !important;
      @include tablet {
        margin-top: 0 !important;
      }
    }
    h1, h2 {
      margin-top: 0;
      margin-bottom: 0;
    }
    h3  {
      padding-top: 68px;
      margin-top: 0;
    }
    .block {
      margin-bottom: $spacing3XL;
    }
    .one-quarter {
      position: relative;
      align-self: flex-start;
      height: 100%;
    }
    .nav-wrap {
      position: fixed;
      top: 200;
      a {
        display: block;
        margin-bottom: $spacingLG;
      }
      @include tablet {
        display: none;
      }
    }

    pre {
      border-radius: $borderRadiusCard;
      background-color: $cardColor!important;
      box-shadow: 0 5px 0 $cardShadow, inset 0 2px 0 $cardInsetShadow;
      margin-top: $spacing2XL!important;
    }

    p > code {
      border-radius: $borderRadiusCard;
      background-color: $cardColor;
      padding: 2px 7px;
    }
  }
</style>

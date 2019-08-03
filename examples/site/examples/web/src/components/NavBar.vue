<template>
  <div class="navbar">
    <div @click="toggleMenu" class="menu-icon show-on-mobile">
      <img v-show="isOpen" width="25px" src="../assets/icons/menu.svg" alt="close">
    </div>
    <div class="nav" :class="{'hide' : isOpen}">
      <div class="holster">
        <router-link to="/" class="logo" @click.native="scrollToSelector('body')">
          Diez
          <img width="34" src="../assets/imgs/logo.svg"/>
        </router-link>
        <div class="holster-right">
          <router-link to="/getting-started">Guides</router-link>
          <router-link to="/docs">Docs</router-link>
          <router-link to="/glossary">Glossary</router-link>
          <router-link to="/faq">FAQ</router-link>
          <router-link to="http://twitter.com/dieznative" class="show-on-mobile">Twitter</router-link>
          <a href="https://medium.com/dieznative" target="_blank">Blog</a>
          <a href="https://spectrum.chat/diez" class="show-on-mobile">Spectrum</a>
          <a href="https://github.com/diez/diez">Github</a>
          <div @click="toggleMenu" class="menu-icon show-on-mobile">
            <img v-show="!isOpen" width="25px" src="../assets/icons/close.svg" alt="close">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isOpen: true
    };
  },

  methods: {
    scrollToSelector (selector) {
      const el = typeof window !== 'undefined' && window.document.querySelector(selector);
      if (el) {
        window.scrollTo({
          top: el.offsetTop
        });
      }
    },

    toggleMenu () {
      this.$data.isOpen = !this.$data.isOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '@theme/styles/_utils.scss';
  $mobile-toggle-height: 25px;
  $mobile-toggle-margin: 20px;
  .navbar {
    @include nav();
    @include tablet {
      position: fixed;
      width: 100%;
      z-index: 999;
      top: 0;
      padding-top: 2 * $mobile-toggle-margin + $mobile-toggle-height;
      background-color: $palette-white;
      border-bottom: 1px solid $palette-gray700;
    }
  }
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: $palette-white;
    z-index: 1000;
    border-bottom: 1px solid $palette-gray700;
    @include tablet {
      background-color: $palette-purple;
      color: $palette-white;
      bottom: 0;
    }
  }
  .hide {
     @include hide-mobile;
  }
  .holster {
    max-width: $page-width;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md-px 60px;
    @include tablet {
      flex-direction: column;
      height: 100%;
    }
  }
  .logo {
    @include typography-logo();
    display: flex;
    padding-left: 0 !important;
    align-items: center;
    @include tablet {
      display: none;
    }
  }
  a {
    @include link();
  }
  a:not(.button) {
    padding: 0 $spacing-lg-px;
    color: $palette-black;
    @include tablet {
      color: $palette-white;
      font-size: 26px;
    }
  }
  .button {
    @include button();
    margin-left: $spacing-lg-px;
  }
  .show-on-mobile {
    display: none;
    @include tablet {
      display: inline-block;
    }
  }
  .hide-on-mobile {
    @include tablet {
      display: none;
    }
  }
  .logo img {
    margin-left: 10px;
    margin-top: 1px;
  }
  .holster-right {
    display: flex;
    align-items: center;
    @include tablet {
      flex-direction: column;
      height: 100%;
      justify-content: space-evenly;
    }
    img {
      transform: translateY(3px);
    }
  }
  .menu-icon {
    position: fixed;
    top: $mobile-toggle-margin;
    right: $mobile-toggle-margin;
    cursor: pointer;
  }
</style>

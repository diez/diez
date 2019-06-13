<template>
  <div class="navbar">
    <div @click="toggleMenu" class="menu-icon show-on-mobile">
      <img v-show="isOpen" width="25px" src="@/assets/icons/menu.svg" alt="close">
    </div>
    <div class="nav" :class="{'hide' : isOpen}">
      <div class="holster">
        <NuxtLink to="/" class="logo" @click.native="scrollToSelector('body')">
          Diez
          <img width="34" src="@/assets/imgs/logo.svg"/>
        </NuxtLink>
        <div class="holster-right">
          <a href="https://github.com/diez/diez">Github</a>
          <NuxtLink to="/docs">Docs</NuxtLink>
          <NuxtLink to="/faq">FAQ</NuxtLink>
          <NuxtLink to="/glossary">Glossary</NuxtLink>
          <a href="https://spectrum.chat/diez">Spectrum</a>
          <NuxtLink to="/getting-started" class="button hide-on-mobile">Get Started</NuxtLink>
          <NuxtLink to="https://diez.substack.com/subscribe" class="show-on-mobile">Mailing List</NuxtLink>
          <NuxtLink to="http://twitter.com/dieznative" class="show-on-mobile">Twitter</NuxtLink>
          <NuxtLink to="/getting-started" class="show-on-mobile">Get Started</NuxtLink>
          <div @click="toggleMenu" class="menu-icon show-on-mobile">
            <img v-show="!isOpen" width="25px" src="@/assets/icons/close.svg" alt="close">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';
@Component
export default class NavBar extends Vue {
  private isOpen = true;
  scrollToSelector (selector: string) {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      window.scrollTo({
        top: el.offsetTop,
      });
    }
  }
  toggleMenu () {
    this.isOpen = !this.isOpen;
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_utils.scss';
  $mobile-toggle-height: 25px;
  $mobile-toggle-margin: 20px;
  .navbar {
    @include navfont();
    @include tablet {
      position: fixed;
      width: 100%;
      z-index: 999;
      padding-top: 2 * $mobile-toggle-margin + $mobile-toggle-height;
      background-color: $white;
      border-bottom: 1px solid $gray700;
    }
  }
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: $white;
    z-index: 1000;
    border-bottom: 1px solid $gray700;
    @include tablet {
      background-color: $purple;
      color: $white;
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
    padding: $spacingMD 60px;
    @include tablet {
      flex-direction: column;
      height: 100%;
    }
  }
  .logo {
    @include font-family ($source-code-pro);
    font-weight: 900;
    font-size: 30px;
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
    padding: 0 $spacingLG;
    color: $black;
    @include tablet {
      color: $white;
      font-size: 26px;
    }
  }
  .button {
    @include button();
    margin-left: $spacingLG;
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
  img {
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
  }
  .menu-icon {
    position: fixed;
    top: $mobile-toggle-margin;
    right: $mobile-toggle-margin;
    cursor: pointer;
  }
</style>

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
          <a href="https://design-code.typeform.com/to/Mc5oIq" class="show-on-mobile">Get Early Access</a>
          <a target="_blank" class="hide-on-mobile link-img" title="slack" href="https://join.slack.com/t/dieznative/shared_invite/enQtNzEzNzM2OTg4NDA1LTA4NWZiMTNlZTgzNTY3Yzg2ODdjY2Y1MzBjMjdlY2FlNjljMmI3ZTgzMmQ4ODk1MDdlMTcyMTUzMjNmZWI4YjU">
            <img src="@/assets/imgs/slack-alt.svg" alt="slack">
          </a>
          <a target="_blank" class="hide-on-mobile link-img" title="spectrum" href="https://spectrum.chat/diez">
            <img src="@/assets/imgs/spectrum-alt.svg" alt="spectrum">
          </a>
          <a target="_blank" class="hide-on-mobile link-img" title="twitter" href="https://twitter.com/dieznative">
            <img src="@/assets/imgs/twitter-alt.svg" alt="twitter">
          </a>
          <a target="_blank" class="show-on-mobile" href="https://join.slack.com/t/dieznative/shared_invite/enQtNzEzNzM2OTg4NDA1LTA4NWZiMTNlZTgzNTY3Yzg2ODdjY2Y1MzBjMjdlY2FlNjljMmI3ZTgzMmQ4ODk1MDdlMTcyMTUzMjNmZWI4YjU">Slack</a>
          <a target="_blank" class="show-on-mobile" href="https://spectrum.chat/diez">Spectrum</a>
          <a target="_blank" class="show-on-mobile" href="https://twitter.com/dieznative">Twitter</a>
          <a target="_blank" href="https://design-code.typeform.com/to/Mc5oIq"  class="button hide-on-mobile">Get Early Access</a>
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
    padding-left: 0;
    align-items: center;
    @include tablet {
      display: none;
    }
  }
  a {
    @include link();
    &.link-img {
      padding: 0 $spacingXS;
      img {
        height: 20px;
        margin-top: $spacingXS;
        margin-left: 0;
      }
    }
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

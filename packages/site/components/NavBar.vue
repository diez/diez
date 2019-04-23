<template>
  <div>
    <div @click="toggleMenu" class="menu-icon show-on-mobile">
      <img v-show="isOpen" width="25px" src="@/assets/icons/menu.svg" alt="close">
    </div>
    <div class="nav" :class="{'hide' : isOpen}">
      <div class="holster">
        <a href="/" class="logo">
          Diez
          <img width="34" src="@/assets/imgs/logo.svg"/>
        </a>
        <div class="holster-right">
          <a href="https://github.com/diez/diez">Github</a>
          <a href="/docs">Docs</a>
          <a href="https://spectrum.chat/diez">Spectrum</a>
          <a href="/getting-started" class="button hide-on-mobile">Get Started</a>
          <a href="https://diez.substack.com/subscribe" class="show-on-mobile">Mailing List</a>
          <a href="http://twitter.com/dieznative" class="show-on-mobile">Twitter</a>
          <a href="/getting-started" class="show-on-mobile">Get Started</a>
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

@Component({
  components: {},
})
export default class NavBar extends Vue {
  private isOpen = true;

  toggleMenu () {
    this.isOpen = !this.isOpen;
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_layout.scss';

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
    @include tablet {    
      display: none;
    }
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
    font-family: 'Source Code Pro', monospace;
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
    padding: 0 30px;
    color: $black;
    @include tablet {    
      color: $white;
      font-size: 30px;
    }
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
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
</style>

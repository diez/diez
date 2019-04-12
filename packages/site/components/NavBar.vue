<template>
  <div class="nav">
    <div class="holster">
      <div class="logo">
        Diez
        <img width="34" src="../assets/imgs/logo.svg"/>
      </div>
      <div>
        <a href="#">Github</a>
        <a href="#">Docs</a>
        <a href="#">Spectrum</a>
        <a class="button">Get Started</a>
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
    background: $white;
  }

  .holster {
    width: $page-width;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
  }

  .logo {
    font-family: 'Source Code Pro', monospace;
    font-weight: 900;
    font-size: 30px;
    display: flex;
    align-items: center;
  }

  a {
    padding: 0 30px;
    color: $black;
  }

  img {
    margin-left: 10px;
  }
</style>

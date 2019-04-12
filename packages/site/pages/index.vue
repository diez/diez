<template>
  <div class="page">
    <NavBar></NavBar>
    <div class="hero section-narrow">
      <h1>Keep your design system in sync with your code</h1>
      <h3>Diez is the design system compiler — for developers creating custom workflows around design systems</h3>
      <div class="cta-holster">
        <span class="muted">License: MIT</span>
        <a href="#">GitHub</a>
        <a href="#">Docs</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';
import NavBar from '@/components/NavBar.vue';

@Component({
  components: {NavBar},
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_layout.scss';

  .hero {
    height: 80vh;
    max-height: 1200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
  }

  h1 {
    margin-bottom: 0;
  }

  .cta-holster {
    margin-top: $spacingXS;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: $sizingMD;
  }
</style>

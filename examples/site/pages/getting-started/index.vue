<template>
  <div>
    <NavBar/>
    <div class="page">
      <section class="section-split">
        <div class="one-quarter">
          <GettingStartedNav/>
        </div>
        <div class="three-quarters">
          <h2 id="why">Getting Started</h2>
          <h3>Introduction</h3>
          <p>Diez aims to make it easy for you to adopt a unified design language across codebases, platforms, and teams. It is intended to be used as <i>the</i> source of truth for your design system.</p>
          <p>While we're in beta, there might be some rough edges. With that said we think you have a good shot at getting your first Diez (DS) set up and powering your targets in 5 minutes!</p>
          <h3 id="installation">Installation</h3>
          <div class="block">
            <h4>Install the Diez CLI & create a new Diez</h4>
            <div class="code-block">
              <pre><code>npx diez create my-ds-name</code></pre>
            </div>
            <p class="note">Alternatively <code class="inline">npm install -g && diez create my-ds-name</code></p>
          </div>
          <div class="block">
            <h4>Change directories into your Diez folder</h4>
            <div class="code-block">
              <pre><code>cd my-ds-name</code></pre>
            </div>
          </div>
          <div class="block">
            <h4>Serve the HMR production build locally</h4>
            <div class="code-block">
              <pre><code>yarn start-ios</code></pre>
            </div>
            <p class="note">Alternatively <code class="inline">yarn start-android</code> or <code class="inline">yarn start-web</code></p>
          </div>
          <h3 id="guides">Guides</h3>
            <p>There are a handful of guides available in the side menu. We're working hard to generate a complete set of guides. Check back soon. In the meantime, please don't hesistate to <a href="https://spectrum.chat/diez">reach out for help</a> on a particular topic.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import GettingStartedNav from '@/components/GettingStartedNav.vue';
import NavBar from '@/components/NavBar.vue';
import {Component, Vue} from 'nuxt-property-decorator';
@Component({
  components: {NavBar, GettingStartedNav},
})
export default class GettingStarted extends Vue {
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_utils.scss';
  @import '@/assets/styles/_shared.scss';

  section {
    margin-top: $sizingXS !important;
    @include tablet {
      margin-top: 0 !important;
    }
  }
  h2 {
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
</style>
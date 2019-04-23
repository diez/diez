<template>
  <div>
    <NavBar></NavBar>
    <div class="page">
      <section class="section-split">
        <div class="one-quarter">
          <div class="nav-wrap">
            <a href="#why">Why Diez</a>
            <a href="#installation">Installation</a>
            <a href="#usage">Usage</a>
            <a href="/docs">Docs</a>
          </div>
        </div>
        <div class="three-quarters">
          <h2 id="why">Getting Started</h2>
          <h3>Why should you use Diez</h3>
          <p>Diez enables you to sync your design system across codebases of varying platforms. It is intended to be used as the source of truth and enable reuse of your brand's design tokens and assets.</p>
          <p>This can be helpful for even a sole developer, but it really begins to shine in team settings. Update an asset in your Diez Design System (DS), and it will propogate into all connected codebases.</p>
          <h3 id="installation">Installation</h3>
          <div class="block">
            <h4>Install the Diez CLI & create a new Diez (DS)</h4>
            <div class="code-block">
              <pre v-highlightjs><code>npx diez create my-ds-name</code></pre>
            </div>
            <p class="note">Alternatively <code class="inline">npm install -g && diez create my-ds-name</code></p>
          </div>
          <div class="block">
            <h4>Change directories into your Diez (DS) folder</h4>
            <div class="code-block">
              <pre v-highlightjs><code>cd my-ds-name</code></pre>
            </div>
          </div>
          <div class="block">
            <h4>Serve the HMR production build locally</h4>
            <div class="code-block">
              <pre v-highlightjs><code>yarn start-ios</code></pre>
            </div>
            <p class="note">Alternatively <code class="inline">yarn start-android</code> or <code class="inline">yarn start-web</code></p>
          </div>
          <h3 id="usage">Usage</h3>
          <p>Details on how to connect your Diez (DS) to your codebases are provided as code comments on your instance. Guides are also available in the docs:</p>
          <ul>
            <li><a href="/docs/classes/targets.ioscompiler.html">Connecting to an iOS codebase</a></li>
            <li><a href="/docs/classes/targets.androidcompiler.html">Connecting to a Android codebase</a></li>
            <li><a href="/docs/classes/targets.webcompiler.html">Connecting to a Web codebase</a></li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';
import NavBar from '@/components/NavBar.vue';

@Component({
  components: {NavBar},
})
export default class GettingStarted extends Vue {

}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_layout.scss';

  section {
    margin-top: $sizingXS !important;
    @include tablet {
      margin-top: 0 !important;
    }
  }

  h2 {
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

</style>

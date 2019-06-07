<template>
  <div>
    <NavBar/>
    <div class="page">
      <section class="section-split">
        <div class="one-quarter">
          <GettingStartedNav/>
        </div>
        <div class="three-quarters">
          <h2 id="why">JavaScript Guide</h2>
          <h3>Introduction</h3>
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
          <h3 id="guides">Platform Guides</h3>
          <p>Details on how to connect your Diez to your codebases are provided as code comments on your instance. Guides are also available in the docs:</p>
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
import GettingStartedNav from '@/components/GettingStartedNav.vue';
import NavBar from '@/components/NavBar.vue';
import {Component, Vue} from 'nuxt-property-decorator';
@Component({
  components: {NavBar, GettingStartedNav},
})
export default class WebGuide extends Vue {
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
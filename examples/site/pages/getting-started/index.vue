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
          <div class="aside">
            <h4>🚨 Early Beta Warning 🚨</h4>
            <p>Although we’re in early beta, we think you can get your first Diez project set up and powering an application codebase in 5 minutes!</p>
            <p>Please keep in mind that Diez is under active development. And there are a few notable pieces of functionality that will be dropping into the repo soon including:</p>
            <ul>
              <li>CSS & Sass support</li>
              <li>Wider Sketch support (currently only image syncing)</li>
              <li>More guides and demos</li>
            </ul>
          </div>
          <h3>Introduction</h3>
          <p>Diez aims to make it easy for you to adopt a unified design language across codebases, platforms, and teams. It is intended to be used as <i>the</i> source of truth for your design system.</p>
          <p>Be sure to visit <NuxtLink to="/getting-started/the-basics">the basics</NuxtLink> guide for more information on how to get up and running.</p>
          <h3 id="installation">Installation</h3>
          <div class="block">
            <h4>Install the Diez CLI & create a new Diez project</h4>
            <div class="code-block">
              <pre><code>npx diez create my-ds-name</code></pre>
            </div>
            <p class="note">Alternatively <code class="inline">npm install -g && diez create my-ds-name</code></p>
          </div>
          <div class="block">
            <h4>Change directories into your Diez project folder</h4>
            <div class="code-block">
              <pre><code>cd my-ds-name</code></pre>
            </div>
          </div>
          <div class="block">
            <h4>Serve the <NuxtLink to="/glossary#hot-mode">hot</NuxtLink> production build locally</h4>
            <div class="code-block">
              <pre><code>yarn start-web</code></pre>
            </div>
            <p class="note">Alternatively <code class="inline">yarn start-ios</code> or <code class="inline">yarn start-android</code></p>
          </div>
          <h3 id="guides">Guides</h3>
            <p>There are a handful of guides available in the side menu. We're working hard to generate a complete set of guides. Check back soon. In the meantime, please don't hesitate to <a href="https://spectrum.chat/diez">reach out for help</a> on a particular topic.</p>
            <div class="holster-tri-card">
            <NuxtLink class="card third" to="/getting-started/the-basics">
              <img src="@/assets/imgs/logo.svg" alt="Swift"><span>Diez Basics</span>
            </NuxtLink>
            <NuxtLink class="card third" to="/getting-started/swift">
              <img src="@/assets/imgs/swift.svg" alt="Swift"><span>Swift Guide</span>
            </NuxtLink>
            <NuxtLink class="card third" to="/getting-started/kotlin">
              <img src="@/assets/imgs/kotlin.svg" alt="Kotlin"><span>Kotlin Guide</span>
            </NuxtLink>
            <NuxtLink class="card third" to="/getting-started/javascript">
              <img src="@/assets/imgs/javascript.svg" alt="JavaScript"><span>JavaScript Guide</span>
            </NuxtLink>
            <NuxtLink class="card third" to="/getting-started/figma">
              <img src="@/assets/imgs/figma.svg" alt="ObjectiveC"><span>Figma Guide</span>
            </NuxtLink>
          </div>
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
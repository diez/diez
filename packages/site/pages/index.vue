<template>
  <div>
    <div class="page">
      <NavBar></NavBar>
      <section class="hero section-narrow">
        <h1>Keep your design system in sync with your code</h1>
        <h3>Diez is the design system compiler — for developers creating custom workflows around design systems</h3>
        <div class="cta-holster">
          <span class="muted">License: MIT</span>
          <a href="https://github.com/diez/diez">GitHub</a>
          <a href="/docs">Docs</a>
        </div>
      </section>

      <section id="demo" class="section-split">
        <div class="one-third mobile-reorder">
          <p>Diez can be the source of truth to unify your design tokens, assets, across all of your platforms.</p>
          <p>The beauty of this system is seeing your updates propagate through all of your applications. This power is underscored by Diez's built-in live reloading.</p>
          <a class="button button-following-text">View Example Apps</a>
        </div>
        <div class="two-thirds">
          <div class="video-holster">
            <iframe class="video" src="https://www.youtube.com/embed/Y5ckCAUVOn0?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <section id="how-it-looks" class="section-split">
        <div class="half">
          <h2>Your design system’s source of truth</h2>
          <span class="small-text-indented">(In TypeScript)</span>
          <div class="card-code">
            <pre>
              <code class="typescript"></code>
            </pre>
          </div>
        </div>
        <div class="half staggered">
          <h2>Example usage in production</h2>
          <div>
            <span
              @click="updateExample('swift')"
              class="tab-links"
              :class="{'active' : activeExample === 'swift'}">Swift
            </span>
            <span
              @click="updateExample('kotlin')"
              class="tab-links"
              :class="{'active' : activeExample === 'kotlin'}">Kotlin
            </span>
            <span
              @click="updateExample('javascript')"
              class="tab-links"
              :class="{'active' : activeExample === 'javascript'}">JavaScript
            </span>
          </div>
          <div class="card-code">
            <pre><TemplatedCode :template="activeExample"></TemplatedCode></pre>
          </div>
        </div>
      </section>

      <section id="cross-platform" class="section-split">
        <div class="half">
          <h2>Compiles cross-platform</h2>
          <p>Sometime in 2018 many of us began to wonder what's the point of a company-wide design system if it doesn’t actually power your applications. That's why we design Diez to work on the major platforms.</p>
          <p>Diez has been created with platform interop in mind from the beginning. Additional ergonomic adapters for web will be coming soon (Vue, React, Angular 2.0).</p>
        </div>
        <div class="half">
          <div class="holster-tri-card">
            <div class="card third"><img src="@/assets/imgs/swift.svg" alt="Swift">Swift</div>
            <div class="card third"><img src="@/assets/imgs/kotlin.svg" alt="Kotlin">Kotlin</div>
            <div class="card third"><img src="@/assets/imgs/javascript.svg" alt="JavaScript">JavaScript</div>
            <div class="card third"><img src="@/assets/imgs/objc.svg" alt="Objective-C">Objective-C</div>
            <div class="card third"><img src="@/assets/imgs/java.svg" alt="Java">Java</div>
            <a href="/docs/extensible" class="card third extensible"><img src="@/assets/icons/plus.svg" alt="Extensible">Extensible</a>
          </div>
        </div>
      </section>

      <section id="extensiblity" class="section-split">
        <div class="half mobile-reorder">
          <div class="holster-tri-card">
            <div class="card third mono"><img src="@/assets/icons/color.svg" alt="Color">
              <span class="muted">&lt;</span>Color<span class="muted">/&gt;</span></div>
            <div class="card third mono"><img src="@/assets/icons/palette.svg" alt="Palette">
              <span class="muted">&lt;</span>Palette<span class="muted">/&gt;</span></div>
            <div class="card third mono"><img src="@/assets/icons/panel.svg" alt="Panel">
              <span class="muted">&lt;</span>Panel<span class="muted">/&gt;</span></div>
            <div class="card third mono"><img src="@/assets/icons/number.svg" alt="Number">
              <span class="muted">&lt;</span>Number<span class="muted">/&gt;</span></div>
            <div class="card third mono"><img src="@/assets/icons/font.svg" alt="Font">
              <span class="muted">&lt;</span>Font<span class="muted">/&gt;</span></div>
            <div class="card third mono"><img src="@/assets/icons/text-style.svg" alt="TextStyle">
              <span class="muted">&lt;</span>TextStyle<span class="muted">/&gt;</span></div>
            <div class="card third mono"><img src="@/assets/icons/image.svg" alt="Image">
              <span class="muted">&lt;</span>Image<span class="muted">/&gt;</span></div>
            <div class="card third mono"><img src="@/assets/icons/animation.svg" alt="Animation">
              <span class="muted">&lt;</span>Animation<span class="muted">/&gt;</span></div>
            <a href="/docs/extensible" class="card third mono extensible"><img src="@/assets/icons/plus.svg" alt="Extensible">Extensible</a>
          </div>
        </div>
        <div class="half">
          <h2>Designed for extensibility</h2>
          <p><strong>Diez is open source</strong> and able to be extended as you see fit. <strong>Diez ships with a small collection of prefabs</strong> which are building block components that have multiple-definitions, which enable to you to definite your design system’s components and then compile across platforms.</p>
          <p>For example, when you declare a <code class="inline">Color</code> in your TypeScript source and then run <code class="inline">diez compile</code>, our compiler runs through the component tree and draws out iOS definitions for the iOS build, the Kotlin definitions for the Android build, etc. </p>
        </div>
      </section>

      <section id="roadmap">
        <img width="100%" src="@/assets/imgs/temp_roadmap.jpg" alt="roadmap">
        <h2 class="ivan">Diez's future</h2>
        <div class="section-narrow center">
          <p>Diez's ambition curently outweighs its utility by an honest margin. While we're excited to demonstrate its novelty and power, we're also hoping you'll help us guide it forward.</p>
          <a class="button button-following-text">Visit Roadmap</a>
          <!-- <ul>
            <p>Its principles:</p>
            <li>Remain open: No walled gardens</li>
            <li>Remain unopinionated</li>
            <li>Prioritize pristine developer experience</li>
          </ul> -->
        </div>
      </section>
    </div>
    <footer id="footer">
      <h2>Stay Connected</h2>
      <a href="https://spectrum.chat/diez" target="_blank" class="button alt">Spectrum</a>
      <a href="https://diez.substack.com/subscribe" target="_blank" class="button alt">Mailing List</a>
      <a href="https://twitter.com/dieznative" target="_blank" class="button alt">Twitter</a>
    </footer>
  </div>
</template>

<script lang="ts">
import {Examples} from '@/assets/examples';
import NavBar from '@/components/NavBar.vue';
import TemplatedCode from '@/components/TemplatedCode.vue';
import {Component, Vue} from 'nuxt-property-decorator';

@Component({
  components: {NavBar, TemplatedCode},
})
export default class extends Vue {
  private examples = Examples;
  private activeExample = 'swift';

  updateExample (newExample: string) {
    this.activeExample = newExample;
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_layout.scss';

  .hero {
    height: 75vh;
    max-height: 1200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    margin: 0 auto;
    @include phone {
      height: auto;
      max-height: auto;
      margin-bottom: $spacing3XL;
    }
  }

  h1 {
    margin-bottom: 0;
  }

  #roadmap img {
    display: none;
  }

  .cta-holster {
    margin-top: $spacingXS;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: $sizingMD;
  }

  .video-holster {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
  }

  .video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

</style>

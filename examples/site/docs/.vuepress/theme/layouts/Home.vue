<template>
  <div>
    <div class="page shared">
      <NavBar></NavBar>
      <section class="hero section-narrow">
        <h1>The cross-platform design system framework</h1>
        <h3>Diez makes it easy to adopt a unified design language across codebases, platforms, and teams.</h3>
      </section>

      <section class="section-narrow" style="margin-top:0;">
        <div class="aside" style="margin-top:0;">
          <H2>Welcome to Diez Early Access! 😎</H2>
          <p>We're still sanding and varnishing and sweeping the broom around here, but Diez is already fine-tuned in many ways and we're excited to get it into your hands.</p>
          <p>First things first, we want to say <strong>thank you so much</strong> for taking part in this before we release open-source. We're fairly certain you'll be excited when you experience its power, but we want to dillgently carve out this short period to learn from you and your experience with Diez and design systems in general.</p>
          <p>What should a cross-platform design system be? We're hoping you can help us with this answer. Please don't hesitate to reach out — we're all ears. If you'd like to schedule some time for a one-on-one we're on standby for that too.</p>
          <div style="text-align:center;padding:12px 0 24px;"><a class="button" to="/getting-started">Get Started</a></div>
        </div>
      </section>

      <section id="demo" class="section">
        <div class="video-holster card">
          <iframe class="video" src="https://www.youtube.com/embed/5u9tW0x-5FA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </section>

      <section id="cross-platform" class="section-split">
        <div class="half align-top">
          <h2>Design Token Components</h2>
          <p>Use TypeScript to compose <a target="_blank" href="https://www.lightningdesignsystem.com/design-tokens/">design tokens</a> into deeply customizable, reusable, and developer-friendly Design Token Components.</p>
          <p>Design Token Components enable a "write once, use anywhere" paradigm for your design language, across codebases.</p>
        </div>
        <div class="half">
          <div class="holster-tri-card">
            <div class="card third mono"><img src="@theme/assets/icons/color.svg" alt="Color">Color</div>
            <div class="card third mono"><img src="@theme/assets/icons/number.svg" alt="Number">Number</div>
            <div class="card third mono"><img src="@theme/assets/icons/font.svg" alt="Font">Font</div>
            <div class="card third mono"><img src="@theme/assets/icons/typograph.svg" alt="Text Style">Text Style</div>
            <div class="card third mono"><img src="@theme/assets/icons/image.svg" alt="Image">Image</div>
            <div class="card third mono"><img src="@theme/assets/icons/animation.svg" alt="Animation">Animation</div>
          </div>
        </div>
      </section>

      <section id="compiler" class="section-split">
        <div class="half mobile-reorder">
          <img src="@theme/assets/imgs/handle.svg" class="handle-it" alt="handle">
          <div class="card half">
            <img src="@theme/assets/imgs/logo.svg" alt="diez compiler">
            Diez Compiler
          </div>
          <img src="@theme/assets/imgs/outputs.svg" class="output-it" alt="output-arms">
          <div class="holster-tri-card">
            <div class="card fourth"><img src="@theme/assets/imgs/swift.svg" alt="Swift"><span>Swift</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/kotlin.svg" alt="Kotlin"><span>Kotlin</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/javascript.svg" alt="JavaScript"><span>JavaScript</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/objc.svg" alt="ObjectiveC"><span>Objective-C</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/java.svg" alt="Java"><span>Java</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/typescript.svg" alt="TypeScript"><span>TypeScript</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/sass.svg" alt="Sass"><span>Sass</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/storybook.svg" alt="Storybook"><span>Storybook</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/vue.svg" alt="Vue"><span>Vue</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/react.svg" alt="React"><span>React</span></div>
            <div class="card fourth"><img src="@theme/assets/imgs/angular.svg" alt="Angular"><span>Angular</span></div>

            <div class="card fourth extensible"><img src="@theme/assets/icons/plus.svg" alt="Extensible"><span>Extensible</span></div>
          </div>
        </div>
        <div class="half align-top">
          <h2>Cross-Platform Native Compiler</h2>
          <p>More precisely a <i>transpiler</i>: Diez builds your TypeScript component definitions into pure native SDKs for iOS, Android, and the Web — complete with type definitions and autocomplete.</p>
          <p><strong>Diez works with your codebase(s):</strong>  Diez carries zero opinions about rendering, requires no runtime or VMs, and is designed for progressive adoption.</p>
        </div>
      </section>

      <section id="extractors" class="section-split">
        <div class="half align-top">
          <h2>Design File Extractors</h2>
          <p>Diez includes command-line tools for extracting normalized, strongly typed styles and images from many modern design tools.</p>
        </div>
        <div class="half mobile-reorder">
          <div class="holster-tri-card">
            <img width="100%" height="100%" src="@theme/assets/imgs/design-tool-extractors-1x.png" alt="Design File Extractors: Sketch, Figma, InVision DSM">
          </div>
        </div>
      </section>

      <section id="hot-mode" class="section-split">
        <div class="half mobile-reorder">
          <div class="video-holster card">
            <video autoplay loop muted class="video" >
              <source src="@theme/assets/imgs/hot.mp4" type="video/mp4">
            </video>
          </div>
        </div>
        <div class="half align-top">
          <h2>Hot Updates</h2>
          <p>The Diez compiler ships with a <code class="inline">hot</code> mode, which allows for hot updates at development time — even inside native iOS and Android apps.</p>
        </div>
      </section>

      <section id="doc-gen" class="section-split">
        <div class="half align-top">
          <h2>Documentation Generator (coming soon)</h2>
          <p>From code comments and static analysis, Diez can automatically build customizable, ready-to-deploy documentation for your design system. This is not yet available as part of Early Access, but it will be shipping soon!</p>
        </div>
        <div class="half mobile-reorder">
          <div class="holster-tri-card">
            <img width="100%" height="100%" class="card img-outline" src="@theme/assets/imgs/docz.jpg" alt="docs">
          </div>
        </div>
      </section>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '@theme/components/Footer.vue';
import NavBar from '@theme/components/NavBar.vue';

export default {
  components: {
    Footer,
    NavBar
  }
};
</script>

<style lang="scss" scoped>
  @import '@theme/styles/_utils.scss';

  .hero {
    height: 40vh;
    min-height: 400px;
    max-height: 1200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    margin: $spacing3XL auto 0;
    @include phone {
      height: auto;
      max-height: auto;
      margin-bottom: $spacing3XL;
    }
  }

  h1 {
    margin-bottom: 0;
    span {
      font-size: 2.5em;
      font-family: 'source code pro', monospace;
      font-weight: 700;
      line-height: 1.4;
      @include tablet {
        font-size: 2em;
      }
      @include phone {
        font-size: 1.5em;
        display: block;
        margin: $spacing2XL auto 0;
      }
    }
    img {
      width: 2.35em;
      transform: translateY(14px);
      margin-left: 0.425em;
      @include phone {
        margin: 0 auto $spacing2XL;
      }
    }
  }

  .cta {
    font-family: 'Source Sans Pro', sans-serif;
    background-color: $purple;
    color: $white;
    text-align: center;
    @include phone {
      flex-direction: column;
      a.button {
        margin-top: $spacingLG !important;
      }
    }
  }

  .cta {
    margin-top: $spacing3XL;
    padding: $spacing3XL $spacing3XL $spacing2XL;
  }

  .handle-it {
    $handle-height: 83px;
    margin: -$handle-height auto 0;
    display: block;
    width: 70px;
    z-index: -1;
    @include tablet {
      margin-top: $handle-height / 2;
    }
  }

  .output-it {
    display: block;
    margin: 0 auto;
    width: 210px;
    z-index: -1;
  }

  .card.half {
    position: relative;
    width: 35%;
    overflow: visible;
    margin: 0 auto;
    img {
      margin: 30px 30px 10px;
    }
    font-weight: 700;
    text-align: center;
    padding-bottom: 30px;
  }

  .img-outline {
    border: 1px solid $gray400;
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

  .bottom-spacer {
    margin-bottom: $sizingXS;
  }
</style>

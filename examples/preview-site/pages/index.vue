<template>
  <div>
    <div class="page">
      <NavBar></NavBar>
      <section class="hero section-narrow">
        <h1>
          <div class="top-text">
            <span>Diez</span>
            <img width="34" src="@/assets/imgs/logo.svg"/>
          </div>
          Cross-Platform<br>Design System Framework
        </h1>
        <h3>Diez makes it easy to adopt a unified design language across codebases, platforms, and teams.</h3>
      </section>

      <section id="demo" class="section-split">
        <div class="two-thirds">
          <div class="video-holster card">
            <iframe class="video" src="https://www.youtube.com/embed/5u9tW0x-5FA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
        <div class="one-third mobile-reorder align-top">
          <p>Diez is open-sourcing soon!</p>
          <p>Today Diez is available in Early Access, and we're personally onboarding teams to the GitHub repo and documentation.</p>
          <p><strong>To join Early Access</strong>, please fill out this quick form and we'll be in touch.</p>
          <div class="center-mobile-only"><a class="button" target="_blank" href="https://design-code.typeform.com/to/Mc5oIq">Early Access</a></div>
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
            <div class="card third mono"><img src="@/assets/icons/color.svg" alt="Color">Color</div>
            <div class="card third mono"><img src="@/assets/icons/number.svg" alt="Number">Number</div>
            <div class="card third mono"><img src="@/assets/icons/font.svg" alt="Font">Font</div>
            <div class="card third mono"><img src="@/assets/icons/typograph.svg" alt="Text Style">Text Style</div>
            <div class="card third mono"><img src="@/assets/icons/image.svg" alt="Image">Image</div>
            <div class="card third mono"><img src="@/assets/icons/animation.svg" alt="Animation">Animation</div>
          </div>
        </div>
      </section>

      <section id="extensiblity" class="section-split">
        <div class="half mobile-reorder">
          <img src="@/assets/imgs/handle.svg" class="handle-it" alt="handle">
          <div class="card half">
            <img src="@/assets/imgs/logo.svg" alt="diez compiler">
            Diez Compiler
          </div>
          <img src="@/assets/imgs/outputs.svg" class="output-it" alt="output-arms">
          <div class="holster-tri-card">
            <div class="card fourth"><img src="@/assets/imgs/swift.svg" alt="Swift"><span>Swift</span></div>
            <div class="card fourth"><img src="@/assets/imgs/kotlin.svg" alt="Kotlin"><span>Kotlin</span></div>
            <div class="card fourth"><img src="@/assets/imgs/javascript.svg" alt="JavaScript"><span>JavaScript</span></div>
            <div class="card fourth"><img src="@/assets/imgs/objc.svg" alt="ObjectiveC"><span>Objective-C</span></div>
            <div class="card fourth"><img src="@/assets/imgs/java.svg" alt="Java"><span>Java</span></div>
            <div class="card fourth"><img src="@/assets/imgs/typescript.svg" alt="TypeScript"><span>TypeScript</span></div>
            <div class="card fourth"><img src="@/assets/imgs/sass.svg" alt="Sass"><span>Sass</span></div>
            <div class="card fourth"><img src="@/assets/imgs/storybook.svg" alt="Storybook"><span>Storybook</span></div>
            <div class="card fourth"><img src="@/assets/imgs/vue.svg" alt="Vue"><span>Vue</span></div>
            <div class="card fourth"><img src="@/assets/imgs/react.svg" alt="React"><span>React</span></div>
            <div class="card fourth"><img src="@/assets/imgs/angular.svg" alt="Angular"><span>Angular</span></div>

            <div class="card fourth extensible"><img src="@/assets/icons/plus.svg" alt="Extensible"><span>Extensible</span></div>
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
            <img width="100%" height="100%" src="@/assets/imgs/design-tool-extractors-1x.png" alt="Design File Extractors: Sketch, Illustrator, Figma, InVision DSM">
          </div>
        </div>
      </section>

      <section id="extensiblity" class="section-split">
        <div class="half mobile-reorder">
          <div class="video-holster card">
            <video autoplay loop muted class="video" >
              <source src="@/assets/imgs/hot.mp4" type="video/mp4">
            </video>
          </div>
        </div>
        <div class="half align-top">
          <h2>Hot Updates</h2>
          <p>The Diez compiler ships with a <code class="inline">hot</code> mode, which allows for hot updates at development time — even inside native iOS and Android apps.</p>
        </div>
      </section>

      <section id="extensiblity" class="section-split">
        <div class="half align-top">
          <h2>Documentation Generator (coming soon)</h2>
          <p>From code comments and static analysis, Diez can automatically build customizable, ready-to-deploy documentation for your design system. This is not yet available as part of Early Access, but it will be shipping soon!</p>
        </div>
        <div class="half mobile-reorder">
          <div class="holster-tri-card">
            <img width="100%" height="100%" class="card img-outline" src="@/assets/imgs/docz.jpg" alt="docs">
          </div>
        </div>
      </section>
    </div>

    <section class="cta">
      <h2>We'd love your feedback!</h2>
      <div><a class="button alt" target="_blank" href="https://design-code.typeform.com/to/Mc5oIq">Get Early Access</a></div>
    </section>

    <footer id="footer">
      <div class="footer-container section">
        <span class="social-foot">
          <a href="https://join.slack.com/t/dieznative/shared_invite/enQtNzEzNzM2OTg4NDA1LTA4NWZiMTNlZTgzNTY3Yzg2ODdjY2Y1MzBjMjdlY2FlNjljMmI3ZTgzMmQ4ODk1MDdlMTcyMTUzMjNmZWI4YjU" target="_blank"><img src="@/assets/imgs/slack.svg" alt="slack">Slack</a>
          <a href="https://spectrum.chat/diez" target="_blank"><img src="@/assets/imgs/spectrum.svg" alt="spectrum">Spectrum</a>
          <a href="https://twitter.com/dieznative" target="_blank"><img src="@/assets/imgs/twitter.svg" alt="twitter">Twitter</a>
        </span>
        <div class="farewell">
          <svg height="30" viewBox="0 0 30 35"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" ><g transform="translate(-60.000000, -340.000000)" fill-rule="nonzero" fill="#FAFBFC" ><path d="M79.6743412,358.623878 L79.6743412,362.871503 C79.6743412,363.400869 79.2682808,363.830005 78.7673799,363.830005 C78.6222785,363.830005 78.4851356,363.793994 78.3635166,363.729967 C78.34448,363.723063 78.3255311,363.71545 78.3066975,363.707114 L66.1265569,358.316147 C65.8719685,358.312116 65.6277889,358.194257 65.4583663,357.990563 C65.236718,357.815813 65.0931949,357.536521 65.0931949,357.221803 L65.0931949,346.23178 C65.0654972,346.19459 65.0400082,346.155061 65.0170172,346.113323 L64.4388751,345.866324 L61.8141812,344.744981 L61.8141812,370.978336 L65.0931949,372.379223 L65.0931949,363.562661 C65.0931949,363.548946 65.0934675,363.535298 65.0940072,363.521723 C65.0877035,363.383637 65.1096982,363.241936 65.1635972,363.105925 C65.3570922,362.617651 65.8884912,362.387599 66.3505099,362.59209 L78.5926401,368.010852 L78.8293766,368.12344 C79.3013618,368.157112 79.6743412,368.572392 79.6743412,369.079737 L79.6743412,370.978336 L82.9217923,372.365738 L82.9533549,372.379223 L82.9533549,357.091831 L79.6743412,358.623878 Z M77.8604187,359.074392 L71.2457982,356.146741 L68.5769222,357.322353 L77.8604187,361.431257 L77.8604187,359.074392 Z M66.9071174,364.916779 L66.9071174,372.525085 L70.1861312,371.124198 L70.1861312,366.36808 L66.9071174,364.916779 Z M66.0183415,374.990763 C66.0122941,374.990888 66.0062321,374.990952 66.0001562,374.990952 C65.7574127,374.990952 65.5369425,374.890169 65.3741662,374.726036 L64.4388751,374.326454 L60.7559742,372.753015 C60.327067,372.676924 60.0002587,372.282686 60.0002587,371.807781 L60.0002587,371.757381 C59.9999146,371.741632 59.999913,371.725844 60.0002587,371.710031 L60.0002587,343.297252 C59.9999419,343.282755 59.9999154,343.268227 60.0001828,343.253675 C59.9999154,343.239123 59.9999419,343.224595 60.0002587,343.210098 L60.0002587,343.199809 C60.0002587,342.907794 60.1238223,342.646278 60.3187079,342.470473 C60.4020887,342.390103 60.5001627,342.323755 60.6109193,342.276436 L65.6297553,340.132248 C65.8831598,339.982229 66.196997,339.952688 66.4855897,340.080648 L71.1949912,342.168767 C71.2074724,342.168229 71.2200186,342.167957 71.2326249,342.167957 C71.7335258,342.167957 72.1395862,342.597093 72.1395862,343.126459 L72.1395862,343.250899 C72.1399238,343.266504 72.1399253,343.282145 72.1395862,343.297812 L72.1395862,349.529138 L77.8604187,347.09397 L77.8604187,343.297252 C77.860102,343.282755 77.8600754,343.268227 77.8603428,343.253675 C77.8600754,343.239123 77.860102,343.224595 77.8604187,343.210098 L77.8604187,343.126459 C77.8604187,342.613079 78.2423236,342.193968 78.7222667,342.169122 L83.4899153,340.132248 C83.7433199,339.982229 84.0571571,339.952688 84.3457497,340.080648 L89.2519202,342.256013 C89.6769391,342.335511 89.9997462,342.72782 89.9997462,343.199809 L89.9997462,343.250898 C90.0000839,343.266504 90.0000853,343.282145 89.9997462,343.297812 L89.9997462,371.807781 C89.9997462,372.161341 89.8186098,372.47019 89.5490604,372.636336 C89.4639045,372.720367 89.3629814,372.7896 89.2485109,372.838505 L84.3659156,374.924487 C84.0484149,375.060133 83.7030225,375.006784 83.4413887,374.814499 L82.1896585,374.279725 L78.4710793,372.691043 C78.1783644,372.565987 77.9742339,372.30801 77.895805,372.009575 C77.8748589,371.93279 77.8627519,371.852046 77.8607236,371.768652 C77.8600951,371.749167 77.8599905,371.729619 77.8604187,371.710031 L77.8604187,369.764786 L77.8482573,369.759002 L77.8604187,369.730442 L77.8604187,369.764743 L72.0000537,367.170928 L72.0000537,371.79992 C72.0000537,371.828454 71.9988739,371.856697 71.9965631,371.884597 C71.9952742,372.291612 71.7647575,372.676539 71.3856493,372.838505 L66.5057556,374.923333 C66.3456044,374.991754 66.1783567,375.012089 66.0183415,374.990763 Z M84.7672774,372.526239 L88.1858237,371.06574 L88.1858237,344.798615 L84.7672774,346.259114 L84.7672774,349.463091 C84.7672774,349.765597 84.6346766,350.035372 84.4275514,350.21104 C84.3352531,350.334075 84.212999,350.434823 84.0661564,350.499506 L73.5992688,355.110061 L78.2773543,357.180596 L83.406616,354.784063 C83.8647421,354.570013 84.4003172,354.788982 84.6028566,355.273142 C84.6077006,355.284721 84.6123102,355.296347 84.6166876,355.308014 C84.7118489,355.459644 84.7672774,355.641544 84.7672774,355.837125 L84.7672774,372.526239 Z M82.9533549,346.23178 C82.9256572,346.19459 82.9001683,346.155061 82.8771773,346.113323 L82.2990351,345.866324 L79.6743412,344.744981 L79.6743412,346.970298 L82.9533549,348.371185 L82.9533549,346.23178 Z M66.9071174,355.98103 L70.3256637,354.475196 L70.3256637,344.798615 L66.9071174,346.259114 L66.9071174,355.98103 Z M72.1395862,351.595797 L72.1395862,353.676182 L81.0113282,349.768271 L78.7501443,348.80223 C78.7422796,348.79887 78.7344789,348.795414 78.7267428,348.791864 L72.1395862,351.595797 Z M81.3958302,343.253675 L83.0311689,343.952338 L83.9928519,344.363196 L86.5200325,343.283513 L83.9712314,342.153391 L81.3958302,343.253675 Z M63.5356702,343.253675 L65.1710089,343.952338 L66.1326918,344.363196 L68.6598725,343.283513 L66.1110714,342.153391 L63.5356702,343.253675 Z" id="Combined-Shape" data-reactid="12"></path></g></g></svg>
          <span>An open-source project from the</span><a class="inline-link underline" href="https://haikuforteams.com">Haiku Team</a></div>
        </div>
        <div class="clear"></div>
    </footer>

  </div>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue';
import {Component, Vue} from 'nuxt-property-decorator';

@Component({
  components: {NavBar},
})

export default class extends Vue {

}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_utils.scss';

  .hero {
    height: 75vh;
    min-height: 600px;
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

  .cta, footer {
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

  .social-foot {
    float: right;
    @include phone {
      float: none;
    }
  }

  #footer {
    font-size: 16px;
    padding: $spacing2XL 0 $spacing3XL;
    font-weight: 700;

    a {
      color: $white;
      padding: 0 $spacingLG;

      @include phone{
        display: block;
        margin: 10px 0;
      }

      &.inline-link {
        padding: 0 0 0 $spacingXS;
        display: inline-block;
        @include phone {
          padding: 0;
          display: inline;
          float: none;
        }
      }
      img {
        height: 20px;
        transform: translate(-7px, 4px);
      }
    }
    .footer-container {
      margin: 0 auto;
      padding-bottom: 0;
    }
  }

  .farewell {
    float: left;
    @include phone {
      float: none;
      display: block;
    }
    svg {
      margin: 0 5px -8px 0;
    }
    a {
      margin: 0;
    }
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

  .left {
    float: left;
  }

  .clear {
    clear: both;
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

  .aside {
    margin-top: $spacing2XL;
    font-size: 17px;
    line-height: 20px !important;
    padding: $spacingXS $spacingXL;
    background-color: $gray400;
    color: $purple;
    border: 4px solid $purple;
    border-radius: $borderRadiusCard;
    li, p {
      line-height: 20px;
    }
    h4 {
      font-size: 20px;
      margin-top: 14px;
      margin-bottom: 10px;
    }
  }
</style>

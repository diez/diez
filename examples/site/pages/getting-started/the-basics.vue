<template>
  <div>
    <NavBar/>
    <div class="page">
      <section class="section-split">
        <div class="one-quarter">
          <GettingStartedNav/>
        </div>
        <div class="three-quarters">      
          <h2>The basics</h2>
          <h3>The moving pieces</h3>
            <h4>Your Diez (design system)</h4>
              <p>Your Diez is a set of design token component definitions in TypeScript<p>
            <h4>Your Diez SDKs</h4>
              <p>Your Diez SDKs are the output of your Diez after compilation — and make your Diez usable in your application codebases.<p>
            <h4>Diez CLI</h4>
              <p>The Diez CLI is used to generate your Diez and cut new versions of your Diez's SDKs.<p>
            <h4>Diez Complier</h4>
              <p>The Diez Complier takes your Diez's definitions in TypeScript and creates your versioned SDKs which allow your codebases to consume your Diez.<p>
          <h3>How they work together</h3>
            <h4>Use the Diez CLI to scaffold out your Diez (design system)</h4>
              <p>This is your design source of truth. A neat set of components in TypeScript.</p>
            <h4>Use the Diez CLI to compile SDKs</h4>
              <p>This takes the changes from your definitions in TypeScript and creates a versioned set of SDKs for all of your codebases.</p>
          <h3>Creating Design Token Components</h3>
            <p>Why Components; why TypeScript</p>
            <p>General look...</p>
          <h3>Using Prefabs to compose your Diez</h3>
          <p>Prefabs are simply the collection of design token components that ships with Diez. They cover common use cases for design tokens. Below we'll show how to use them to compose your Diez.</p>
            <h4>Colors</h4>
            <p>Use the <code class="inline">Color</code> component to compose palettes.</p>
            <div class="code-block">
              <pre><code>
import {Color} from '@diez/prefabs';
import {Component, property} from '@diez/engine';

class MyColors extends Component {
  @property purple = Color.rgb(86, 35, 238);
}
              </code></pre>
            </div>
            <h4>Typography</h4>
            <p>Typography is a bit more complicated. You'll need to wrangle both Fonts and your text styles.</p>
            <p>Fonts</p>
            <p>Typographs</p>
            <p>These are our <i>fun</i> term for what are commonly known as Text Styles</p>
            <h4>Images</h4>
            <h4>Animation</h4>
          <h3>Creating custom components</h3>
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
export default class Basics extends Vue {
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
  .code-block {
    width: 100%;
  }
</style>
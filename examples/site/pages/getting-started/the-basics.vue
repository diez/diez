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
          <img width="100%" src="@/assets/imgs/concept.png" alt="concept-art">
          <h3>The moving pieces</h3>
            <h4>Your Diez Project</h4>
              <p>Your Diez project is a collection of <NuxtLink to="/glossary#tokens">design token component (DTC)</NuxtLink> definitions in TypeScript. This is your team's <i>living</i> source of truth for its design system.<p>
            <h4>Diez Complier</h4>
              <p>The Diez Complier transpiles your project's DTCs into versioned SDKs for each <NuxtLink to="/glossary#targets">target</NuxtLink> you specify.<p>
            <h4>Your Diez SDKs</h4>
              <p>Your Diez SDKs are the output of your Diez project after compilation. For each target you specify, you have a library ready to use within your app's codebase.<p>
            <h4>Diez CLI</h4>
              <p>The Diez CLI is used to generate your Diez project, cut new versions of your Diez SDKs, initiate the optional <NuxtLink to="/glossary#hot-mode">hot mode</NuxtLink> during development, and to extract assets from design files.<p>
          <h3>Using Design Token Components to compose your Diez project</h3>
          <p>To compose your Diez project you will componentize your team's design tokens in order to make them customizable, composable, reusable, and developer-friendly within your consuming codebase(s). TypeScript is used for making these definitions. Read more about that choice <NuxtLink to="/faq#typescript">here</NuxtLink>.</p>
          <p>In general, you define <code class="inline">Component</code>(s) composed of <code class="inline">Property</code>(ies) and compose them together to create your full "Design System."</p>
          <div class="code-block">
            <pre><code>
import {Component, property} from '@diez/engine';

class LayoutValues extends Component {
  @property spacingSmall = 5;
}

export class DesignSystem extends Component {
  @property layoutValues = new LayoutValues();
}
            </code></pre>
          </div>
          <p>For convenience, Diez comes packaged with many <NuxtLink to="/glossary#prefabs">prefabs</NuxtLink> that you can use to define your design token components (DTCs). They cover common use cases for design tokens.</p>
          <p>After compilation the properties defined on your DTCs are available to you along with a number of extensions and helpers to make interacting with them in your host codebase(s) a seamless experience.</p>
          <p>Below we'll show how to use prefabs to define your DTCs and compose your Diez project.</p>
            <h4>Colors</h4>
            <p>Use the <code class="inline">Color</code> component to create color palettes.</p>
            <div class="code-block">
              <pre><code>
import {Color} from '@diez/prefabs';

class MyColors extends Component {
  @property purple = Color.rgb(86, 35, 238);
}
              </code></pre>
            </div>
            <p class="note">View the full <code class="inline">Color</code> API <NuxtLink to="/TODO">here</NuxtLink>.</p>
            <h4>Images</h4>
              <p></p>
              <div class="code-block">
                <pre><code>
import {Image} from '@diez/prefabs';

class Images extends Component {
  @property logo = Image.responsive('assets/logo.png');
}
                </code></pre>
              </div>
              <p class="note">View the full <code class="inline">Image</code> API <NuxtLink to="/TODO">here</NuxtLink>.</p>            
            <h4>Typography</h4>
              <p>Typography is a bit more complicated. You'll need to <i>compose</i> two prefabs (<code class="inline">Font</code> and <code class="inline">Typograph</code>) in order to create a text style.</p>
              <div class="code-block">
                  <pre><code>
import {Font, Typograph} from '@diez/prefabs';

class TextStyles extends Component {
  @property heading1 = new Typograph({
    font: Font.fromFile('assets/SourceSansPro-Regular.ttf'),
    fontSize: 24,
    color: colors.text,
  });
}
                </code></pre>
              </div>
              <p>There are a few more prefabs available <NuxtLink to="/TODO">here</NuxtLink>, and we will be adding more in due time. Because prefabs are just components, you're able to extend them or contribute back to the mainline as well.</p>
            <h4>Creating custom components</h4>
              <p>Have something else in mind? You're in luck — Diez was carefully designed with <NuxtLink to="/faq#extensibility-explained">extensibility</NuxtLink> and customizability as core principles. You're able to use Diez without leveraging <i>any</i> of its prefabs if you so choose — you'll just need to define your own custom components.</p>
              <p>Two examples of custom components are demonstrated in example projects <a href="https://github.com/diez/diez/blob/master/examples/lorem-ipsum/src/components/Margin.ts" target="_blank">here</a> and <a href="https://github.com/diez/diez/blob/master/examples/poodle-surf/src/designs/components/SimpleGradient.ts" target="_blank">here.</a></p>
            <h3>Next steps</h3>
              <p>After composing your Diez project via DTCs you'll need to hook it up to your codebase(s). Platform specific guides are available in the side menu.</p>
              <p>Where should your Diez project itself live? This is up to you, but we've found success with this pattern: The Diez project lives in a stand-alone GitHub repo and compiles SDKs into its consumer codebases.</p>
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
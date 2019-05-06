<template>
  <div id="faq">
    <section class="section-split">
      <div id="cross-platform-explained" class="one-third question">
        <h3>What platforms does Diez support?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Diez is a toolkit for creating <NuxtLink to="/glossary#pds">production design systems</NuxtLink>, and has no intrinsic limitations in terms of target platforms or technologies. The current Diez beta includes compiler <NuxtLink to="/glossary#targets">targets</NuxtLink> for <strong>iOS SDKs</strong> written in Swift with Objective-C bridging, <strong>Android SDKs</strong> written in Kotlin, and <strong>Web SDKs</strong> written in JavaScript with TypeScript typings. Most essentially, these are useful reference implementations of the Diez compiler API, which is arbitrarily extensible — our roadmap already includes additional configuration options for these compiler targets, and entirely new compiler targets (including CSS and Sass SDKs for the web).</p>
      </div>
      <div class="one-third question">
        <h3>How is this different from React Native, Flutter, et al?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Diez doesn't force your app to work within its paradigm or have opinions on how you design, develop, and structure your app's code. It simply provides you with SDKs for use in your existing codebases. Diez SDKs are libraries <strong>not frameworks</strong> — they are intended to complement, but not replace, your design workflow.</p>
      </div>
      <div id="extensibility-explained" class="one-third question">
        <h3>How is Diez designed for extensibility?</h3>
      </div>
      <div class="two-thirds answer">
        <p>The Diez toolkit consists of several layers, each equipped with flexible APIs:</p>
        <ul>
          <li>A <strong>command line interface</strong> which can be used to invoke “<span class="to-do-link-needed">commands</span>”. Anyone can provide additional commands in the command line interface, or add additional options to “<span class="to-do-link-needed">core</span>” commands such as <code class="inline">diez compile</code>.</li>
          <li>An <strong>engine layer</strong>, provides an abstract definition of “<span class="to-do-link-needed">components</span>” which can be implemented to define cross-platform design systems.</li>
          <li>A <strong>compiler layer</strong> that is capable of parsing user-defined and <NuxtLink to="/glossary#prefabs">prefab</NuxtLink> components and emitting native SDKs according to a flexible set of rules. With the Diez compiler API, you can define entirely new <NuxtLink to="/glossary#targets">target</NuxtLink> SDK languages and platforms, extend existing language/platform implementations, and, if needed, even provide custom <NuxtLink to="/glossary#bindings">native bindings</NuxtLink> for special components.</li>
        </ul>
      </div>
      <div class="one-third question">
        <h3>How can I contribute to Diez?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Diez is open source — checkout the <a href="https://github.com/diez/diez/blob/master/CONTRIBUTING.md">contributing guidelines</a>!</p>
      </div>
      <div class="one-third question">
        <h3>Do I have to use the components provided by Diez?</h3>
      </div>
      <div class="two-thirds answer">
        <p>No. You can use as many or as few of them as you want. You can design your own — Diez is designed for extensibility. Our current beta includes a number of <NuxtLink to="/glossary#prefabs">prefab</NuxtLink> components implementing some <NuxtLink to="/glossary#primitives">design primitives</NuxtLink> we've observed in design systems. We'll certainly be adding more, and you can too.</p>
      </div>
      <div class="one-third question">
        <h3>Where does the Diez source of truth live?</h3>
      </div>
      <div class="two-thirds answer">
        <p>This is up to you. We've found success with this pattern: The Diez project lives in a stand-alone GitHub repo and compiles SDKs into its consuming codebases.</p>
      </div>
      <div class="one-third question">
        <h3>What is TypeScript and what does it have to do with Diez?</h3>
      </div>

      <div class="two-thirds answer">
        <p>TypeScript is a well-designed language with excellent tooling created by Anders Heiljberg (the programming language designer who also created C# and Delphi). The Diez compiler uses its type system to emit SDKs that are compatible with strongly typed languages such as Swift, Kotlin, and Java. It has a flexible compiler API, and because it's a web language, it enables us to build excellent reactive tooling on top of it which enables us to achieve things that were previously unattainable. (<a href="https://spectrum.chat/diez">Ask us</a> about our explorations into Rust, WASM, LLVM.) And because TypeScript is a superset of JavaScript, you probably already know how to code in it!</p>
        <p><NuxtLink to="/glossary#primitives">Design primitives</NuxtLink> such as colors and fonts look the same whether you're building them in Sketch, Illustrator, Figma, or any other tool. Diez chose to use a popular, accessible programming language with an expressive type system and excellent IDE support to capture the essential properties of design primitives while remaining agnostic to the idiosyncrasies of the platforms being targeted.</p>
      </div>

      <div class="one-third question">
        <h3>Does TypeScript mean I'm stuck with a web runtime?</h3>
      </div>
      <div class="two-thirds answer">
        <p>No! In production, Diez does not use a web runtime. Diez completely ejects into your codebase using pure native code SDKs.</p>
      </div>
      <div class="one-third question">
        <h3>Am I locked into Diez once I start using it for my team's design system?</h3>
      </div>
      <div class="two-thirds answer">
        <p>In production mode, you already are ejected from Diez. You own your design system, you own your SDK, and don't have to continue using Diez to update it if at any point you decide that it's not the right fit.</p>
      </div>
      <div class="one-third question">
        <h3>How do I manage my UI components with Diez?</h3>
      </div>
      <div class="two-thirds answer">
          <p>You don't. Diez doesn't currently handle any rendering, by design. Diez is a layer underneath your UI components — so if you maintain a React design component library, for example, you can hook it up to Diez, but it's up to you to maintain your UI component library. That said, this is something we're thinking about a lot. Have feedback any on this? <a href="https://spectrum.chat/diez/feedback">Let us know</a>!</p>
      </div>
      <div class="one-third question">
        <h3>Is Diez for designers as well as developers?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Authoring Diez currently requires writing code.  It's straightforward to write, and at least as easy to write as React (probably easier!) — so if you consider yourself a low-coder, Diez is probably a great fit. We highly recommend authorizing Diez components using VS Code, which provides first-class support for TypeScript.</p>
      </div>
      <div class="one-third question">
        <h3>Does Diez work with modern design tools; e.g. Figma, Sketch, InVision, et al?</h3>
      </div>
      <div class="two-thirds answer">
        <p>The current Diez beta includes <NuxtLink to="/glossary#bindings">native bindings</NuxtLink> for an <code class="inline">Image</code> <NuxtLink to="/glossary#prefabs">prefab</NuxtLink> which is compatible with every design tool capable of exporting slices. We have alpha support for automatic extraction of slices from Sketch, Figma, and Illustrator, and plan to build additional tooling to enable syncing your design tools with your <NuxtLink to="/glossary#pds">production design system</NuxtLink>. We'd love your thoughts on this topic if you have <a href="https://spectrum.chat/diez/design-tools">any feedback</a>.</p>
      </div>
      <div class="one-third question">
        <h3>Does a team's design system source of truth live in design tools or in Diez?</h3>
      </div>
      <div class="two-thirds answer">
        <p>We envision treating design assets like (and as) code assets.  Think of design files as blobs of “alien source code,” which Diez can compile into a common language for cross-platform <NuxtLink to="/glossary#pds">production design systems</NuxtLink>. When we're able to build out more meaningful connections between design tools and Diez, the lines will get a bit blurrier, but for now, this is how we're approaching it.</p>
      </div>
      <div id="hot-mode-explained" class="one-third question">
        <h3>How does hot updating work?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Hot updating uses TypeScript's powerful ability to watch, typecheck, and hot-compile a codebase (in the case of Diez, a codebase containing Diez components) to observe and emit changes to your design system, recompile your cross-platform SDKs, and emit changes into your codebase. Under the hood, we are running a hot server based on the popular and powerful ability for web applications to implement “hot module reloading”, which basically means that we can react to and emit changes in real time, even if you're targeting a native codebase.</p>
        <p>As a convenience for emitting changes to your design system into a native app while it's still running on your device or simulator, we are using webviews in <NuxtLink to="/glossary#hot-mode">hot mode</NuxtLink>, <em>only</em>. We plan to revise this approach in the future, but it's perfectly suitable for development and “melts away” in production builds.</p>
      </div>
      <div class="one-third question">
        <h3>Does hot updating (hot mode) affect App Store acceptability?</h3>
      </div>
      <div class="two-thirds answer">
        <p>No. The hot updating mechanism “melts away” for production builds.</p>
      </div>
      <div class="one-third question">
        <h3>Is hot updating necessary or required?</h3>
      </div>
      <div class="two-thirds answer">
        <p><NuxtLink to="/glossary#hot-mode">Hot mode</NuxtLink> is a completely optional feature — you can use Diez-generated SDKs as a single source of truth for your design system without touching it at all.</p>
      </div>
      <div class="one-third question">
        <h3>Why would you want to use hot updating in development?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Hot updating enables you to design live in context. While this is helpful on your own, it has the potential to really shine in team settings — unlocking unprecedented cross-discipline collaboration. Imagine a world where your designers can design live on their machines while you have demo builds running on client machines.</p>
      </div>
      <div class="one-third question">
        <h3>Who's stewarding Diez?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Diez is a brand new open source project designed and built by <a href="http://www.haikuforteams.com/">haikuforteams.com</a>.</p>
      </div>
      <div class="one-third question">
        <h3>Is Diez ready for production usage, or is it still in beta?</h3>
      </div>
      <div class="two-thirds answer">
        <p>Diez is in beta, but we are already having success using Diez to build our own apps! Diez is built with a high quality codebase, has excellent test coverage, and is always getting better.</p>
      </div>
      <div class="one-third question">
        <h3>What's next for Diez?</h3>
      </div>
      <div class="two-thirds answer">
        <p>We have an ambitious and exciting road ahead of us, and are very open to <a href="https://spectrum.chat/diez/feedback">feedback about which features you'd like to see</a> us work on next.</p>
        <p>Our current roadmap is <a href="https://github.com/diez/diez/projects/1">on GitHub</a>.</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';

@Component({
  components: {},
})
export default class NavBar extends Vue {}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_layout.scss';

  a {
    background-color: rgba($white, .12);
    color: $white;
    text-decoration: underline;
    font-weight: 400;
    padding: 0 $spacingXS;
    transition: background-color 140ms ease;
    &:hover {
      background-color: rgba($white, .22);
    }
  }

  #faq {
    background-color: $purple;
    color: $white;
    margin-bottom: -$spacing3XL;
    .question, .answer {
      align-self: flex-start;
      padding-top: 52px;
    }
    h3 {
      margin-top: $spacingLG;
    }
  }

  .section-split {
    margin-bottom: 0;
  }
</style>

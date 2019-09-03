## Getting Started

<h3 id="set-up">Setting up your Diez project</h3>

<h4 id="intro">Introduction</h4>

Diez aims to make it easy for you to adopt a unified design language across codebases, platforms, and teams. It is intended to be used as _the_ source of truth for your design system.

#### Prerequisites
Install [yarn](https://yarnpkg.com/). Diez works best with Yarn, and our example projects use Yarn to run some scripts.

#### Scaffold out your Diez project
The best way to get up and running with Diez is by using our official template project which comes with everything set up and ready to party.

Run the following command in your terminal and follow the prompts. 

```bash
yarn create diez
```
<div class="note">The above command will prompt you to choose a name for your Diez project. Please note that for the duration of the guides, your project will be referred to as <code class="inline">your-ds-name</code>.</div>

```bash
cd your-ds-name/design-system
```
That's it! You now have a Diez project set up and ready to power your apps. Let's take a look at what you just made.

By default, the `yarn create diez` CLI functionality scaffolds out not only a Diez project, but example codebases that demonstrate how to consume your Compiler-baked Diez SDKs in real apps.

<HaiInfographic></HaiInfographic>

<div class="note">Note that the example apps are only present for demonstration purposes. They can be safely discarded when you connect your Diez project to your own apps.</div>

#### Now for the experience
Run the following command to experience the demo.

```bash
yarn demo
```

This demo is running in [hot mode](/glossary/#hot-mode). Try modifying the contents of `src/DesignSystem.ts` (relative to the root of the Diez project) to see changes to the design system take effect in real time.


### Next Steps

#### Explore the example app codebases

 We've written platform specific, getting started guides for walking through this new Diez project you've just created. We recommend picking your flavor(s) and jumping right in.
 
 <div class="cards-holster">
  <router-link class="card fourth" to="/getting-started/swift">
    <img src="@theme/assets/imgs/swift.svg" alt="Swift"><span>Swift</span>
  </router-link>
  <router-link class="card fourth" to="/getting-started/kotlin">
    <img src="@theme/assets/imgs/kotlin.svg" alt="Kotlin"><span>Kotlin</span>
  </router-link>
  <router-link class="card fourth" to="/getting-started/javascript">
    <img src="@theme/assets/imgs/javascript.svg" alt="JavaScript"><span>JavaScript</span>
  </router-link>
  <router-link class="card fourth" to="/getting-started/css-sass">
    <img src="@theme/assets/imgs/sass.svg" alt="Sass"><span>CSS & Sass</span>
  </router-link>
</div>


#### Additional guides
If you'd prefer to first learn a bit more about your Diez project and how to compose your design token components, we have you covered with the Diez Basics guide. Want to hook your new Diez project up to Figma? We've got you there too.

<div class="cards-holster">
  <router-link class="card fourth" to="/getting-started/the-basics">
    <img src="@theme/assets/imgs/logo.svg" alt="Swift"><span>Diez Basics</span>
  </router-link>
  <router-link class="card fourth" to="/getting-started/figma">
    <img src="@theme/assets/imgs/figma.svg" alt="ObjectiveC"><span>Figma</span>
  </router-link>
</div>


Still need help? We're working hard to generate a complete set of guides (check back soon). In the meantime, please don't hesitate to [reach out for help](https://spectrum.chat/diez) on a particular topic.
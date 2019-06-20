## JavaScript Guide (web)

### Getting Started

#### Prerequisites

The best way to try out Diez is by using our official template project which comes with everything set up for you. Head over to the [Set Up guide](/getting-started#set-up) if you haven't already scaffolded out a template project and example codebases.

#### Generate your Diez project's web SDK and serve it in hot mode

In the template project, you'll find a sample Diez project defined for you in `src/DesignSystem.ts` and a sample web project consuming it in `examples/web`.

From your Diez project root, run the following command to compile your Diez project's JavaScript SDK and serve it in hot mode.

```bash
yarn start-web
```
<div class="note">Note that it's also possible to separate these commands into <code class="inline">yarn build-web</code> and <code class="inline">yarn run-web</code>.</div>


#### Running the web app

Next you'll want to leave your Diez project server running and open a new tab in your terminal in order to run the sample web project consuming it.

```bash
cd examples/web
yarn start
```

If you take a look at the code in `examples/web/App.tsx`, you'll find that the design system is used across the app in sections of the code like this:

```jsx
<Masthead
  backgroundColor={ds.colors.darkBackground.color}
  backgroundImage={ds.images.masthead.urlCss}
/>
```

As you can see, the app is **directly** consuming your design system!

### Making Changes

Due to your Diez project being served in hot mode, any time you make changes to it, it will recompile on the fly.

For example, you can change the background color of the web app by modifying your design system's source of truth.

First, open `src/DesignSystem.ts` in an editor of your choice. Look for the following block of code:

```typescript
class Colors extends Component {
  @property lightBackground = palette.white;
  @property darkBackground = palette.black;
  @property text = palette.black;
  @property caption = palette.purple;
}
```

In this example, the `Colors`component maps semantic names to the `Palette` component's color definitions.

Change `lightBackground` to `palette.lightPurple` like so:

```Diff
- @property lightBackground = palette.white;
+ @property lightBackground = palette.lightPurple;
```

Go back to your browser and see the web app hot update! You can update and hot reload **any** value defined in your design system: strings, colors, images, fonts, etc.

Please see [The Basics Guide](/getting-started/the-basics) for more information on how to compose and edit your design token components (DTCs).

<!--
Now you are ready to start! if you want to integrate Diez with an existing project, check out [Integrating Diez with an existing web project][TODO:] -->

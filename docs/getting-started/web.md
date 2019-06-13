# Web Getting Started Guide (JavaScript)

## Getting Started

The easiest way to try out Diez is by using our official template project which comes with everything set up for you. To get the project, run in your terminal:

```bash
$ yarn create diez-project my-project
$ cd my-project
```

### Building your project

In the template project, you'll find a sample Diez project defined for you in `src/DesignSystem.ts` and a sample web project consuming it in `examples/web`.

The template project comes with a couple of commands defined in `package.json`, including `build-web` which generates a build of your Diez project ready to consume in JavaScript as a library.

To build your Diez project for web run:

```bash
$ yarn build-web
```

This command instructs Diez to compile your project for web. If you are curious what that looks like, you can inspect the build files at `build/diez-your-project-web`.

### Running the web app

If you take a look at the code in `examples/web/App.tsx`, you'll find that the design system is used across the app in sections of the code like this:

```jsx
<Masthead
  backgroundColor={ds.colors.darkBackground.toString()}
  backgroundImage={`url(${ds.images.masthead.url})`}
/>
```

As you can see, the app is **directly** consuming your design system! To start the web app, run the following commands in your shell:

```
$ cd examples/web
$ yarn start
```

And visit [http://localhost:8080](http://localhost:8080) in your favorite web browser.

## Making Changes

You can view changes in real time by starting a hot Diez server for your project. This server will take care of compiling your Diez project every time it changes.

To start the server, in a **new** terminal window or tab, run:

```bash
yarn run-web
```

For example, you can change the background color of the application by modifying the design system's source of truth.

First, open `src/DesignSystem.ts` in an editor of your choice. Look for the following block of code:

```typescript
class Colors extends Component {
  @property lightBackground = palette.white;
  @property darkBackground = palette.black;
  @property text = palette.black;
  @property caption = palette.purple;
}
```

> In this example, the `Colors` component maps semantic names to the `Palette` component's color definitions.

Change `lightBackground` to `palette.lightPurple` like so:

```Diff
- @property lightBackground = palette.white;
+ @property lightBackground = palette.lightPurple;
```

Go back to your browser and see the web app hot update! You can update and hot reload **any** value defined in your design system: strings, colors, images, fonts, etc.

Now you are ready to start! if you want to integrate Diez with an existing project, check out [Integrating Diez with an existing web project][TODO:]

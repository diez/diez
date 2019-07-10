## Swift Guide (iOS)

### Getting Started

#### Prerequisites

The best way to try out Diez is by using our official template project which comes with everything set up for you. Head over to the [Set Up guide](/getting-started#set-up) if you haven't already scaffolded out a template project and example codebases.

#### Generate your Diez project's iOS SDK and serve it in hot mode

In the template project, you'll find a sample Diez project defined for you in `src/DesignSystem.ts` and a sample iOS app consuming it in `examples/ios`.

From your Diez project root, run the following command to compile your Diez project's iOS SDK and serve it in hot mode.

```bash
yarn start ios
```
<div class="note">Note that it's also possible to separate these commands into <code class="inline">yarn build-ios</code> and <code class="inline">yarn run-ios</code>.</div>

#### Open the generated workspace in Xcode

```bash
open examples/ios/YourProjectName.xcworkspace
```

Run the application (click ► or hit `⌘ + r`) to see Diez in action.

### Making Changes

Let's change the background color of our application by modifying our design system's source of truth.

Open `src/DesignSystem.ts`, in an editor of your choice, and look for the following block of code:

```typescript
class Colors extends Component {
  @property lightBackground = palette.white;
  @property darkBackground = palette.black;
  @property text = palette.black;
  @property caption = palette.purple;
}
```

In this example, the `Colors` component maps semantic names to the `Palette` component's color definitions.

Let's change `lightBackground` to `palette.lightPurple` like so:

```Diff
- @property lightBackground = palette.white;
+ @property lightBackground = palette.lightPurple;
```

Save your changes to see the background color update in real time! Feel free to experiment with changing other values to see Diez in action.

Note that if you make any changes to the structure of your design token components (e.g. you add/remove a property to any component) you will need to regenerate the SDK (`yarn start ios`), clean your Xcode project (`⌘ + shift + K`), and then build/run (`⌘ + r`).

Please see [The Basics Guide](/getting-started/the-basics) for more information on how to compose and edit your design token components.
## Swift - Getting Started

#### Prerequisites

The best way to try out Diez is by using our official template project which comes with everything set up for you. Head over to the [Set Up guide](/getting-started#set-up) if you haven't already scaffolded out a template project and example codebases.

The project generated in this guide requires Xcode 9+, Cocoapods 1.7.0+, and iOS 11+. We recommend using the latest stable version of Xcode.

#### Generate your Diez project's iOS SDK and serve it in hot mode

In the template project, you'll find a sample Diez project defined for you in `src/DesignSystem.ts` and a sample iOS app consuming it in `examples/ios`.

From your Diez project root, run the following command to compile your Diez project's iOS SDK and serve it in hot mode.

```bash
yarn start ios
```

The effect of running this command is the same as running:
```bash
yarn diez compile -t ios --cocoapods
yarn diez hot -t ios
cd examples/ios
pod install
open examples/ios/PoodleSurf.xcworkspace
```

Once you have the application open in Xcode, run it (click ► or hit `⌘ + r`) to see Diez in action.

#### Making Changes

Let's change the background color of our application by modifying our design system's source of truth.

Open `src/DesignSystem.ts`, in an editor of your choice, and look for the following block of code:

```typescript
class Colors {
  lightBackground = palette.white;
  darkBackground = palette.black;
  text = palette.black;
  caption = palette.purple;
}
```

In this example, the `Colors` component maps semantic names to the `Palette` component's color definitions.

Let's change `lightBackground` to `palette.lightPurple` like so:

```Diff
- lightBackground = palette.white;
+ lightBackground = palette.lightPurple;
```

Save your changes to see the background color update in real time! Feel free to experiment with changing other values to see Diez in action.

Note that if you make any changes to the structure of your design token components (e.g. you add/remove a property to any component) you will need to regenerate the SDK (`yarn start ios`), clean your Xcode project (`⌘ + shift + K`), and then build/run (`⌘ + r`).

Please see [The Basics guide](/getting-started/the-basics) for more information on how to compose and edit your design token components.
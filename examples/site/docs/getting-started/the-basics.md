## The basics

### The moving pieces

#### Your Diez Project

Your Diez project is a collection of design token component (DTC) definitions in TypeScript. This is your team's _living_ source of truth for its design system.

#### Diez Complier

The Diez Complier transpiles your project's DTCs into versioned SDKs for each target you specify.

#### Your Diez SDKs

Your Diez SDKs are the output of your Diez project after compilation. For each target you specify, you have a library ready to use within your app's codebase.

#### Diez CLI

The Diez CLI is used to generate your Diez project, cut new versions of your Diez SDKs, initiate the optional hot mode during development, and to extract assets from design files.

### Using Design Token Components to compose your Diez project

To compose your Diez project you will componentize your team's design tokens in order to make them customizable, composable, reusable, and developer-friendly within your consuming codebase(s). TypeScript is used for making these definitions. Read more about that choice [here](/faq/#typescript).

In general, you define `Component`(s) composed of `Property`(ies) and compose them together to create your full "Design System."

```typescript
import {Component, property} from '@diez/engine';

class LayoutValues extends Component {
  @property spacingSmall = 5;
}

export class DesignSystem extends Component {
  @property layoutValues = new LayoutValues();
}
```

For convenience, Diez comes packaged with many prefabs that you can use to define your design token components (DTCs). The prefabs cover common use cases for design tokens.

After compilation the properties defined on your DTCs are available to you along with a number of extensions and helpers to make interacting with them in your host codebase(s) a seamless experience.

Below we'll show how to use prefabs to define your DTCs and compose your Diez project.

#### Colors

Use the `Color` prefab to create color palettes.

```typescript
import {Color} from '@diez/prefabs';

class MyColors extends Component {
  @property purple = Color.rgb(86, 35, 238);
}
```

View the full `Color` API [here](/docs/latest/classes/color.image.html).

#### Images

```typescript
import {Image} from '@diez/prefabs';

class Images extends Component {
  @property logo = Image.responsive('assets/logo.png');
}
```

View the full `Image` API [here](/docs/latest/classes/prefabs.image.html).

#### Typography

Typography is a bit more complicated. You'll need to _compose_ two prefabs (`Font` and `Typograph`) in order to create a text style.

```typescript
import {Font, Typograph} from '@diez/prefabs';

class TextStyles extends Component {
  @property heading1 = new Typograph({
    font: Font.fromFile('assets/SourceSansPro-Regular.ttf'),
    fontSize: 24,
    color: colors.text,
  });
}
```

There are several more prefabs available [here](/docs/latest/modules/prefabs.html), and we will be adding more in due time. Because prefabs are just components, you're able to extend them or contribute back to the mainline as well.

#### Creating custom components

Have something else in mind? You're in luck — Diez was carefully designed with extensibility and customizability as core principles. You're able to use Diez without leveraging _any_ of its prefabs if you so choose — you'll just need to define your own custom components.

Two examples of custom components are demonstrated in example projects [here](https://github.com/diez/diez/blob/master/examples/lorem-ipsum/src/components/Margin.ts) and [here.](https://github.com/diez/diez/blob/master/examples/poodle-surf/src/designs/components/SimpleGradient.ts)

### Next steps

After composing your Diez project you'll need to hook it up to your codebase(s). Platform specific guides are available in the side menu.

Where should your Diez project itself live? This is up to you, but we've found success with this pattern: The Diez project lives in a stand-alone GitHub repo and compiles SDKs into its consumer codebases.

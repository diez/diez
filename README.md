# Diez &middot; [![Build Status](https://travis-ci.com/diez/diez.svg?token=YuETDnVqzQjQytETzD8J&branch=master)](https://travis-ci.com/diez/diez) [![codecov](https://codecov.io/gh/diez/diez/branch/master/graph/badge.svg?token=pgB9U8YLUU)](https://codecov.io/gh/diez/diez)

## The Design Token Framework

Diez is an open-source developer toolkit for building & maintaining [design tokens](https://diez.org/glossary/#tokens) at scale.

Write & maintain styles in one place, then compile & consume them everywhere:  Diez supports any UI component library or codebase written in Swift, Objective-C, Kotlin, Java, TypeScript, JavaScript/JSON, CSS, or SCSS.

Diez reduces the cost of delivering a consistent visual identity across your company's apps & websites.


## What's in the box?

Diez's toolkit comes in three parts:

 - **[Compiler](https://github.com/diez/diez/tree/master/src/compiler)** — Diez includes a novel open-source compiler that converts (transpiles) TypeScript tokens into native packages for iOS, Android, and Web. 
 
   <img src="https://static.haiku.ai/diez/readme/compiler.gif" />

 - **[Framework](https://github.com/diez/diez/tree/master/src/framework)** — Diez's framework is a library of common design token patterns, including pre-written _prefabs_ for Typography, Colors, Images, Drop Shadows, Dimensions, [and more](https://github.com/diez/diez/tree/master/src/framework/prefabs/src).  Prefabs can be configured, nested, and reused to express any style, brand, or theme you can imagine.
 
   <img src="https://static.haiku.ai/diez/readme/framework.png" />
 
   You can also write your own custom prefabs. [Open-source contributions welcome!](https://github.com/diez/diez/blob/master/CONTRIBUTING.md)
  

 - **[Extractors](https://github.com/diez/diez/tree/master/src/extractors)** — Diez's extractors automate the retrieval of design tokens from Figma, Sketch, Adobe XD, and InVision DSM.  These command-line utilities are powerful tools for customizing your own design/developer hand-offs and are a great fit for CI servers.

   <img src="https://static.haiku.ai/diez/readme/extractors.jpg" />


## Getting Started & Installation

Generate a new Diez project with:
```
yarn create diez
```
or 
```
npx diez create
```

**Check out [diez.org/getting-started](https://diez.org/getting-started)** for more thorough installation instructions and a robust set of guides.

## Examples

### Basic example

```TypeScript
const tokens = {
  // Use for all primary type and monochromatic assets.
  foregroundColor: Color.hex('#AE0000'),
  // Use this sparingly, as it's very strong.
  foregroundAccent: Color.hex('#FF0000'),
  // This is our "canvas" color and default background.
  backgroundColor: Color.hex('#231020'),
}
```

The above TypeScript definition will compile to native packages on iOS and Android, where you can access your tokens like:

```Kotlin
tokens.foregroundColor
```

From the above definition, Diez will also generate SCSS variables that can be used like:

```SCSS
#some-element {
  background-color: $tokens-background-color;
}
```

The inline comments and static values will also be built into the native SDKs, where developers can read the comments from autocomplete prompts.

<img src="https://static.haiku.ai/diez/readme/autocomplete-examples.jpg" />


### Semantic tokens example
Diez robustly supports the "semantic tokens" pattern, of separating the _value_ of design tokens from their _semantic purpose,_ for example maintaining a separate set of "raw colors" vs. a semantic mapping of their intended use.

This example also shows one of Diez's several built-in helpers, `[Color].lighten` — these helpers make it easy to avoid duplicating "sources of truth" in your tokens. 

```TypeScript
//colors.ts
import {Color} from '@diez/prefabs';

export const rawColors = {
  tiger: Color.rgba(241, 93, 74, 1),
  marigold: Color.rgba(255, 172, 57, 1),
  clover: Color.rgba(163, 206, 50, 1),
  cyan: Color.rgba(4, 182, 203, 1),
};

export const semanticColors = {
  foreground: rawColors.tiger,
  foreground50: rawColors.tiger.lighten(.5),
  background: rawColors.clover,
  background50: rawColors.clover.lighten(.5),
}
```

### Nesting & reuse example

This slightly more complex example shows how multiple prefabs (in this case `Typograph`, `Color`, and the primitive type `number`) naturally compose to express complex hierarchies of data — without needing to maintain multiple declarations of the same data.

This example also shows how tokens can be separated into multiple files and easily imported/reused.

```TypeScript
//typography.ts
import {Typograph} from '@diez/prefabs';
import {sizes} from './sizes'
import {semanticColors} from './colors' //from example above

export const typography = {
  heading1: new Typograph({
    color: semanticColors.foreground,
    font: fonts.PoppinsExtraBold.Regular,
    fontSize: sizes.xxl 
  }),
  heading2: new Typograph({
    color: semanticColors.foreground50,
    font: fonts.PoppinsExtraBold.Regular,
    fontSize: sizes.xl
  }),
  body: new Typograph({
    color: semanticColors.foreground,
    font: shibuiFonts.Poppins.Regular,
    fontSize: sizes.sm
  })
}
```

```TypeScript
//sizes.ts
export const sizes = {
  xxl: 66,
  xl: 41,
  l: 35,
  md: 24,
  sm: 18,
  xs: 12,
}
```

### Design file Extractor example

From this [example Figma File](https://www.figma.com/file/183VSUg4pC2ZDwk7PK5dLP/FromFigma?node-id=0%3A1):

<img src="https://static.haiku.ai/diez/readme/figma-screenshot.png" />

Diez's Extractor generates design token code that looks like:
```TypeScript
/**
 * GENERATED CODE
 * This file is generated by a Diez Extractor and is not intended to be edited by hand.
 * This file may be overwritten.
 * 
 * FromFigma.ts
 * 
 */
import { Color, DropShadow, File, Font, GradientStop, Image, LinearGradient, Point2D, Typograph } from "@diez/prefabs";

const fromFigmaColors = {
    teal50: Color.rgba(77, 197, 208, 1),
    teal40: Color.rgba(119, 221, 231, 1),
    // abbreviated for terseness
};

const fromFigmaGradients = {
    grad1: new LinearGradient({ stops: [GradientStop.make(0, Color.rgba(141, 245, 255, 1)), GradientStop.make(1, Color.rgba(183, 162, 255, 1))], start: Point2D.make(0.865941961194631, 0.131944384027248), end: Point2D.make(0.105072476657214, 0.937499990588448) })
};

const fromFigmaShadows = {
    shad20: new DropShadow({ offset: Point2D.make(0, 1), radius: 4, color: Color.rgba(0, 0, 0, 0.25) }),
    // abbreviated for terseness
};

export const fromFigmaFonts = {
    Poppins: {
        Bold: Font.fromFile("assets/FromFigma.figma.contents/fonts/Poppins-Bold.otf"),
        Regular: Font.fromFile("assets/FromFigma.figma.contents/fonts/Poppins-Regular.otf")
    }
};

const fromFigmaTypography = {
    heading1: new Typograph({ color: Color.rgba(0, 0, 0, 1), font: fromFigmaFonts.Poppins.Bold, fontSize: 18 }),
    body: new Typograph({ color: Color.rgba(0, 0, 0, 1), font: fromFigmaFonts.Poppins.Regular, fontSize: 12 })
};

export const fromFigmaComponentsFiles = {
    iconFastFoodHotDog: new File({ src: "assets/FromFigma.figma.contents/components/IconFastFoodHotDog.png" }),
    iconFastFoodHotDog2x: new File({ src: "assets/FromFigma.figma.contents/components/IconFastFoodHotDog@2x.png" }),
    iconFastFoodHotDog3x: new File({ src: "assets/FromFigma.figma.contents/components/IconFastFoodHotDog@3x.png" }),
    iconFastFoodHotDog4x: new File({ src: "assets/FromFigma.figma.contents/components/IconFastFoodHotDog@4x.png" }),
    // abbreviated for terseness
};

export const fromFigmaComponents = {
    iconFastFoodHotDog: Image.responsive("assets/FromFigma.figma.contents/components/IconFastFoodHotDog.png", 24, 24),
    iconBinocular: Image.responsive("assets/FromFigma.figma.contents/components/IconBinocular.png", 24, 24),
    // abbreviated for terseness
};

export const fromFigmaTokens = {
    colors: fromFigmaColors,
    gradients: fromFigmaGradients,
    shadows: fromFigmaShadows,
    typography: fromFigmaTypography
};

```

Extracted tokens are intended to be _imported_ and _referenced_ by other files in your project — then updated at will be designers, and extracted again whenever you want.  As another application of "semantic tokens," this separation of concerns allows you to treat design files as versionable code assets.

For example:

```TypeScript
//colors.ts, pulling data right out of Figma
import {fromFigmaColors} from './designs/FromFigma'

const semanticColors = {
  foreground: fromFigmaColors.teal50,
  background: fromFigmaColors.purp60,
}
```


### More Examples

See complete, compilable examples [here](https://github.com/diez/diez/tree/master/examples), or at the Haiku Team's Diez-powered design language, [Shibui.](https://github.com/HaikuTeam/shibui)

When you run `yarn create diez` or `npx diez create`, you will also be given an option to generate a starter project that includes several functional examples.

## FAQ

**What are design tokens?**

Think of design tokens as "design data": concepts like colors, typography definitions, spacings, sizings, and drop shadows — agnostic of any particular design tool or programming language. Design tokens are the basic building blocks that allow you to express any design language as pure data.

The magic of design tokens is they sit right at the gap between design and code — they're design concepts, but since they have no opinions about rendering or technologies, they're adaptable into any codebase with the right tooling (like Diez's cross-platform native compiler).

Design tokens are a community movement and the creators of Diez are actively contributing to the emerging [W3C Design Tokens Community Group and specification.](https://www.w3.org/community/design-tokens/)


**What does the name Diez mean?**

_Diez_ is the Spanish number 10.  This project is called Diez for two reasons:
 - In Spanish, Diez is pronounced roughly like the English letters "D S" — like _design system._ 
 - El Diez is the magic jersey number in soccer/football, reserved for the star player on the team.  We hope Diez is such a time-saver and collaboration-aid for your team that it earns its place as El Diez!
 
We came up with the "codename Diez" during a [Haiku team summit in Patagonia](https://www.haikuforteams.com/blog/remote-team-summit).  Then we decided to make the "codename" the "real name."  And here we are.

**Why TypeScript?**

While design tokens are often expressed in JSON or YAML, TypeScript solves several problems faced when wrangling real-world design tokens:

   - **Complexity:** As codebases grow and change, YAML and JSON get complex and hard to reason about.  With limited or no affordances for multiple files, references, or comments, YAML and JSON quickly snowball into complexity or "no one touch this or it will break everything!" 

   - **Modularity & reuse:** Maintainers of design tokens often find a need to reuse certain chunks of tokens across files.  A common example: a color palette may need to be referenced both in a typography definition and in a panel style — or in both a dark-mode and a light-mode theme.  In these cases, yaml and json leave authors holding the bag — either contrive a module system for JSON, or copy, paste, and pray no one needs to update this again.

   - **Expressions & permutations:** Wouldn't it be nice to store your _core_ color palette once, and to express variations — for example shades and tints, or theme variations — as a function of that core palette?  TypeScript handles all of this out-of-the-box, and Diez offers helpers for variants like `.lighten` and `.darken`.  [See an example here](https://github.com/HaikuTeam/shibui/blob/master/src/Palette.ts#L56)

   - **Hierarchy, branding, and theming:** Real-world design systems often encompass multiple products, brands, and themes.  In the ideal world, your team could maintain a core set of shared values, then extend and override them hierarchically for different layers of your "brand tree."  Thanks to imports, exports, and native code reuse in TypeScript, this is completely doable. *Our team is also hard at work on a [first-class Theming solution within Diez,](https://github.com/diez/diez/issues/30) which makes this set of functionality quicker & easier to manage.*

   - **Stability & scale:** TypeScript was designed for exactly this.  Design tokens are especially fragile because of how they touch multiple codebases and platforms.  Thanks to static typing, typedefs & comments that transpile all the way to iOS and Android, and developer-delighting features like autocomplete popovers — your team can evolve tokens reliably & confidently.

**Find more FAQ [at diez.org/faq](https://diez.org/faq/)**

## Who's behind Diez?

Diez is built by a growing community of contributors and is maintained by [Haiku](https://www.haikuforteams.com) as part of our continuing mission: _to unlock creativity in software by unifying design & code._ 🖖

Read more about Diez at https://diez.org and about Haiku at https://www.haikuforteams.com


## Join the community

Join Diez's [Slack Community](https://join.slack.com/t/dieznative/shared_invite/enQtNzEzNzM2OTg4NDA1LTA4NWZiMTNlZTgzNTY3Yzg2ODdjY2Y1MzBjMjdlY2FlNjljMmI3ZTgzMmQ4ODk1MDdlMTcyMTUzMjNmZWI4YjU) and [Spectrum Community](https://spectrum.chat/diez) to stay in the loop, get support, or share ideas. Feel free also to file a GitHub Issue if you encounter any bugs or would like to share ideas or feature-requests.

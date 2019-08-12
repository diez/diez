## Sketch Guide

### Getting Started

Diez has built-in ability to extract styles and images from design files and turn them into normalized, strongly-typed [Design Token Components (DTCs)](/glossary/#tokens). In this guide, we'll show you how to link a Sketch file and extract its styles.

#### Prerequisites

If you'd like to follow along, please first [create your own Diez project using the official template project](/getting-started/#set-up) which comes with everything set up for you and includes example codebases consuming the design system.

### Linking a Sketch file to your Diez project
From your Diez project root, open the empty `designs/` folder and drop in your Sketch file.

### Setting up your Sketch file for extraction
Your Sketch file will need a little bit of set up work to denote which styles you intend to extract. Diez intentionally limits the elements you can extract to the set of items you reuse across your Sketch file: **Text Styles**, **Document Colors**, **Document Gradients**, **Layer Styles** and **Slices**.

#### Create Document Colors & Gradients to compose your palette
Create a **Document Color** and give it a name. Repeat the same step for all of your colors and gradients.

<video width="27%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/sketch-color.mp4" type="video/mp4">
</video>

#### Create Text Styles for your typography
Create a **Text Style** and give it a name.

<video width="70%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/sketch-text-style.mp4" type="video/mp4">
</video>

#### Create Layer Styles for your shadows
Create a **Text Style** and give it a name.

<video width="70%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/sketch-shadow.mp4" type="video/mp4">
</video>

#### Specify images and icons by marking them for export
Mark any visuals you want to use in your Diez project for export (or create slices of them).

<video width="70%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/sketch-export.mp4" type="video/mp4">
</video>


### Syncing your Sketch file with your Diez project
Make sure to save your changes. Now you're all set up to sync your Sketch file with your Diez project. Head back over to your terminal and within your Diez project folder run:

```bash
yarn diez extract
```

You'll notice a few new updates to your Diez project.

Inside a folder called `/assets/YourSketchFileName.sketch.contents` you'll find the extracted asset files required by your Diez project — `.png`s for each sliced visual at resolutions @1x-@4x, and any font files associated with your Text Styles.

But Diez didn't _only_ extract assets for you, it crafted them into strongly-typed and composable design token components (DTCs)! Take a look in `/src/designs/YourSketchFileName.sketch.ts` and you'll see your clean set of DTCs. And while this set of generated DTCs is just as pretty as the ones you'll create yourself, you won't need to edit it by hand.

#### Integrating your Sketch DTCs into your design system

Import your Sketch DTCs into your main design system file: `/src/DesignSystem.ts`

```typescript
import { yourSketchFileNameTokens } from './designs/YourSketchFileName.sketch';
```

Then use it as you see fit. As shown here, we've used the Document Color from Sketch named `fuss` and set it as the 'lightBackground' color of our design system.

```typescript
class Palette {
  lightBackground = yourSketchFileNameTokens.palette.fuss;
}
```

### Re-syncing a design file

Need to update your designs? Perhaps the best part, is that once you hook it up, all you need to do to resync a design is to re-run `yarn diez extract`!

### Working with teams (designers & developers)

We think this has massive implications for product teams working together. As a designer, you just need to provide your developer with your Sketch file and this guide.

Keeping your Sketch file in sync with your production Diez project will be even easier after Sketch has fully released their [Sketch Teams](https://www.sketch.com/teams/) functionality. Until then the best way to collaborate at scale is by using InVision DSM and Sketch in conjunction. Check out the [InVision DSM Guide](/getting-started/dsm) for more details.

Want to learn more about how to use Diez? Head over to the [Basics Guide](/getting-started/the-basics).

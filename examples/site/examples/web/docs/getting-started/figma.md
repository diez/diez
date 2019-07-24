## Figma Guide

### Getting Started

Diez has built-in ability to extract styles and images from design files and turn them into normalized, strongly-typed [Design Token Components (DTCs)](/glossary/#tokens). In this guide, we'll show you how to link a Figma file and extract its styles.

#### Prerequisites

If you'd like to follow along, please first [create your own Diez project using the official template project](/getting-started/#set-up) which comes with everything set up for you and includes example codebases consuming the design system.

### Linking a Figma file to your Diez project
From your Diez project root, open a file called `.diezrc`.

Every Figma file has a unique URL associated with it. Put your Figma file url in the `"services"` array. It should now look something like this:

```json
{
  "designs": {
    "services": ["https://www.figma.com/file/I1LjlbMJYa2cRVetGYgXsYhq/YourFigmaProjName?node-id=0%3A1"]
  }
}
```

<div class="note">(Be sure to put the URL in double-quotes as shown.)</div>

### Setting up your Figma file for extraction
Your Figma file will need a little bit of set up work to denote which styles you intend to extract. Diez intentionally limits the elements you can extract to the set of items you reuse across your Figma projects, libraries, files; i.e. **Components**, **Color Styles**, and **Text Styles**.

<div class="aside"><i><strong>Gotcha Warning</strong></i>: Note that your file must have every Figma Style and Figma Component you intend to use instantiated on the canvas. This is a current limitation of the Figma API and might change in the future.</div>

#### Create Color Styles to compose your palette
Create a Figma "Color Style" and give it a name.

<video width="80%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/color-style.mp4" type="video/mp4">
</video>

#### Create Text Styles for your typography
Create a Figma "Text Style" and give it a name.

<video width="80%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/text-style.mp4" type="video/mp4">
</video>

#### Specify images and icons by turning them into "Components"
Turn any visuals you want to use in your Diez project into Figma "Components."

<video width="80%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/images.mp4" type="video/mp4">
</video>


### Syncing your Figma file with your Diez project
Now you're all set up to sync your Figma file with your Diez project. Head back over to your Diez project folder within your terminal and run:

```bash
yarn diez extract
```

After authenticating Diez with your Figma account, you'll notice a few new updates to your Diez project.

Inside a folder called `/assets/YourFigmaProjName.figma.contents` you'll find the extracted asset files required by your Diez project — `.png`s for each Figma "component" at resolutions @1x-@4x, and any font files associated with your Figma Text Styles.

But Diez didn't _only_ extract assets for you, it crafted them into strongly-typed and composable design token components (DTCs)! Take a look in `/src/designs/YourFigmaProjName.figma.ts` and you'll see your clean set of DTCs. And while this set of generated DTCs is just as pretty as the ones you'll create yourself, you won't need to edit it by hand.

#### Integrating your Figma DTCs into your design system

Import your Figma DTCs into your main design system file: `/src/DesignSystem.ts`

```typescript
import { yourFigmaProjNameTokens } from './designs/YourFigmaProjName.figma';
```

Then use it as you see fit. As shown here, we've used the Color Style from Figma named `fuss` and set it as the 'lightBackground' color of our design system.

```typescript
class Palette extends Component {
  @property lightBackground = yourFigmaProjNameTokens.palette.fuss
}
```

### Re-syncing a design file

Need to update your designs? Perhaps the best part, is that once you hook it up, all you need to do to resync a design is to re-run `yarn diez extract`!

<video width="100%" autoplay loop muted playsinline>
    <source src="@theme/assets/vids/figma-short.mp4" type="video/mp4">
</video>
<div class="note">Shown above in the demo web app. Keep in mind that this works for iOS and Android codebases as well.</div>

### Working with teams (designers & developers)

We think this has massive implications for product teams working together. As a designer, you just need to provide your developer with your Figma file URL and ensure she has permissions. As a developer, you just to create a free Figma account and perform the trivial setup outlined in this guide.

After that ongoing updates to your design system are as simple as running `yarn diez extract`!

Want to learn more about how to use Diez? Head over to the [Basics Guide](/getting-started/the-basics).

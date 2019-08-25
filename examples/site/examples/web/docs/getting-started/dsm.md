## InVision DSM Guide

### Getting Started

Diez has the ability to extract styles from InVision DSM and turn them into normalized, strongly-typed [Design Token Components (DTCs)](/glossary/#tokens). In this guide, we'll show you how to link a DSM project and extract its styles.

#### Prerequisites

If you'd like to follow along, please first [create your own Diez project using the official template project](/getting-started/#set-up) which comes with everything set up for you and includes example codebases consuming the design system.


### Linking a DSM project to your Diez project
Open your InVision DSM project on the web and navigate to the code icon in the top bar (*it looks like this*: `</>`) and choose **Design tokens** from its dropdown menu. From there, choose **JSON** from the side menu on the left. In the page's first section (**Styles**), copy the unique API endpoint associated with your DSM project. 

Now navigate back to your Diez project root; open a file called `.diezrc`.

Put your DSM project url in the `"services"` array. It should now look something like this:

```json
{
  "designs": {
    "services": ["https://projects.invisionapp.com/dsm-export/my-team/proj-name/style-data.json?exportFormat=list&key=ryVazK2NB"]
  }
}
```

<div class="note">(Be sure to put the URL in double-quotes as shown.)</div>

### Preparing your DSM project for extraction
First make sure your DSM project is fully fleshed out. [Learn how to use DSM with your Sketch files here](https://support.invisionapp.com/hc/en-us/articles/115005685166). 

Diez has the power to extract **Color Styles**, **Text Styles**, and **Fonts** from DSM. Support for **Images** will be coming soon. In the future we will be able to pull in additional pieces (e.g. **Shadows**) should the InVision DSM API response add support for **Layer Styles**.

<div class="aside"><i><strong>Gotcha Warning</strong></i>: Note that your <strong>Colors</strong> must be nested within a additional custom folder within the top-level <strong>Colors</strong> folder in order to come through. (This is a limitation of the DSM API response.)</div>

### Syncing your DSM project with your Diez project
Now you're all set up to sync your DSM project with your Diez project. Head back over to your terminal and within your Diez project folder run:

```bash
yarn diez extract
```

Inside a new folder `./assets/YourDSMProjName.invision.contents` you'll find the extracted font files associated with your Text Styles.

But Diez didn't _only_ extract assets for you, it crafted them into strongly-typed and composable design token components (DTCs). Take a look in `./src/designs/YourDSMProjName.invision.ts` and you'll see your clean set of DTCs. And while this set of generated DTCs is just as pretty as the ones you'll create yourself, you won't need to edit it by hand.

#### Integrating your DSM DTCs into your design system

Import your DSM DTCs into your main design system file: `./src/DesignSystem.ts`

```typescript
import { yourDSMProjNameTokens } from './designs/YourDSMProjName.invision';
```

Then use it as you see fit. As shown here, we've used the Color Style from DSM named `fuss` and set it as the 'lightBackground' color of our design system.

```typescript
class Palette {
  lightBackground = yourDSMProjNameTokens.colors.fuss
}
```

### Re-syncing a design file

Need to update your designs? Perhaps the best part is that once you hook it up, all you need to do to resync is to re-run `yarn diez extract`!

### Working with teams (designers & developers)

We think this has massive implications for product teams working together. As a designer, you just need to provide your developer with your DSM project URL and ensure she has permissions. As a developer, you just need to perform the trivial setup outlined in this guide.

After that ongoing updates to your production design system are as simple as running `yarn diez extract`!

Want to learn more about how to use Diez? Head over to the [Basics Guide](/getting-started/the-basics).

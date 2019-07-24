## Integrating a Diez project into an existing Web application (CSS/Sass)

### Requirements and installation

Diez works in macOS, Windows, and Linux and only requires Node.js >= 7.10.1. For specific instructions on how to install Diez please refer to the [Set Up guide](/getting-started/#set-up).

This guide assumes that you already have a Diez project. If you don't have one, you can generate a starter project by running:

```bash
$ yarn create diez my-project
$ cd my-project
```

### Diez as a library

The output of the Diez compiler for a specific target is a library that is ready to use. For Web with CSS/Sass, this is `.css` and `.scss` files ready to import.

Generally, you'll have a folder that contains your design system definitions and a separate folder with your web project.

After you [compile](#compiling) your project, a Node package with your design system will be generated in a location relative to the current working directory at `build/diez-<name>-web`, `where <name>` is the name of your Diez project in kebab case. You can use this package like any Node dependency: you can link it, publish it to NPM, or deploy it to Git.

Then, install our Webpack plugin: `diez-webpack-plugin`:

<CodeTabs>
```bash tabname-yarn
$ yarn add -D diez-webpack-plugin
```
```bash tabname-npm
$ npm install --save-dev diez-webpack-plugin
```
</CodeTabs>

And include it in your Webpack config:

```js
const DiezWebpackPlugin = require('diez-webpack-plugin');

module.exports = {
  plugins: [new DiezWebpackPlugin({sdk: 'my-project'})],
};
```

With this, you are ready to `import` a file containing all your [Design Token Components](/glossary#tokens).

<CodeTabs>
```CSS
@import('diez-my-project');

.selector {
  background: var(--colors-purple);
}
```
```Sass
@import 'diez-my-project';

.selector {
  background: $colors-purple;
}
```
</CodeTabs>

<div class="note">We are building support for Less and Stylus, check back soon!</div>

### Compiling

The Diez compiler can compile your design system in two modes: _normal_ and _hot_.

#### Development flow

`hot` mode is used for development and will watch your Diez project for file changes and hot reload your code.

`hot` mode also comes with an integrated development server that will take care of serving assets like images and fonts for you.

To start your development server you can run:

```bash
$ diez hot -t web
```

#### Build flow

Once you are ready to build your application, you need to compile your files:

```bash
$ diez compile
```

You can always inspect the output by digging into the `build` folder after building.

### Interacting with Prefabs

Diez comes packaged with many prefabs that you can use to define your [Design Token Components (DTCs)](/glossary#tokens). All of the properties defined on these components are available to you along with a number of extensions and helpers to make interacting with these components as seamless as possible.

#### [Color](/docs/latest/classes/prefabs.color.html)

`Color`s can be directly consumed as variables:

<CodeTabs>
```CSS
.selector {
  color: var(--palette-purple);
}
```
```Sass
.selector {
  color: $palette-purple;
}
```
</CodeTabs>

Or via multiple built-in `@mixins` and classes:

<CodeTabs>
```HTML
<div class="palette-purple-background-color"></div>
```
```Sass
.selector {
  @include palette-purple-background-color;
}
```
</CodeTabs>

#### [LinearGradient](/docs/latest/classes/prefabs.lineargradient.html)

Linear gradients can be consumed via variables:

<CodeTabs>
```CSS
.selector {
  background: var(--my-gradient);
}
```
```Sass
.selector {
  background: $my-gradient;
}
```
</CodeTabs>

The SDK also provides classes and `@mixins` that define `background` and `background-image` for you:

<CodeTabs>
```HTML
<div class="my-gradient-background"></div>
```
```Sass
.selector {
  @include my-gradient-background;
}
```
</CodeTabs>

#### [Image](/docs/latest/classes/prefabs.image.html)

For `Image`s, the SDK provides variables for:

- The URL in three sizes (`-url`, `-url-2x` and `-url3x`).
- The size of the image, via `-width` and `-height`.

<CodeTabs>
```CSS
.selector {
  background: var(--my-image-url-2x);
  width: var(--my-image-width);
}
```
```Sass
.selector {
  background: $my-image-url-2x;
  width: $my-image-width;
}
```
</CodeTabs>

The SDK also includes a `background-image` helper, which automatically sets width, height and the proper image size for the screen resolution.

<CodeTabs>
```HTML
<div class="my-image-background-image"></div>
```
```Sass
.selector {
  @include my-image-background-image;
}
```
</CodeTabs>

#### [Typograph](/docs/latest/classes/prefabs.typograph.html)

Using a `Typograph` is a matter of using the corresponding `@mixin` or class:

<CodeTabs>
```HTML
<h2 class="typography-heading-two"></h2>
```
```Sass
.selector {
  @include typography-heading-two;
}
```
</CodeTabs>

Depending on how you declared your `Typograph`s in your Diez project, the SDK may also include `@font-face` declarations to ensure that all font families are ready to use.

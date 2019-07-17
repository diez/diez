## Integrating a Diez Project into an existing Web application (JavaScript)

<div class="aside">
This guide is currently being written. Please check back soon!
</div>

<!--

### Requirements and installation

Diez works in macOS, Windows, and Linux and only requires Node.js >= 7.10.1. For specific instructions on how to install Diez please refer to the [Set Up guide](/getting-started/#set-up).

This guide assumes that you already have a Diez project. If you don't have one, you can generate a starter project by running:

```bash
$ yarn create diez-project my-project
$ cd my-project
```

### Diez as a library

The output of the Diez compiler for a specific target is a library that is ready to use. For Web with JavaScript, this means that you can consume your Design System by `import`ing it.

```
// Import your DesignSystem and Diez
import {DesignSystem, Diez} from 'diez-my-project';

// Create a new Diez instance providing your DesignSystem as a source
const diezDs = new Diez(DesignSystem);

// Listen to changes in the design system
diezDs.attach((ds) => {
  // the ds has been updated!
});
```

In a typical setup, you'll have a folder that contains your design system definitions and a separate folder with your web project.

To use the compiled files in your project, you need to add the design system as a local dependency to your project, in your `package.json`:

```
dependencies: {
  "diez-my-project": "./your/project/path"
}
```

The Diez compiler can compile your design system in two modes: normal and hot.

#### Development flow

`hot` mode is used for development and will watch your Diez project for file changes and hot reload your code.

`hot` mode also comes with an integrated development server that will take care of serving assets like images and fonts for you.

To start your development server you can run:

```
$ diez hot -t web
```

#### Build flow

Once you are ready to build your application, you need to compile your files:

```
$ diez compile
```

### Interacting with Prefabs

Diez comes packaged with many prefabs that you can use to define your [Design Token Components (DTCs)](/glossary#tokens). All of the properties defined on these components are available to you along with a number of extensions and helpers to make interacting with these components as seamless as possible.

#### [Color](TODO:)

```javascript
```

#### [Image](TODO:)

```javascript
```

#### [Lottie](TODO:)

```javascript
```

#### [Typograph](TODO:)

-->
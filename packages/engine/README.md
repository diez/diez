# `@diez/engine`

The Diez engine provides the basic building block of Diez packages:

 - A Diez `Component` class which can be extended to define cross-platform components.
 - Decorators like `@property` which can endow components with properties.
 - A thin runtime engine which is capable of observing and patching component hosts based on state changes.

Diez components generally should be composed with nested components and primitive values in order to produce semantic and readable component hierarchies. See [here](https://github.com/diez/diez/blob/master/examples/poodle-surf/src/DesignSystem.ts) for some advanced examples of how components can be composed to build a design system.

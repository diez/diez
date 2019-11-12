# `@diez/engine`

The Diez engine provides the basic building block of Diez packages:

 - A Diez `prefab<T>` class factory which can be used to define cross-platform prefabs.
 - A thin serialization engine which obeys simple serialization instructions for prefabs.

Diez components generally should be composed with nested components and primitive values in order to produce semantic and readable component hierarchies. See [here](https://github.com/diez/diez/blob/master/examples/poodle-surf/src/DesignLanguage.ts) for some advanced examples of how components can be composed to build a design language.

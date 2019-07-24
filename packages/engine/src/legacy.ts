/**
 * It is no longer necessary for Diez components to extend a base `Component` class.
 *
 * This empty class is provided here for backward compatibility.
 * @deprecated since version 10.0.0-beta.3
 * @ignore
 */
export class Component<T = any> {}

/**
 * It is no longer necessary for Diez components to declare properties using the `@property` decorator.
 *
 * This null decorator is provided here for backward compatibility.
 * @deprecated since version 10.0.0-beta.3
 * @ignore
 */
export const property = () => {
  console.warn('It is no longer necessary for Diez components to declare properties using the `@property` decorator.');
};

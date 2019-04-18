declare module 'typed-errors' {
  function makeTypedError(name: string): ErrorConstructor;

  export {makeTypedError};
}

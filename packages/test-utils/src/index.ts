/* tslint:disable:no-namespace */
export * from './utils';
export * from './expectations';

/**
 * The Jest root provided by this module.
 *
 * Used to deliver mocks to other modules that need them.
 */
export const jestRoot = __dirname;

/**
 * Augment jest expectations with our types.
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toExist (): R;
      toMatchFile (goldenFile: string): R;
      toMatchDirectory (goldenDirectory: string): R;
    }
  }
}

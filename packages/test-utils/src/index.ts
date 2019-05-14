/* tslint:disable:no-namespace */
export * from './utils';
export * from './expectations';
export * from './mocks';

/**
 * Augment jest expectations with our types.
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toExist (): R;
      toMatchFile (goldenFile: string): R;
      toMatchDirectory (goldenDirectory: string, blacklist?: Set<string>): R;
    }
  }
}

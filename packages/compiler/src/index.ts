export * from './api';
export * from './compiler';
export * from './utils';
export * from './server';

declare module '@diez/engine/types/api' {
  /**
   * Extends PropertyOptions for the compiler.
   */
  export interface PropertyOptions {
    /**
     * The set of targets a property should target.
     */
    targets: string[];
  }
}

import {CompilerProvider} from '@diez/compiler-core';
import {Target} from '@diez/engine/types/api';
import {docsHandler as handler} from './docs.compiler';

declare module '@diez/engine/types/api' {
  /**
   * Declare docs as a valid target.
   */
  export const enum Target {
    Docs = 'docs',
  }
}

const target: CompilerProvider = {
  handler,
  name: Target.Docs,
};

export = target;

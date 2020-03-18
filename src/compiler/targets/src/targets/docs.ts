import {CompilerProvider} from '@diez/compiler-core';
import {Target} from '@diez/engine/types/api';
import {docsHandler as handler} from './docs.compiler';

const target: CompilerProvider = {
  handler,
  name: Target.Docs,
};

export = target;

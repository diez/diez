import {provideCommand} from '@livedesigner/cli';
import {compileAction} from './compile.action';

export = provideCommand(
  'compile',
  'Compile a local Diez project.',
  compileAction,
);

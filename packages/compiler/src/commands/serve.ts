import {provideCommand} from '@livedesigner/cli';
import {serveAction} from './serve.action';

export = provideCommand(
  'serve',
  'Hot-serve a local Diez project.',
  serveAction,
);

import {provideCommand} from '@livedesigner/cli';
import {serveAction} from './serve.action';

export = provideCommand(
  'serve',
  'Serves the current directory.',
  serveAction,
);

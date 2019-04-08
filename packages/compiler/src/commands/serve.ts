import {CliCommandProvider} from '@livedesigner/cli';
import {serveAction as action} from './serve.action';

const provider: CliCommandProvider = {
  action,
  name: 'serve',
  description: 'Hot-serve a local Diez project.',
};

export = provider;

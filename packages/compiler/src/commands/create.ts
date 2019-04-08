import {CliCommandProvider} from '@livedesigner/cli';
import {createProjectAction as action} from './create.action';

const provider: CliCommandProvider = {
  action,
  name: 'create [projectName]',
  description: 'Creates a Diez project.',
};

export = provider;

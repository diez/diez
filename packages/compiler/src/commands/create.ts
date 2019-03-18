import {provideCommand} from '@livedesigner/cli';
import {createProject} from './create.action';

export = provideCommand(
  'create [project-name]',
  'Creates a Diez project.',
  createProject,
);

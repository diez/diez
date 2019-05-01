import {createProject} from '@diez/compiler';
import enquirer from 'enquirer';
import {join} from 'path';
import {root} from '../internal/helpers';

export = {
  name: 'create-example',
  description: 'Creates an example project in the monorepo.',
  action: async () => {
    interface Answers {
      exampleName: string;
    }

    const exampleName = (await enquirer.prompt<Answers>({
      type: 'input',
      name: 'exampleName',
      message: 'Enter example project name.',
    })).exampleName;

    await createProject(exampleName, join(root, 'examples'));
  },
};

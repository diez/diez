import {createProject} from '@diez/createproject';
import enquirer from 'enquirer';
import {readJsonSync, writeJsonSync} from 'fs-extra';
import {join} from 'path';
import {root} from '../internal/helpers';

export = {
  name: 'create-example',
  description: 'Creates an example project in the monorepo.',
  loadAction: () => async () => {
    interface Answers {
      exampleName: string;
    }

    const exampleName = (await enquirer.prompt<Answers>({
      type: 'input',
      name: 'exampleName',
      message: 'Enter example project name.',
    })).exampleName;

    await createProject(exampleName, ['android', 'ios', 'web'], join(root, 'examples'));
    const packageJsonPath = join(root, 'examples', exampleName, 'package.json');
    const packageJson = readJsonSync(packageJsonPath);
    packageJson.private = true;
    writeJsonSync(packageJsonPath, packageJson, {spaces: 2});
  },
};

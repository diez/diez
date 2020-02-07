/**
 * Copyright (c) 2019-present, Haiku Systems, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {kebabCase} from 'change-case';
import {prompt} from 'enquirer';
import {createProject} from '../utils';

interface Answers {
  projectName: string;
}

interface CreateOptions {
  bare: boolean;
}

export = async ({bare}: CreateOptions, projectNameIn: string) => {
  // This array is typed as `any[]` because enquirer's TypeScript definitions aren't quite correct.
  // @see {@link https://github.com/enquirer/enquirer/pull/82}
  const questions: any[] = [];
  let projectName = projectNameIn;

  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      required: true,
      message: 'Enter the name for your Diez project. A directory will be created if it does not already exist.',
    });

    const answers = await prompt<Answers>(questions);
    projectName = answers.projectName;
  }

  return await createProject(
    kebabCase(projectName),
    bare,
  );
};

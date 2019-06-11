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
  createExamples: string;
}

export = async (_: {}, projectName: string) => {
  // This array is typed as `any[]` because enquirer's TypeScript definitions aren't quite correct.
  // @see {@link https://github.com/enquirer/enquirer/pull/82}
  const questions: any[] = [];

  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      required: true,
      message: 'Enter the name for your Diez project. A directory will be created if it does not already exist.',
    });
  }

  questions.push({
    type: 'select',
    name: 'createExamples',
    message: 'Create example codebases for Android, iOS, and Web? Select with arrow keys and submit with Enter.',
    choices: [
      {message: 'Yes'},
      {message: 'No'},
      {message: 'Let me choose'},
    ],
  });

  const answers = await prompt<Answers>(questions);
  const examples = [];
  switch (answers.createExamples) {
    case 'Yes':
      examples.push('android', 'ios', 'web');
      break;
    case 'No':
      break;
    default:
      const choiceAnswers = await prompt<{createExamples: string[]}>({
        type: 'multiselect',
        name: 'createExamples',
        message:
          'Selected example codebases will be created. Select with arrow keys, toggle with space bar, and submit with Enter.',
        choices: [
          {name: 'Android'},
          {name: 'iOS'},
          {name: 'Web'},
        ],
      });
      examples.push(...choiceAnswers.createExamples.map((choice) => choice.toLowerCase()));
      break;
  }

  createProject(
    kebabCase(projectName || answers.projectName),
    examples,
  );
};

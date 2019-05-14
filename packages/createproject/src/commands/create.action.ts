/**
 * Copyright (c) 2019-present, Haiku Systems, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import enquirer from 'enquirer';
import {createProject} from '../utils';

interface Answers {
  projectName: string;
}

/**
 * The entry point for project generation.
 * @ignore
 */
export const createProjectAction = async (_: {}, projectName: string) => {
  if (projectName) {
    createProject(projectName);
    return;
  }

  createProject((await enquirer.prompt<Answers>({
    type: 'input',
    name: 'projectName',
    required: true,
    message: 'Enter your project\'s name. Your project directory will be created if it does not already exist.',
  })).projectName);
};

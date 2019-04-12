/**
 * Copyright (c) 2019-present, Haiku Systems, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {devDependencies, diezVersion, fatalError, warning} from '@livedesigner/cli';
import {outputTemplatePackage} from '@livedesigner/storage';
import enquirer from 'enquirer';
import {ensureDirSync, existsSync, lstatSync} from 'fs-extra';
import pascalCase from 'pascal-case';
import {basename, join, resolve} from 'path';
import validateNpmPackageName from 'validate-npm-package-name';
import {shouldUseYarn} from '..';
import {canUseNpm, runPackageScript} from '../utils';

interface Answers {
  projectName: string;
}

const validatePackageName = (packageName: string) => {
  const validationResult = validateNpmPackageName(packageName);
  if (!validationResult.validForNewPackages) {
    const warnings = [];
    if (validationResult.errors) {
      warnings.push(...validationResult.errors.map((message) => ` - ${message}`));
    }
    if (validationResult.warnings) {
      warnings.push(...validationResult.warnings.map((message) => ` - ${message}`));
    }

    if (warnings.length) {
      warning('Project name validation failed:');
      warnings.forEach(warning);
    }

    fatalError(`Unable to create project with name ${packageName}.`);
  }
};

const validateProjectRoot = async (root: string, useYarn = false) => {
  if (existsSync(root) && !lstatSync(root).isDirectory()) {
    fatalError(`Found a non-directory at ${root}.`);
  }

  ensureDirSync(root);
  if (existsSync(join(root, 'package.json'))) {
    fatalError(`A Node.js project already exists at ${root}.`);
  }

  if (useYarn) {
    return;
  }

  if (!await canUseNpm(root)) {
    fatalError(`Unable to start an NPM process in ${root}.`);
  }
};

export const createProjectAction = async (_: {}, projectName: string) => {
  let packageName = projectName;
  if (!packageName) {
    packageName = (await enquirer.prompt<Answers>({
      type: 'input',
      name: 'projectName',
      required: true,
      message: 'Enter your project\'s name. Your project directory will be created if it does not already exist.',
    })).projectName;
  }

  validatePackageName(packageName);

  const useYarn = await shouldUseYarn();
  const root = resolve(process.cwd(), basename(packageName));
  await validateProjectRoot(root, useYarn);

  const templateRoot = resolve(__dirname, '..', '..', 'templates', 'project');
  const tokens = {
    packageName,
    diezVersion,
    typescriptVersion: devDependencies.typescript,
    componentName: pascalCase(basename(packageName)),
  };

  outputTemplatePackage(templateRoot, root, tokens);

  await runPackageScript('install', useYarn, root);
  // TODO: finalize template project.
  // TODO: print instructions.
};

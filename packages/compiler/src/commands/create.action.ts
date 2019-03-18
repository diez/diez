/**
 * Copyright (c) 2019-present, Haiku Systems, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {devDependencies, diezVersion, fatalError, warning} from '@livedesigner/cli';
import {exec} from 'child_process';
import enquirer from 'enquirer';
import {ensureDirSync, existsSync, lstatSync, readFileSync, writeFileSync} from 'fs-extra';
import {walkSync} from 'fs-walk';
import {compile} from 'handlebars';
import pascalCase from 'pascal-case';
import {basename, join, relative, resolve} from 'path';
import validateNpmPackageName from 'validate-npm-package-name';

interface Answers {
  projectName: string;
}

const shouldUseYarn = async () => new Promise<boolean>((resolvePromise) => {
  exec('yarnpkg --version', (error) => {
    resolvePromise(!error);
  });
});

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

const validateProjectRoot = (root: string, useYarn = false) => {
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

  // TODO: check that NPM can read CWD.
  // tslint:disable-next-line: max-line-length
  // See https://github.com/facebook/create-react-app/blob/7864ba3ce70892ebe43d56487b45d3267890df14/packages/create-react-app/createReactApp.js#L826.
};

export const createProject = async (projectName?: string) => {
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
  const root = resolve(basename(packageName));
  const originalDirectory = process.cwd();
  validateProjectRoot(root, useYarn);

  const templateRoot = resolve(__dirname, '..', '..', 'templates', 'project');
  const tokens = {
    packageName,
    diezVersion,
    typescriptVersion: devDependencies.typescript,
    componentName: pascalCase(basename(packageName)),
  };

  walkSync(templateRoot, (basedir, filename, stats) => {
    if (!stats.isFile()) {
      return;
    }

    const outputDirectory = resolve(root, relative(templateRoot, basedir));
    ensureDirSync(outputDirectory);
    writeFileSync(
      join(outputDirectory, filename),
      compile(readFileSync(resolve(basedir, filename)).toString())(tokens),
    );
  });
};

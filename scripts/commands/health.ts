import {fatalError} from '@diez/cli-core';
import {run, runQuiet} from '../internal/helpers';

export= {
  name: 'health',
  description: 'Executes monorepo health checks.',
  action: async () => {
    const gitChanges = runQuiet('git diff yarn.lock');
    if (gitChanges) {
      fatalError('Found untracked Git changes in `yarn.lock`. Be sure to stage and commit all `yarn.lock` changes.');
    }

    // Ensures docs are generated without errors.
    const docs = runQuiet('yarn docs');
    if (docs.includes('Error:')) {
      fatalError('Generating docs produced an error. Please fix the issue and try again.');
    }

    // Run health checks in all packages.
    run('yarn lerna run health --stream');

    // Build web examples.
    run('yarn build-examples --target web');
  },
};

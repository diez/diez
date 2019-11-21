import {assertNotWatching, run, runQuiet} from '../internal/helpers';

export= {
  name: 'health',
  description: 'Executes monorepo health checks.',
  loadAction: () => async () => {
    assertNotWatching();
    const gitChanges = runQuiet('git diff yarn.lock');
    if (gitChanges) {
      throw new Error('Found untracked Git changes in `yarn.lock`. Be sure to stage and commit all `yarn.lock` changes.');
    }

    // Ensures docs are generated without errors.
    const docs = runQuiet('yarn docs');
    if (docs.includes('Error:')) {
      throw new Error('Generating docs produced an error. Please fix the issue and try again.');
    }

    // Run health checks in all packages.
    run('yarn lerna run health --parallel');

    // Build web examples.
    run('yarn build-examples --target web');
  },
};

import chalk from 'chalk';
import {root, run} from '../internal/helpers';

export= {
  name: 'health',
  description: 'Executes monorepo health checks.',
  action: async () => {
    const gitChanges = run('git diff yarn.lock', root, 'pipe');
    if (gitChanges && gitChanges.toString()) {
      console.log(
        chalk.red('Found untracked Git changes in `yarn.lock`. Be sure to stage and commit all `yarn.lock` changes.'));
      process.exit(1);
    }

    // Ensures docs are generated without errors.
    const docs = run('yarn docs', root, 'pipe');
    if (!docs || docs.toString().includes('Error:')) {
      console.log(chalk.red('Generating docs produced an error. Please fix the issue and try again.'));
      process.exit(1);
    }

    // Run health checks in all packages.
    run('yarn lerna run health --stream');

    // Build web examples.
    run('yarn build-examples --target web');
  },
};

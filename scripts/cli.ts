import commander from 'commander';
import {createPackage} from './commands/create-package';
import {currentVersion} from './internal/helpers';

commander.version(currentVersion);

commander
  .command('create-package [registry]')
  .description('Create a Diez package.')
  .action(createPackage);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}

commander.parse(process.argv);

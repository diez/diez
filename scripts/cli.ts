import commander from 'commander';
import {buildExamples} from './commands/build-examples';
import {clean} from './commands/clean';
import {createPackage} from './commands/create-package';
import {generateDocs} from './commands/generate-docs';
import {watch} from './commands/watch';
import {currentVersion} from './internal/helpers';

commander.version(currentVersion);

commander
  .command('watch')
  .description('Watches TypeScript sources in the monorepo and automatically compiles changes.')
  .action(watch);

commander
  .command('create-package [registry]')
  .description('Create a Diez package.')
  .action(createPackage);

commander
  .command('generate-docs')
  .description('Generate docs.')
  .action(generateDocs);

commander
  .command('clean')
  .description('Clean automatically generated files from workspaces.')
  .action(clean);

commander
  .command('build-examples')
  .description('Build example projects.')
  .option('--target <target>')
  .action(buildExamples);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}

commander.on('command:*', () => {
  commander.outputHelp();
  process.exit();
});

commander.parse(process.argv);

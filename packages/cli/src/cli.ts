/* tslint:disable no-var-requires */
import {args, command, help, on, parse, version} from 'commander';
import {join} from 'path';
import {CliCommandProvider} from '.';
import {findPluginsWithPrefix} from './utils';

version(require(join('..', 'package.json')).version).name('diez');

const registerWithProvider = (provider: CliCommandProvider) => {
  command(provider.command).description(provider.description).action(provider.action);
};

findPluginsWithPrefix('cli').then((plugins) => {
  for (const plugin of plugins) {
    try {
      // By convention, CLI plugins provide their CLI hooks as the default export from lib/cli.
      const {default: provider} = require(`${plugin}/lib/cli`);
      registerWithProvider(provider);
    } catch (error) {
      // Noop.
    }
  }

  on('command:*', () => {
    help();
  });

  parse(process.argv);
});

/* tslint:disable no-var-requires */
import {args, command, help, on, parse, version} from 'commander';
import {join} from 'path';
import {CliCommandProvider} from '.';
import {findPlugins} from './utils';

version(require(join('..', 'package.json')).version).name('diez');

const registerWithProvider = (provider: CliCommandProvider) => {
  command(provider.command).description(provider.description).action(provider.action);
};

findPlugins().then((plugins) => {
  for (const [plugin, {cli}] of plugins) {
    if (cli === undefined) {
      continue;
    }

    try {
      // CLI plugins provide their CLI hooks as the default export.
      const {default: provider} = require(join(plugin, cli));
      registerWithProvider(provider);
    } catch (error) {
      // Noop.
    }
  }

  on('command:*', () => {
    help();
  });

  parse(process.argv);
  if (!args.length) {
    help();
  }
});

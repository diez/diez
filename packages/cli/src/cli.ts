/* tslint:disable no-var-requires */
import {args, command, help, on, parse, version} from 'commander';
import {join} from 'path';
import {CliCommandProvider} from '.';
import {fatalError} from './reporting';
import {findPlugins} from './utils';

version(require(join('..', 'package.json')).version).name('diez');

const registerWithProvider = (provider: CliCommandProvider) => {
  command(provider.command)
    .description(provider.description)
    .action(async (...actionArguments: string[]) => {
      try {
        await provider.action.call(undefined, ...actionArguments);
      } catch (error) {
        fatalError(error.message);
      }
    });
};

(async () => {
  const plugins = await findPlugins();
  for (const [plugin, {cli}] of plugins) {
    if (cli === undefined) {
      continue;
    }

    try {
      for (const path of cli.providers) {
        registerWithProvider(require(join(plugin, path)));
      }
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
})();

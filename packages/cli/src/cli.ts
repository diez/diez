/* tslint:disable no-var-requires */
import {args, command, help, on, parse, version} from 'commander';
import {join} from 'path';
import {CliCommandProvider} from '.';
import {fatalError} from './reporting';
import {diezVersion, findPlugins} from './utils';

version(diezVersion).name('diez');

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

export const bootstrap = async () => {
  const plugins = await findPlugins();
  for (const [plugin, {cli}] of plugins) {
    if (cli === undefined) {
      continue;
    }

    try {
      for (const path of cli.commandProviders) {
        registerWithProvider(require(join(plugin, path)));
      }
    } catch (error) {
      // Noop.
    }
  }
};

export const run = async () => {
  await bootstrap();
  on('command:*', () => {
    help();
  });

  parse(process.argv);
  if (!args.length) {
    help();
  }
};

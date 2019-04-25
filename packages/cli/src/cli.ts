/* tslint:disable no-var-requires */
import {args, command, help, on, parse, version} from 'commander';
import {CliCommandProvider} from './api';
import {fatalError} from './reporting';
import {cliRequire, diezVersion, findPlugins} from './utils';

version(diezVersion).name('diez');

/**
 * @internal
 */
const registerWithProvider = (provider: CliCommandProvider) => {
  const validators: (() => void)[] = [];
  const registeredCommand = command(provider.name)
    .description(provider.description)
    .action(async (...options: any[]) => {
      try {
        for (const validator of validators) {
          await validator();
        }
        await provider.action.call(undefined, registeredCommand, ...options);
      } catch (error) {
        fatalError(error.message);
      }
    });

  if (provider.options) {
    for (const option of provider.options) {
      let optionText = option.shortName ? `-${option.shortName}, --${option.longName}` : `--${option.longName}`;
      if (option.valueName) {
        optionText += ` <${option.valueName}>`;
      }
      registeredCommand.option(optionText, option.description);
      if (!option.validator) {
        continue;
      }

      validators.push(() => {
        option.validator!(registeredCommand[option.longName]);
      });
    }
  }
};

/**
 * Bootstraps all available CLI commands based on local package dependencies.
 */
export const bootstrap = async (rootPackageName = global.process.cwd()) => {
  const plugins = await findPlugins(rootPackageName);
  for (const [plugin, {providers}] of plugins) {
    if (!providers || !providers.commands) {
      continue;
    }

    for (const path of providers.commands) {
      try {
        registerWithProvider(cliRequire(plugin, path));
      } catch (error) {
        // Noop.
      }
    }
  }
};

/**
 * Starts the CLI program.
 */
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

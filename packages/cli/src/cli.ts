/* tslint:disable no-var-requires */
import {args, command, help, on, parse, version} from 'commander';
import packageJson from 'package-json';
import semver from 'semver';
import {CliCommandProvider} from './api';
import {fatalError, warning} from './reporting';
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
 * Bootstraps all available CLI commands based on local package dependencies by scanning for `"diez"` keys
 * in `package.json` and `.diezrc` files.
 */
export const bootstrap = async (rootPackageName = global.process.cwd()) => {
  try {
    const {version: latestVersion} = await packageJson('@diez/engine');
    if (semver.gt(latestVersion as string, diezVersion)) {
      warning('You are using an out-of-date version of Diez. Please upgrade to the latest version!');
    }
  } catch (_) {
    warning('Unable to check if Diez is up to date. Are you connected to the Internet?');
  }

  const plugins = await findPlugins(rootPackageName);
  for (const [plugin, {providers}] of plugins) {
    if (!providers || !providers.commands) {
      continue;
    }

    for (const path of providers.commands) {
      try {
        registerWithProvider(cliRequire(plugin, path));
      } catch (error) {
        warning('An invalid command provider was specified in the Diez configuration.');
      }
    }
  }
};

/**
 * Starts the CLI program.
 * @ignore
 */
export const run = async () => {
  await bootstrap();
  // istanbul ignore next
  on('command:*', () => {
    help();
  });

  parse(process.argv);
  // istanbul ignore if
  if (!args.length) {
    help();
  }
};

/* tslint:disable no-var-requires */
import {emitDiagnostics, enableAnalytics, Registry} from '@diez/storage';
import chalk from 'chalk';
import {args, command, help, on, parse, version} from 'commander';
import packageJson from 'package-json';
import semver from 'semver';
import {
  CliCommandExtension,
  CliCommandOption,
  CliCommandProvider,
  CliDefaultOptions,
  CliOptionValidator,
  ValidatedCommand,
} from './api';
import {fatalError, info, warning} from './reporting';
import {cliRequire, diezVersion, findPlugins} from './utils';

version(diezVersion).name('diez');

declare global {
  namespace NodeJS {
    interface Global {
      // Captured once at startup in case the value is mutated after starting up.
      doNotTrack: boolean;
    }
  }
}

/**
 * Registers a list of options with a command.
 * @internal
 */
const registerOptions = (validatedCommand: ValidatedCommand, options?: CliCommandOption[]) => {
  if (!options) {
    return;
  }

  for (const option of options) {
    let optionText = option.shortName ? `-${option.shortName}, --${option.longName}` : `--${option.longName}`;
    if (option.valueName) {
      optionText += ` <${option.valueName}>`;
    }
    validatedCommand.command.option(optionText, option.description);
    if (!option.validator) {
      continue;
    }

    validatedCommand.validators.push(option.validator);
  }
};

/**
 * Registers a command from its provider.
 * @internal
 */
const registerWithProvider = async (provider: CliCommandProvider, defaultOptions?: any) => {
  if (provider.preinstall) {
    await provider.preinstall();
  }

  const validators: CliOptionValidator[] = [];

  const registeredCommand = command(provider.name).action(async (...options: any[]) => {
    try {
      const commandWithDefaults = Object.assign({}, defaultOptions, registeredCommand);
      for (const validator of validators) {
        await validator(commandWithDefaults);
      }
      await provider.action.call(undefined, commandWithDefaults, ...options);
    } catch (error) {
      fatalError(error.message);
    }
  });

  const validatedCommand = {
    validators,
    command: registeredCommand,
  };

  if (provider.description) {
    registeredCommand.description(provider.description);
  }

  registerOptions(validatedCommand, provider.options);

  return validatedCommand;
};

/**
 * Registers with providers.
 * @internal
 */
const registerWithProviders = async (
  registry: Map<string, ValidatedCommand>,
  plugin: string,
  options: CliDefaultOptions,
  providers?: Iterable<string>,
) => {
  if (!providers) {
    return;
  }

  for (const path of providers) {
    try {
      const provider = cliRequire<CliCommandProvider>(plugin, path);
      if (registry.has(provider.name)) {
        warning(`Ignoring attempt to reregister command ${provider.name}.`);
        continue;
      }

      registry.set(provider.name, await registerWithProvider(provider, options[provider.name]));
    } catch (error) {
      warning(`An invalid command provider was specified at ${path}.`);
      warning(error.message);
    }
  }
};

/**
 * Bootstraps all available CLI commands based on local package dependencies by scanning for `"diez"` keys
 * in `package.json` and `.diezrc` files.
 */
export const bootstrap = async (rootPackageName = global.process.cwd(), bootstrapRoot?: string) => {
  try {
    const {version: latestVersion} = await packageJson('@diez/cli-core');
    if (semver.gt(latestVersion as string, diezVersion)) {
      warning('You are using an out-of-date version of Diez. Please upgrade to the latest version!');
    }
  } catch (_) {
    warning('Unable to check if Diez is up to date. Are you connected to the Internet?');
  }

  const plugins = await findPlugins(rootPackageName, bootstrapRoot);
  const registeredCommands = new Map<string, ValidatedCommand>();
  const deferredExtensions: CliCommandExtension[] = [];
  const options: CliDefaultOptions = {};
  if (plugins.has('.')) {
    Object.assign(options, plugins.get('.')!.commandOptions);
  }
  for (const [plugin, {providers}] of plugins) {
    if (!providers) {
      continue;
    }

    await registerWithProviders(registeredCommands, plugin, options, providers.commands);

    if (!providers.extensions) {
      continue;
    }

    for (const path of providers.extensions) {
      try {
        deferredExtensions.push(cliRequire<CliCommandExtension>(plugin, path));
      } catch (error) {
        warning(`An invalid command extension was specified at ${path}.`);
      }
    }
  }

  for (const extension of deferredExtensions) {
    const validatedCommand = registeredCommands.get(extension.name);
    if (!validatedCommand) {
      continue;
    }
    registerOptions(validatedCommand, extension.options);
  }
};

/**
 * Starts the CLI program.
 * @ignore
 */
export const run = async (bootstrapRoot?: string) => {
  const analyticsEnabled = await Registry.get('analyticsEnabled');
  global.doNotTrack = !analyticsEnabled;
  if (analyticsEnabled === undefined && !process.argv.includes('analytics')) {
    console.log(chalk.underline('Anonymous aggregate analytics:'));
    info(`
Diez collects diagnostic and usage data each time you use the CLI using an
anonymous, randomly generated ID. We use these data to help improve our
services.

By default, anonymous aggregate analytics will be activated the next time you
run a Diez command. Learn more about what data we collect and how to opt out
here: https://diez.org/analytics`);
    await enableAnalytics();
  }

  if (!global.doNotTrack) {
    emitDiagnostics('activity', diezVersion);
  }

  await bootstrap(global.process.cwd(), bootstrapRoot);
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

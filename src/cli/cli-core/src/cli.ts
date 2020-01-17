/* tslint:disable no-var-requires */
import {emitDiagnostics, enableAnalytics, getCommandArguments, Registry} from '@diez/storage';
import {captureException, configureScope, getCurrentHub, init as initSentry} from '@sentry/node';
import {args, command, on, outputHelp, parse, version} from 'commander';
import {
  CliAction,
  CliCommandExtension,
  CliCommandOption,
  CliCommandProvider,
  CliDefaultOptions,
  CliOptionValidator,
  ModuleWrappedCliAction,
  ValidatedCommand,
} from './api';
import {Log} from './reporting';
import {cliRequire, diezVersion, findPlugins} from './utils';

version(diezVersion).name('diez');

declare global {
  namespace NodeJS {
    interface Global {
      // Captured once at startup in case the value is mutated after starting up.
      doNotTrack: boolean;
      analyticsUuid: string;
    }
  }
}

/**
 * Registers a list of options with a command.
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

const isModuleWrappedAction = (action: CliAction | ModuleWrappedCliAction): action is ModuleWrappedCliAction =>
  action.hasOwnProperty('default');

/**
 * Registers a command from its provider.
 */
const registerWithProvider = async (provider: CliCommandProvider, defaultOptions?: any) => {
  if (provider.preinstall) {
    await provider.preinstall();
  }

  const validators: CliOptionValidator[] = [];

  const registeredCommand = command(provider.name).action(async (...options: any[]) => {
    try {
      const commandWithDefaults = Object.assign({}, defaultOptions, registeredCommand);
      await Promise.all(validators.map((validator) => validator(commandWithDefaults)));
      const action = await provider.loadAction();
      const callable = isModuleWrappedAction(action) ? action.default : action;
      await callable.call(undefined, commandWithDefaults, ...options);
    } catch (error) {
      if (!global.doNotTrack) {
        captureException(error);
        const client = getCurrentHub().getClient();
        if (client) {
          await client.close(1000);
        }
      }

      if (error.stack) {
        Log.error(error.stack);
      } else {
        Log.error(error.message);
      }

      process.exit(1);
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
        Log.warning(`Ignoring attempt to reregister command ${provider.name}.`);
        continue;
      }

      registry.set(provider.name, await registerWithProvider(provider, options[provider.name]));
    } catch (error) {
      Log.warning(`An invalid command provider was specified at ${path}.`);
      Log.warning(error.message);
    }
  }
};

/**
 * Bootstraps all available CLI commands based on local package dependencies by scanning for `"diez"` keys
 * in `package.json` and `.diezrc` files.
 */
export const bootstrap = async (rootPackageName = global.process.cwd(), bootstrapRoot?: string) => {
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
        Log.warning(`An invalid command extension was specified at ${path}.`);
      }
    }
  }

  for (const extension of deferredExtensions) {
    for (const name of extension.names) {
      const validatedCommand = registeredCommands.get(name);
      if (!validatedCommand) {
        continue;
      }
      registerOptions(validatedCommand, extension.options);
    }
  }
};

/**
 * Starts the CLI program.
 * @ignore
 */
export const run = async (bootstrapRoot?: string) => {
  const analyticsEnabled = await Registry.get('analyticsEnabled');
  const doNotTrack = !!global.process.env.DIEZ_DO_NOT_TRACK;
  global.doNotTrack = !analyticsEnabled || doNotTrack;
  if (analyticsEnabled === undefined && !doNotTrack && !process.argv.includes('analytics')) {
    Log.infoTitle('Anonymous aggregate analytics:');
    Log.info(`
Diez collects diagnostic and usage data each time you use the CLI using an
anonymous, randomly generated ID. This ID is also used to report crashes
through Sentry (IP address storage is disabled). We use these data to help
improve our services.

By default, anonymous aggregate analytics and crash reporting will be activated
the next time you run a Diez command. Learn more about what data we collect and
how to opt out here: https://diez.org/analytics
`);
    await enableAnalytics();
  }

  if (!global.doNotTrack) {
    global.analyticsUuid = (await Registry.get('uuid'))!;
    emitDiagnostics('activity', diezVersion).catch(() => {
      // Noop. Ensures we don't crash on an uncaught Promise rejection if the analytics ping fails for any reason.
    });

    initSentry({
      dsn: 'https://58599c81fc834e9cb29d235c1e99b892@sentry.io/1460669',
      release: `v${diezVersion}`,
      beforeSend: (event) => {
        const stacktrace = event.exception && event.exception.values && event.exception.values[0].stacktrace;
        if (stacktrace && stacktrace.frames) {
          for (const frame of stacktrace.frames) {
            if (frame.filename && frame.filename.includes('@diez/')) {
              frame.filename = `app://${frame.filename.replace(/^.*@diez/, '/@diez')}`;
            }
          }
        }
        return event;
      },
    });

    configureScope((scope) => {
      scope.setUser({id: global.analyticsUuid});
      scope.setExtra('command_arguments', getCommandArguments());
    });
  }

  await bootstrap(global.process.cwd(), bootstrapRoot);
  // istanbul ignore next
  on('command:*', () => outputHelp());

  parse(process.argv);
  // istanbul ignore if
  if (!args.length) {
    outputHelp();
  }
};

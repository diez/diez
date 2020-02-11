import {Target} from '@diez/engine';
import {Command} from 'commander';

/**
 * A CLI action. Receives the arguments of a CLI command.
 */
export type CliAction = (command: any, ...args: any[]) => Promise<void>;

/**
 * A generic interface for a CLI command option validator. Options can be either a boolean
 * (for flags like `--option`) or a string (for flags like `--option <option-value>`).
 */
export type CliOptionValidator = (commandFlags: any) => Promise<void>;

/**
 * Provides a ledger for registered commands and their validators.
 * @ignore
 */
export interface ValidatedCommand {
  command: Command;
  validators: CliOptionValidator[];
}

/**
 * A generic interface for a CLI command option.
 */
export interface CliCommandOption {
  /**
   * The full name (`--longName`) of the command option. Should be specified without the leading dashes.
   */
  longName: string;
  /**
   * The description for the command option. Printed when the associated command is run with `--help`.
   */
  description?: string;
  /**
   * An optional, one-character option alias. e.g. `-t` for `--target`. Should be specified without the leading dash.
   */
  shortName?: string;
  /**
   * If provided, indicates that the option receives a string value. Without a value name, the option is assumed to
   * receive a boolean.
   */
  valueName?: string;
  /**
   * An optional validator which receives the call-time option. Errors emitted during validation will bubble up and
   * terminate the command.
   */
  validator?: CliOptionValidator;
}

/**
 * A module-wrapped CliAction.
 * @ignore
 */
export interface ModuleWrappedCliAction {
  default: CliAction;
}

/**
 * Provides a generic interface for a CLI command.
 */
export interface CliCommandProvider {
  /**
   * The name of the command.
   */
  name: string;
  /**
   * The action that should be executed when the command is invoked by name.
   */
  loadAction (): Promise<CliAction | ModuleWrappedCliAction>;
  /**
   * The command description.
   */
  description: string;
  /**
   * A set of options the command should receive. These are passed into the action as properties
   * of the first argument.
   */
  options?: CliCommandOption[];
  /**
   * An optional pre-registration hook to modify the command before it's bootstrapped.
   */
  preinstall?: (provider?: CliCommandProvider) => Promise<void>;
}

/**
 * Provides a generic interface for a CLI command extension.
 */
export interface CliCommandExtension {
  /**
   * The name of the command to extend.
   */
  names: string[];
  /**
   * A set of _additional_ options the command should receive.
   */
  options?: CliCommandOption[];
}

/**
 * A specification for a Component compiler target binding.
 */
export interface TargetBinding {
  [targetName: string]: string;
}

/**
 * Config-style default command options for `.diezrc`.
 */
export interface CliDefaultOptions {
  [command: string]: any;
}

/**
 * The full Diez configuration.
 */
export interface FullDiezConfiguration {
  /**
   * Paths to local providers associated
   */
  providers: Partial<{
    assemblers: {[target in Target]?: string};
    commands: Iterable<string>;
    extensions: Iterable<string>;
    extractors: Iterable<string>;
    targets: Iterable<string>;
  }>;
  commandOptions: CliDefaultOptions;
}

/**
 * A Diez configuration, which can be provided by a module either as the `"diez"` key in `package.json` or in a separate
 * `.diezrc` file located at the project root.
 *
 * See [here](https://github.com/diez/diez/blob/master/src/compiler/targets/.diezrc) for an example.
 */
export type DiezConfiguration = Partial<FullDiezConfiguration>;

/**
 * Valid options that can be provided to the pager.
 */
export interface PagerOptions {
  source: string;
}

/**
 * Supported package managers
 */
export enum PackageManagers {
  Npm = 'npm',
  Yarn = 'yarn',
}

/**
 * Describes package manager commands grouped by package manager.
 */
export type PackageManagerCommands = {
  [key in PackageManagers]: {
    [key: string]: string,
  };
};

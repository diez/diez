/**
 * A CLI action.
 */
export type CliAction = (command: any, ...args: string[]) => void;

/**
 * A generic interface for a CLI command option.
 */
export type CliOptionValidator = (value: string | boolean) => void;

/**
 * A generic interface for a CLI command option.
 */
export interface CliCommandOption {
  longName: string;
  description: string;
  shortName?: string;
  valueName?: string;
  validator?: CliOptionValidator;
}

/**
 * A generic interface for a CLI command.
 */
export interface CliCommandProvider {
  name: string;
  description: string;
  action: CliAction;
  aliases?: string[];
  options?: CliCommandOption[];
}

/**
 * A specification for a Component compiler target prefab.
 */
export interface TargetPrefab {
  [sourceName: string]: {
    [componentName: string]: string;
  };
}

/**
 * A Diez configuration.
 */
export type DiezConfiguration = Partial<{
  providers: Partial<{
    commands: Iterable<string>;
    templates: Iterable<string>;
    targets: Iterable<string>;
  }>;
  compiler: Partial<{
    prefabs: {
      [targetName: string]: TargetPrefab;
    };
  }>;
}>;

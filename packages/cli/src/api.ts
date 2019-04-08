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

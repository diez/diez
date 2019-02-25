/**
 * A CLI configuration.
 */
export interface CliConfiguration {
  cli?: {
    providers: string[];
  };
}

/**
 * A CLI action.
 */
export type CliAction = (...args: string[]) => void;

/**
 * A generic interface for a CLI command.
 */
export interface CliCommandProvider {
  command: string;
  description: string;
  action: CliAction;
}

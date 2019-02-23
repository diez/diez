import chalk from 'chalk';

/**
 * A CLI configuration.
 */
export interface CliConfiguration {
  cliProvider?: string;
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

/**
 * A CliCommandProvider factory.
 * @param command
 * @param description
 * @param action
 */
export const provideCommand = (command: string, description: string, action: CliAction): CliCommandProvider => (
  {command, description, action});

/**
 * Report a fatal error and exit.
 * @param message
 */
export const fatalError = (message: string) => {
  console.log(chalk.red(message));
  process.exit(1);
};

/**
 * Log a success message and exit.
 * @param message
 */
export const success = (message: string) => {
  console.log(chalk.green(message));
  process.exit(0);
};

/**
 * Log an info message.
 */
export const info = (message: string) => {
  console.log(chalk.blue(message));
};

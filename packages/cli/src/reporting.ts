/* istanbul ignore file */
import chalk from 'chalk';

/**
 * Reports a fatal error and exits.
 */
export const fatalError = (message: string) => {
  if (message) {
    console.log(chalk.red(message));
  }
  process.exit(1);
};

/**
 * Logs a success message and exits.
 */
export const success = (message: string) => {
  console.log(chalk.green(message));
  process.exit(0);
};

/**
 * Logs an info message.
 */
export const info = (message: string) => {
  console.log(chalk.blue(message));
};

/**
 * Logs a warning message.
 */
export const warning = (message: string) => {
  console.log(chalk.yellow(message));
};

/**
 * Logs an inline code snippet.
 */
export const inlineCodeSnippet = (message: string) => chalk.green(message);

/**
 * Logs a code snippet.
 */
export const code = (message: string) => {
  console.log(
    `\n${chalk.green(message.split('\n').map((line) => `    ${inlineCodeSnippet(line)}`).join('\n'))}`,
  );
};

/* istanbul ignore file */
import chalk from 'chalk';

/**
 * Reports a fatal error and exits.
 */
export const fatalError = (message: string): never => {
  if (message) {
    console.log(chalk.red(message));
  }
  return process.exit(1);
};

/**
 * Logs a success message and exits.
 */
export const success = (message: string): never => {
  console.log(chalk.green(message));
  return process.exit(0);
};

/**
 * Logs an info message.
 */
export const info = (message: string) => {
  console.log(chalk.blue(message));
};

const warnings = new Set<string>();

/**
 * Logs a warning message.
 */
export const warning = (message: string) => {
  warnings.add(message);
  console.log(chalk.yellow(message));
};

/**
 * Logs a warning message.
 */
export const warningOnce = (message: string) => {
  if (!warnings.has(message)) {
    warning(message);
  }
};

/**
 * Returns an inline code snippet.
 */
export const inlineCodeSnippet = (message: string) => chalk.green(message);

/**
 * Logs an inline comment.
 */
export const inlineComment = (message: string) => chalk.hex('#5623ee')(message);

/**
 * Logs a code snippet.
 */
export const code = (message: string) => {
  console.log(
    `\n${chalk.green(message.split('\n').map((line) => `    ${inlineCodeSnippet(line)}`).join('\n'))}`,
  );
};

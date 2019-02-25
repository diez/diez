import chalk from 'chalk';

/**
 * Report a fatal error and exit.
 * @param message
 */
export const fatalError = (message: string) => {
  if (message) {
    console.log(chalk.red(message));
  }
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

/* istanbul ignore file */
import chalk from 'chalk';
import {clearLine, cursorTo} from 'readline';

const green = chalk.rgb(60, 221, 117);

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
  console.log(green(message));
  return process.exit(0);
};

/**
 * Returns an info message.
 */
export const inlineInfo = (message: string) => chalk.rgb(30, 197, 248)(message);

/**
 * Logs an info message.
 */
export const info = (message: string) => {
  console.log(inlineInfo(message));
};

const warnings = new Set<string>();

/**
 * Returns a warning message.
 */
export const inlineWarning = (message: string) => chalk.rgb(246, 229, 0)(message);

/**
 * Logs a warning message.
 */
export const warning = (message: string) => {
  warnings.add(message);
  console.log(inlineWarning(message));
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
 * Returns an inline comment.
 */
export const inlineComment = (message: string) => chalk.rgb(216, 60, 221)(message);

/**
 * Logs a comment.
 */
export const comment = (message: string) => console.log(inlineComment(message));

/**
 * Returns an inline code snippet.
 *
 * TODO: rename this to `inlineCode`.
 */
export const inlineCodeSnippet = (message: string) => chalk.rgb(60, 221, 117)(message);

/**
 * Logs a code snippet.
 */
export const code = (message: string) => {
  console.log(
    `\n${green(message.split('\n').map((line) => `    ${inlineCodeSnippet(line)}`).join('\n'))}`,
  );
};

/**
 * Display the provided message alongside a simple spinner.
 */
export const loadingMessage = (message: string) => {
  const ticks = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let displayMessage = message;
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`${ticks[i++ % 10]} ${displayMessage}\r`);
  }, 30);

  return {
    update (newMessage: string) {
      cursorTo(process.stdout, 0);
      clearLine(process.stdout, 0);
      displayMessage = newMessage;
    },
    stop () {
      clearInterval(interval);
      cursorTo(process.stdout, 0);
      clearLine(process.stdout, 0);
    },
  };
};

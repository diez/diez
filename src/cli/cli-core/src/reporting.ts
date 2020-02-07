/* istanbul ignore file */
import chalk from 'chalk';
import {clearLine, cursorTo} from 'readline';

const infoChalk = chalk.rgb(30, 197, 248);

/**
 * A simple class for formatting messages.
 *
 * Static class members return formatted strings.
 */
export class Format {

  /**
   * Formats information messages.
   */
  static info = (...messages: string[]) => infoChalk(messages.join('\n'));

  /**
   * Formats info titles.
   */
  static infoTitle = (...messages: string[]) => infoChalk.underline(messages.join('\n'));

  /**
   * Formats warning messages.
   */
  static warning = (...messages: string[]) => chalk.rgb(246, 229, 0)(messages.join('\n'));

  /**
   * Formats error messages.
   */
  static error = (...messages: string[]) => chalk.red(messages.join('\n'));

  /**
   * Formats comment messages.
   */
  static comment = (...messages: string[]) => chalk.rgb(216, 60, 221)(messages.join('\n'));

  /**
   * Formats code messages.
   */
  static code = (...messages: string[]) => chalk.rgb(60, 221, 117)(messages.join('\n'));
}

/**
 * Tracks warning messages.
 */
const warnings = new Set<string>();

/**
 * A simple class for logging messages.
 *
 * Static class members log formatted strings.
 */
export class Log {
  /**
   * Logs information messages.
   */
  static info = (...messages: string[]) => console.log(Format.info(...messages));

  /**
   * Logs information titles.
   */
  static infoTitle = (...messages: string[]) => console.log(Format.infoTitle(...messages));

  /**
   * Logs warning messages.
   */
  static warning = (...messages: string[]) => {
    for (const message in messages) {
      warnings.add(message);
    }
    console.log(Format.warning(...messages));
  };

  /**
   * Logs warning messages once.
   */
  static warningOnce = (...messages: string[]) => {
    for (const message in messages) {
      if (!warnings.has(message)) {
        Log.warning(message);
      }
    }
  };

  /**
   * Logs error messages.
   */
  static error = (...messages: string[]) => console.log(Format.error(...messages));

  /**
   * Logs comment messages.
   */
  static comment = (...messages: string[]) => console.log(Format.comment(...messages));

  /**
   * Logs code messages.
   */
  static code = (...messages: string[]) => console.log(Format.code(...messages.map((message) =>
    `\n${Format.code(message.split('\n').map((line) => `    ${line}`).join('\n'))}`)));
}

/**
 * Display the provided message alongside a simple spinner.
 */
export const loadingMessage = (message: string) => {
  const ticks = ['-', '\\', '|', '/'];
  let displayMessage = message;
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`${ticks[i++ % ticks.length]} ${displayMessage}\r`);
  }, 130);

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

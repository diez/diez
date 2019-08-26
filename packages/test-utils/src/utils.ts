import {parse} from 'commander';

/**
 * Assigns a mock to a property on an object, and returns both the mock and a method to restore it.
 */
export const assignMock = (original: any, property: string, value: any = jest.fn()) => {
  const prototype = Object.getOwnPropertyDescriptor(original, property);
  Object.defineProperty(original, property, {value});
  return {
    mock: value,
    restore: () => {
      Object.defineProperty(original, property, prototype || {});
    },
  };
};

/**
 * Runs a Diez command.
 */
export const diezRun = (command: string, bootstrapRoot?: string) => new Promise(async (resolve, reject) => {
  try {
    // @ts-ignore
    // tslint:disable-next-line:no-implicit-dependencies
    const {bootstrap} = await import('@diez/cli-core');
    await bootstrap(global.process.cwd(), bootstrapRoot);
    parse(['node', 'diez'].concat(command.trim().split(/\s+/)));
    process.nextTick(() => resolve());
  } catch (_) {
    reject(new Error('@diez/cli-core is not available.'));
  }
});

import {CompilerOptions} from '@diez/compiler';
import {resolve} from 'path';

/**
 * The root of all native sources provided by this package.
 * @ignore
 */
export const sourcesPath = resolve(__dirname, '..', 'sources');

/**
 * A command validator helper which bans targets other than the
 */
export const onlyTarget = (option: keyof CompilerOptions, options: CompilerOptions, target: string) => {
  if (options[option] && options.target !== target) {
    throw new Error(`--${option} is invalid unless --target=${target}`);
  }
};

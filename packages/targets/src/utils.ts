import {ComponentModule} from '@diez/compiler';
import {tmpdir} from 'os';
import {join, resolve} from 'path';
import {v4} from 'uuid';

/**
 * Loads and returns a component module asynchronously.
 *
 * @param projectRoot - The root of the project providing a component module.
 */
export const loadComponentModule = async (projectRoot: string): Promise<ComponentModule> => await import(projectRoot);

/**
 * Provides a unique temporary filename.
 */
export const getTempFileName = () => join(tmpdir(), v4());

/**
 * The root of all native sources provided by this package.
 */
export const sourcesPath = resolve(__dirname, '..', 'sources');

import {CompilerProgram, PropertyType} from '@diez/compiler';
import {tmpdir} from 'os';
import {join, resolve} from 'path';
import {v4} from 'uuid';

/**
 * Provides a unique temporary filename.
 */
export const getTempFileName = () => join(tmpdir(), v4());

/**
 * The root of all native sources provided by this package.
 */
export const sourcesPath = resolve(__dirname, '..', 'sources');

/**
 * Checks if a property type is a local type.
 */
export const isLocalType = (type: PropertyType, program: CompilerProgram) =>
  program.localComponentNames.includes(type as string);

// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {ColorData} from '@diez/prefabs';

/**
 * Returns a string with a valid CSS <color> value from a Color prefab instance.
 */
export const colorToCss = ({h, s, l, a}: ColorData) => `hsla(${h * 360}, ${s * 100}%, ${l * 100}%, ${a})`;

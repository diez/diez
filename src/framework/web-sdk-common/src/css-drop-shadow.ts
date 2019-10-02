// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {DropShadowData} from '@diez/prefabs';
import {colorToCss} from './css-color';

/**
 * Returns a string containing a valid CSS value for <box-shadow> and/or <text-shadow> from a [[Shadow]] prefab
 * instance.
 */
export const dropShadowToCss = (shadow: DropShadowData) => {
  return `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px ${colorToCss(shadow.color)}`;
};

/**
 * Returns a string containing a valid CSS <filter> value from a [[Shadow]] prefab instance.
 */
export const dropShadowToFilterCss = (shadow: DropShadowData) => {
  // Since the `DropShadowData`'s radius value represents double the standard deviation of the desired Guassian blur,
  // and `drop-shadow` expects the standard deviation, the value must be cut in half.
  // See https://css-tricks.com/breaking-css-box-shadow-vs-drop-shadow/#comment-1612592
  const radius = shadow.radius / 2;
  return `drop-shadow(${shadow.offset.x}px ${shadow.offset.y}px ${radius}px ${colorToCss(shadow.color)})`;
};

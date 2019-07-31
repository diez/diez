import {DropShadowData} from '@diez/prefabs';

/**
 * Returns a string containing a valid CSS value for <box-shadow> and/or <text-shadow> from a [[Shadow]] prefab
 * instance.
 */
export const dropShadowToCss = (shadow: DropShadowData) => {
  // TODO: Use `colorToCss` once it's moved into this package.
  const {h, s, l, a} = shadow.color;
  const color = `hsla(${h * 360}, ${s * 100}%, ${l * 100}%, ${a})`;
  return `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px ${color}`;
};

/**
 * Returns a string containing a valid CSS <filter> value from a [[Shadow]] prefab instance.
 */
export const dropShadowToFilterCss = (shadow: DropShadowData) => {
  // TODO: Use `colorToCss` once it's moved into this package.
  const {h, s, l, a} = shadow.color;
  const color = `hsla(${h * 360}, ${s * 100}%, ${l * 100}%, ${a})`;

  // Since the `DropShadowData`'s radius value represents double the standard deviation of the desired Guassian blur,
  // and `drop-shadow` expects the standard deviation, the value must be cut in half.
  // See https://css-tricks.com/breaking-css-box-shadow-vs-drop-shadow/#comment-1612592
  const radius = shadow.radius / 2;
  return `drop-shadow(${shadow.offset.x}px ${shadow.offset.y}px ${radius}px ${color})`;
};

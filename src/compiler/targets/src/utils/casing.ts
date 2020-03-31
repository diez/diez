import changeCase from 'change-case';

/**
 * Describes possible casing values.
 */
export enum Case {
  Camel = 'camel',
  Snake = 'snake',
  Kebab = 'kebab',
  Pascal = 'pascal',
  Lower = 'lower',
}

/**
 * Convert value to provided case style.
 */
export const applyCase = (value: string, style: Case = Case.Camel) => {
  return changeCase[style](value);
};

/**
 * Join an string[] value into a single string with the given casing style and separator.
 * @example joinToCase(['firstItem', 'secondItem'], Case.Snake, '-') // => "first_item-second_item"
 */
export const joinToCase = (
  values: string[],
  style: Case = Case.Camel,
  separator: string = '.',
  prefix: string = '',
  suffix: string = '',
) => {
  return values
    .map((value) => {
      const cased = applyCase(value, style);
      return `${prefix}${cased}${suffix}`;
    })
    .join(separator);
};

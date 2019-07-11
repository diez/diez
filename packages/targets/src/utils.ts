import {CompilerOptions, TargetComponentProperty} from '@diez/compiler';
import {Color} from '@diez/prefabs';
import {kebabCase} from 'change-case';
import {resolve} from 'path';
import {RuleTuples, StyleGroups} from './targets/web.api';

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

/**
 * Returns a string with a valid CSS <color> value from a Color prefab instance.
 * @ignore
 */
export const colorToCss = ({h, s, l, a}: Color) => `hsla(${h * 360}, ${s * 100}%, ${l * 100}%, ${a})`;

/**
 * Casts to `string` and joins all arguments in kebab-case.
 * @ignore
 */
export const joinToKebabCase = (...args: any[]) => kebabCase(args.join('-'));

/**
 * Creates or retrieves a style group and adds the provided style rules.
 * @ignore
 */
export const upsertStyleGroup = (ruleGroup: StyleGroups, groupName: string, rules: RuleTuples) => {
  if (!ruleGroup.has(groupName)) {
    ruleGroup.set(groupName, new Map());
  }

  const groupDeclaration = ruleGroup.get(groupName)!;
  for (const [rule, value] of rules) {
    groupDeclaration.set(rule, value);
  }
};

/**
 * A handlebars helper for mapping serialized array structures to a constructor assignment.
 *
 * For example, given a component property like `fonts: Fonts[][]`, we want to create output like:
 *
 * `this.fonts = fonts.map((value1) => value1.map((value2) => new Font(value2)));`
 * @ignore
 */
export const webComponentListHelper = (key: string, property: TargetComponentProperty) => {
  if (!property.depth || property.isPrimitive) {
    throw new Error(`Property ${key} is not a component list type.`);
  }

  const rawType = (property.type as string).replace(/\[\]/g, '');
  let listAssignment = `(value${property.depth}) => new ${rawType}(value${property.depth})`;
  for (let i = property.depth - 1; i > 0; --i) {
    listAssignment = `(value${i}) => value${i}.map(${listAssignment})`;
  }
  return `this.${key} = ${key}.map(${listAssignment});`;
};

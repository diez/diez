import {CompilerOptions} from '@diez/compiler';
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

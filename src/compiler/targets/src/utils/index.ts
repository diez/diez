import {CompilerOptions, TargetProperty, regexES6ReservedWord} from '@diez/compiler-core';
import {kebabCase, camelCase, camel} from 'change-case';
import {resolve} from 'path';

/**
 * The root of all native sources provided by this package.
 * @ignore
 */
export const sourcesPath = resolve(__dirname, '..', '..', 'sources');

/**
 * A command validator helper which bans targets other than the
 */
export const onlyTarget = (option: keyof CompilerOptions, options: CompilerOptions, target: string) => {
  if (options[option] && options.target !== target) {
    throw new Error(`--${option} is invalid unless --target=${target}`);
  }
};

/**
 * Casts to `string` and joins all arguments in kebab-case.
 * @ignore
 */
export const joinToKebabCase = (...args: any[]) => kebabCase(args.join('-'));

/**
 * A handlebars helper for mapping serialized array structures to a constructor assignment.
 *
 * For example, given a component property like `fonts: Fonts[][]`, we want to create output like:
 *
 * `this.fonts = fonts.map((value1) => value1.map((value2) => new Font(value2)));`
 * @ignore
 */
export const webComponentListHelper = (property: TargetProperty) => {
  if (!property.depth || !property.isComponent) {
    throw new Error(`Property ${property.name} is not a component list type.`);
  }

  const rawType = (property.type as string).replace(/\[\]/g, '');
  let listAssignment = `(value${property.depth}) => new ${rawType}(value${property.depth})`;
  for (let i = property.depth - 1; i > 0; --i) {
    listAssignment = `(value${i}) => value${i}.map(${listAssignment})`;
  }
  return `this.${property.name} = ${property.name}.map(${listAssignment});`;
};

/**
 * Generates an array of united style sheet variables from the provided unitless variable.
 *
 * The returned array does not include a variable definition for the unitless value.
 */
export const getUnitedStyleSheetVariables = (name: string, value: string) => {
  return ['px', 'pt', 'em', 'rem'].map((unit) => {
    return {
      name: `${name}-${unit}`,
      value: `${value}${unit}`,
    };
  });
};

const startsWithNumber = /^[0-9]/;

export const safeES6Property = (str: string) => {
  let sanitized = camelCase(str);

  if (regexES6ReservedWord.test(sanitized) || startsWithNumber.test(sanitized)) {
    sanitized = `_${sanitized}`
  }

  return sanitized;
}

// From: https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/LexicalStructure.html
const swiftReservedWords = [
  "associatedtype", "class", "deinit", "enum", "extension", "fileprivate", "func", "import", "init", "inout", "internal", "let", "open", "operator", "private", "protocol", "public", "static", "struct", "subscript", "typealias", "var",
  "break", "case", "continue", "default", "defer", "do", "else", "fallthrough", "for", "guard", "if", "in", "repeat", "return", "switch", "where", "while",
  "as", "Any", "catch", "false", "is", "nil", "rethrows", "super", "self", "Self", "throw", "throws", "true", "try",
  "associativity", "convenience", "dynamic", "didSet", "final", "get", "infix", "indirect", "lazy", "left", "mutating", "none", "nonmutating", "optional", "override", "postfix", "precedence", "prefix", "Protocol", "required", "right", "set", "Type", "unowned", "weak", "willSet"
]

export const safeSwiftIdentifier = (str: string) => {
  let sanitized = camelCase(str)

  if (swiftReservedWords.includes(sanitized)) {
    sanitized = `\`${sanitized}\``
  }

  if (startsWithNumber.test(sanitized)) {
    sanitized = `_${sanitized}`
  }

  return sanitized
}

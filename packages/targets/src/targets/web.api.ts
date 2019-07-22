import {TargetBinding, TargetOutput} from '@diez/compiler';
import {Component} from '@diez/engine';

/**
 * Describes an Web third party dependency.
 */
export interface WebDependency {
  packageJson: {
    name: string;
    versionConstraint: string;
  };
}

/**
 * Describes a Web binding.
 */
export interface WebBinding<T extends Component = Component> extends TargetBinding<T, WebOutput> {
  declarations?: string[];
  dependencies?: WebDependency[];
}

/**
 * Describes a style Declaration.
 * @ignore
 */
interface Declaration {
  [key: string]: string;
}

/**
 * Describes a single style Rule.
 * @ignore
 */
interface Rule {
  selector: string;
  declaration: Declaration;
  rules?: RuleList;
}

/**
 * Provides a common interface to manage lists of nested Style rules.
 *
 * For example, you can manage inserting, deleting and serializing `Rule` objects.
 *
 * @ignore
 */
export class RuleList {
  private rules: Map<string, Rule> = new Map();

  constructor (baseRules: Rule[] = []) {
    for (const rule of baseRules) {
      this.insertRule(rule);
    }
  }

  insertRule (rule: Rule) {
    if (!this.rules.has(rule.selector)) {
      this.rules.set(rule.selector, rule);
    }

    const ourRule = this.rules.get(rule.selector)!;
    Object.assign(ourRule.declaration, rule.declaration);
    return ourRule;
  }

  deleteRule (rule: Rule) {
    this.rules.delete(rule.selector);
  }

  clear () {
    this.rules.clear();
  }

  serialize (): Rule[] {
    return Array.from(this.rules).map(([_, value]) => {
      if (value.rules) {
        return Object.assign(value, {rules: value.rules.serialize()});
      }
      return value;
    });
  }
}

/**
 * Describes a collection of tuples containing CSS rules and values.
 * @ignore
 */
export type RuleTuples = [string, string][];

/**
 * Describes interfaces related to style rules.
 * @ignore
 */
export interface StyleSheet {
  variables: Map<string, string>;
  font: RuleList;
  styles: RuleList;
}

/**
 * A handlebars token for a style variable.
 * @ignore
 */
export interface StyleVariableToken {
  name: string;
  value: string;
  isNumber: boolean;
}

/**
 * A collection of handlebars tokens for styles.
 */
export interface StyleTokens {
  styleVariables: StyleVariableToken[];
  styleFonts: Rule[];
  styleSheets: Rule[];
}

/**
 * Describes the complete output for a transpiled Web target.
 */
export interface WebOutput extends TargetOutput<WebDependency, WebBinding> {
  sources: Set<string>;
  declarations: Set<string>;
  declarationImports: Set<string>;
  styleSheet: StyleSheet;
}

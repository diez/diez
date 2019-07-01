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
 * Describes a collection of groups of CSS rules.
 * @ignore
 */
export type StyleGroups = Map<string, Map<string, string>>;

/**
 * Describes a collection of tuples containing CSS rules and values.
 * @ignore
 */
export type RuleTuples = [string, string][];

/**
 * Describes interfaces related to style rules.
 * @ignore
 */
export interface Styles {
  variables: Map<string, string>;
  ruleGroups: StyleGroups;
  fonts: StyleGroups;
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
 * A handlebars token for a style rule group.
 * @ignore
 */
export interface StyleRuleGroupToken {
  name: string;
  values: RuleTuples;
}

/**
 * A collection of handlebars tokens for styles.
 */
export interface StyleTokens {
  styleVariables: StyleVariableToken[];
  styleRuleGroups: StyleRuleGroupToken[];
  styleFonts: RuleTuples[];
}

/**
 * Describes the complete output for a transpiled Web target.
 */
export interface WebOutput extends TargetOutput<WebDependency, WebBinding> {
  sources: Set<string>;
  declarations: Set<string>;
  declarationImports: Set<string>;
  styles: Styles;
}

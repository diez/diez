import {TargetBinding, TargetOutput} from '@diez/compiler';
import {Component} from '@diez/engine';

declare module '@diez/compiler/types/api' {
  /**
   * Extends CompilerOptions for web.
   */
  export interface CompilerOptions {
    js?: boolean;
    css?: boolean;
    scss?: boolean;
  }
}

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
 * Describes an Web binding.
 */
export interface WebBinding<T extends Component = Component> extends TargetBinding<T, WebOutput> {
  declarations?: string[];
  dependencies?: WebDependency[];
}

/**
 * Describes a collection of groups of CSS rules.
 */
export type StyleGroups = Map<string, Map<string, string>>;

/**
 * Describes a collection of tuples containing CSS rules and values.
 */
export type RuleTuples = [string, string][];

/**
 * Describes interfaces related to style rules.
 */
export interface Styles {
  variables: Map<string, string>;
  ruleGroups: StyleGroups;
  fonts: StyleGroups;
}

/**
 * Describes the complete output for a transpiled Web target.
 */
export interface WebOutput extends TargetOutput<WebDependency, WebBinding> {
  sources: Set<string>;
  declarations: Set<string>;
  declarationImports: Set<string>;
  styles: Styles;
  staticFolder: string;
}

/**
 * Describes the supported style targets.
 */
export enum StyleOutputs {
  css = 'css',
  scss = 'scss',
}
